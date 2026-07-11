import { chromium } from "playwright";
import { Redenv } from "@redenv/client";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import os from "os";

const CONFIG_DIR = path.join(os.homedir(), ".config", "fetchy-sync");
const ENV_PATH = path.join(CONFIG_DIR, ".env");
const PROFILE_DIR = path.join(CONFIG_DIR, "browser-profile");

// Parse .env manually from the global config directory
const envConfig = fs.existsSync(ENV_PATH)
  ? dotenv.parse(fs.readFileSync(ENV_PATH))
  : {};

// Configuration
const REDENV_TOKEN = envConfig.REDENV_TOKEN || process.env.REDENV_TOKEN;
const REDENV_TOKEN_ID =
  envConfig.REDENV_TOKEN_ID || process.env.REDENV_TOKEN_ID;
const REDENV_UPSTASH_URL =
  envConfig.REDENV_UPSTASH_URL || process.env.REDENV_UPSTASH_URL;
const REDENV_UPSTASH_TOKEN =
  envConfig.REDENV_UPSTASH_TOKEN || process.env.REDENV_UPSTASH_TOKEN;
const FB_EMAIL = envConfig.FB_EMAIL || process.env.FB_EMAIL;
const FB_PASSWORD = envConfig.FB_PASSWORD || process.env.FB_PASSWORD;
const PROJECT = "fetchy";

if (
  !REDENV_TOKEN ||
  !REDENV_TOKEN_ID ||
  !REDENV_UPSTASH_URL ||
  !REDENV_UPSTASH_TOKEN
) {
  console.error(
    "❌ Missing required .env variables (REDENV_TOKEN, REDENV_TOKEN_ID, REDENV_UPSTASH_URL, REDENV_UPSTASH_TOKEN)",
  );
  process.exit(1);
}

const redenv = new Redenv({
  project: PROJECT,
  environment: "production",
  token: REDENV_TOKEN,
  tokenId: REDENV_TOKEN_ID,
  upstash: {
    url: REDENV_UPSTASH_URL,
    token: REDENV_UPSTASH_TOKEN,
  },
  log: "low",
});

async function run() {
  console.log("🚀 Starting Cookie Sync...");

  // Use a persistent context from the global config directory so we don't need to login every time.
  console.log(`Launching visible browser to bypass bot detection...`);

  if (!envConfig.BROWSER_EXECUTABLE && !envConfig.BROWSER_CHANNEL) {
    if (process.stdout.isTTY) {
      const readline = await import("readline/promises");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      console.log("\n🌐 No browser configured in config!");
      console.log("1) Google Chrome (default)");
      console.log("2) Microsoft Edge");
      console.log("3) Custom Executable");
      const answer = await rl.question("Select browser (1/2/3) [1]: ");

      if (answer === "2") {
        envConfig.BROWSER_CHANNEL = "msedge";
      } else if (answer === "3") {
        const execPath = await rl.question(
          "Enter absolute path to executable: ",
        );
        envConfig.BROWSER_EXECUTABLE = execPath.trim();
      } else {
        envConfig.BROWSER_CHANNEL = "chrome";
      }
      rl.close();

      let envContent = fs.existsSync(ENV_PATH)
        ? fs.readFileSync(ENV_PATH, "utf-8")
        : "";
      if (envConfig.BROWSER_EXECUTABLE) {
        envContent += `\nBROWSER_EXECUTABLE='${envConfig.BROWSER_EXECUTABLE}'\n`;
      } else {
        envContent += `\nBROWSER_CHANNEL='${envConfig.BROWSER_CHANNEL}'\n`;
      }
      if (!fs.existsSync(CONFIG_DIR))
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
      fs.writeFileSync(ENV_PATH, envContent.trim() + "\n");
      console.log(`✅ Saved browser preference to ${ENV_PATH}\n`);
    } else {
      envConfig.BROWSER_CHANNEL = "chrome"; // Default fallback for background systemd tasks
    }
  }

  const launchOptions: any = {
    headless: false,
    viewport: { width: 1280, height: 720 },
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  };

  if (envConfig.BROWSER_EXECUTABLE) {
    launchOptions.executablePath = envConfig.BROWSER_EXECUTABLE;
    console.log(
      `Using custom browser executable: ${launchOptions.executablePath}`,
    );
  } else if (envConfig.BROWSER_CHANNEL) {
    launchOptions.channel = envConfig.BROWSER_CHANNEL;
    console.log(`Using browser channel: ${launchOptions.channel}`);
  } else {
    launchOptions.channel = "chrome"; // Default fallback
    console.log(`Using default browser channel: chrome`);
  }

  const context = await chromium.launchPersistentContext(
    PROFILE_DIR,
    launchOptions,
  );

  const page = await context.newPage();

  // ==========================================
  // FACEBOOK
  // ==========================================
  console.log("Navigating to Facebook...");
  await page.goto("https://www.facebook.com/", {
    waitUntil: "domcontentloaded",
  });

  // Check if we are logged in by looking for c_user cookie
  const fbCookies = await context.cookies("https://www.facebook.com");
  const fbIsLoggedIn = fbCookies.some((c) => c.name === "c_user");

  if (!fbIsLoggedIn) {
    if (FB_EMAIL && FB_PASSWORD) {
      console.log("Not logged into Facebook. Attempting automated login...");
      try {
        await page.goto("https://www.facebook.com/login", {
          waitUntil: "domcontentloaded",
        });
        await page.waitForSelector('input[name="email"]', { timeout: 10000 });
        await page.fill('input[name="email"]', FB_EMAIL);
        await page.fill('input[name="pass"]', FB_PASSWORD);
        await page.press('input[name="pass"]', "Enter");
        await page
          .waitForNavigation({ waitUntil: "networkidle", timeout: 15000 })
          .catch(() => {});
      } catch (e) {
        console.error("Facebook automated login encountered an error:", e);
      }
    } else {
      console.error(
        "❌ You are not logged into Facebook and no credentials were provided in .env!",
      );
      console.error(
        "👉 Please provide FB_EMAIL and FB_PASSWORD, or run 'bun run login' manually.",
      );
    }
  }

  let capturedDtsg: string | null = null;
  page.on("request", (request) => {
    if (request.url().includes("api/graphql/") && request.method() === "POST") {
      const postData = request.postData();
      if (postData && postData.includes("fb_dtsg=")) {
        const match = postData.match(/fb_dtsg=([^&]+)/);
        if (match && match[1]) {
          capturedDtsg = decodeURIComponent(match[1]);
        }
      }
    }
  });

  // Check again after login attempt
  let newFbCookies = await context.cookies("https://www.facebook.com");
  let finalFbIsLoggedIn = newFbCookies.some((c) => c.name === "c_user");

  if (!finalFbIsLoggedIn) {
    console.log("⚠️ Login failed or Captcha/2FA required.");
    console.log(
      "⏸️ Script paused. Please solve the challenge in the open browser window.",
    );

    // Wait indefinitely until the user solves it and the c_user cookie appears
    while (!finalFbIsLoggedIn) {
      await page.waitForTimeout(2000);
      newFbCookies = await context.cookies("https://www.facebook.com");
      finalFbIsLoggedIn = newFbCookies.some((c) => c.name === "c_user");
    }
    console.log("✅ Captcha/2FA solved! Resuming script...");
  }

  if (finalFbIsLoggedIn) {
    // Wait an extra few seconds for React/GraphQL to fire background requests to capture DTSG
    console.log(
      "Waiting for background GraphQL requests to capture FB_DTSG...",
    );
    await page.waitForTimeout(5000);

    const fbCookieString = newFbCookies
      .filter((c) => c.name === "c_user" || c.name === "xs")
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    console.log(`✅ Extracted FB_COOKIE (${newFbCookies.length} keys)`);
    if (capturedDtsg) console.log(`✅ Extracted FB_DTSG: ${capturedDtsg}`);

    console.log("Uploading FB credentials to Redenv...");
    await redenv.set("FB_COOKIE", fbCookieString);
    if (capturedDtsg) {
      await redenv.set("FB_DTSG_TOKEN", capturedDtsg);
    }
  }

  await context.close();
  console.log("\n🎉 Sync complete!");
}

run().catch((err) => {
  console.error("Fatal Error:", err);
  process.exit(1);
});

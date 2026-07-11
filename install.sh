#!/bin/bash

# Fetchy Local Cookie Sync Auto-Installer
echo "🚀 Welcome to the Fetchy Local Cookie Sync Auto-Installer"
echo "This script will set up the automatic Facebook/Instagram cookie syncing on your machine."
echo ""

# Ensure we are in the script's directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# 1. Install Bun if it's not installed
if ! command -v bun &> /dev/null; then
    echo "📦 Bun is not installed. Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    echo "✅ Bun installed."
else
    echo "✅ Bun is already installed."
fi

# 2. Install Node Dependencies
echo "📦 Installing project dependencies..."
bun install

# 3. Install Playwright Browsers (only chromium needed)
echo "🌐 Installing Playwright Chromium browser..."
bunx playwright install chromium

# 4. Prompt for Environment Variables
echo ""
echo "🔑 We need your credentials to automate the entire process."
echo "If you already have a .env file here, you can just press ENTER for all of these to skip."

read -p "Enter REDENV_TOKEN: " REDENV_TOKEN
read -p "Enter REDENV_TOKEN_ID: " REDENV_TOKEN_ID
read -p "Enter REDENV_UPSTASH_URL: " REDENV_UPSTASH_URL
read -p "Enter REDENV_UPSTASH_TOKEN: " REDENV_UPSTASH_TOKEN
echo ""
echo "📱 Social Media Credentials (for auto-login)"
read -p "Enter Facebook Email/Phone: " FB_EMAIL
read -p "Enter Facebook Password: " FB_PASSWORD
echo ""
read -p "Enter Sync Interval (e.g. '12h', '24h', '6h'): " SYNC_INTERVAL
SYNC_INTERVAL=${SYNC_INTERVAL:-"12h"}

echo ""
echo "🌐 Browser Selection for Automation"
echo "Facebook often blocks default Playwright. Select your native Chromium-based browser:"
echo "1) Google Chrome (default)"
echo "2) Microsoft Edge"
echo "3) Custom Executable (e.g., Brave, Zen Browser)"
read -p "Enter choice (1/2/3) [1]: " BROWSER_CHOICE
BROWSER_CHOICE=${BROWSER_CHOICE:-1}

# Create global config directory
CONFIG_DIR="$HOME/.config/fetchy-sync"
mkdir -p "$CONFIG_DIR"
ENV_PATH="$CONFIG_DIR/.env"

# Create .env if values were provided
if [ ! -z "$REDENV_TOKEN" ] && [ ! -z "$REDENV_TOKEN_ID" ]; then
    echo "REDENV_TOKEN=\"$REDENV_TOKEN\"" > "$ENV_PATH"
    echo "REDENV_TOKEN_ID=\"$REDENV_TOKEN_ID\"" >> "$ENV_PATH"
    echo "REDENV_UPSTASH_URL=\"$REDENV_UPSTASH_URL\"" >> "$ENV_PATH"
    echo "REDENV_UPSTASH_TOKEN=\"$REDENV_UPSTASH_TOKEN\"" >> "$ENV_PATH"
    echo "FB_EMAIL=\"$FB_EMAIL\"" >> "$ENV_PATH"
    echo "FB_PASSWORD='$FB_PASSWORD'" >> "$ENV_PATH"
    echo "IG_USERNAME=\"$IG_USERNAME\"" >> "$ENV_PATH"
    echo "IG_PASSWORD='$IG_PASSWORD'" >> "$ENV_PATH"
    
    if [ "$BROWSER_CHOICE" = "1" ]; then
        echo "BROWSER_CHANNEL='chrome'" >> "$ENV_PATH"
    elif [ "$BROWSER_CHOICE" = "2" ]; then
        echo "BROWSER_CHANNEL='msedge'" >> "$ENV_PATH"
    elif [ "$BROWSER_CHOICE" = "3" ]; then
        read -p "Enter absolute path to executable (e.g. /usr/bin/brave-browser): " BROWSER_EXEC
        echo "BROWSER_EXECUTABLE='$BROWSER_EXEC'" >> "$ENV_PATH"
    fi

    echo "✅ Saved configuration to $ENV_PATH"
else
    if [ ! -f "$ENV_PATH" ]; then
        echo "⚠️ No credentials provided and no config exists. You MUST configure before running."
    else
        echo "✅ Existing configuration found. Skipping credentials."
    fi
fi

# 5. Create Standalone System App
echo ""
echo "🔨 Setting up standalone app (Bypassing Bun compile limits for Playwright)..."
APP_DIR="$CONFIG_DIR/app"
mkdir -p "$APP_DIR"

# Copy source and install dependencies purely in the global config dir
cp index.ts "$APP_DIR/"
cp package.json "$APP_DIR/"
cd "$APP_DIR"
bun install --production

# Create the global executable wrapper
echo "🚚 Installing global command to ~/.local/bin/fetchy-sync..."
mkdir -p "$HOME/.local/bin"
cat <<EOF > "$HOME/.local/bin/fetchy-sync"
#!/bin/bash
cd $APP_DIR
BUN_PATH=\$(which bun)
\$BUN_PATH run index.ts
EOF
chmod +x "$HOME/.local/bin/fetchy-sync"
EXEC_PATH="$HOME/.local/bin/fetchy-sync"

# 6. Setup Systemd Service and Timer
echo ""
echo "⚙️ Setting up Systemd Service and Timer (Runs every $SYNC_INTERVAL)..."

SYSTEMD_DIR="$HOME/.config/systemd/user"
mkdir -p "$SYSTEMD_DIR"

# Create Service File
cat <<EOF > "$SYSTEMD_DIR/fetchy-cookie.service"
[Unit]
Description=Fetchy Cookie Sync Service

[Service]
Type=oneshot
WorkingDirectory=$CONFIG_DIR
Environment="DISPLAY=:0"
ExecStart=$EXEC_PATH
StandardOutput=append:$CONFIG_DIR/sync.log
StandardError=append:$CONFIG_DIR/sync.log
EOF

# Create Timer File
cat <<EOF > "$SYSTEMD_DIR/fetchy-cookie.timer"
[Unit]
Description=Timer for Fetchy Cookie Sync

[Timer]
OnBootSec=5min
OnUnitActiveSec=$SYNC_INTERVAL
Persistent=true

[Install]
WantedBy=timers.target
EOF

# Reload and enable
systemctl --user daemon-reload
systemctl --user enable --now fetchy-cookie.timer

echo "✅ Systemd Timer installed and started! (Persistent=true enabled)"
echo "You can check the logs anytime at: $CONFIG_DIR/sync.log"
echo "To check timer status, run: systemctl --user status fetchy-cookie.timer"

# 7. First time login
echo ""
echo "🎉 Installation Complete!"
echo "Running the standalone executable now for the first time..."
echo ""

# $EXEC_PATH

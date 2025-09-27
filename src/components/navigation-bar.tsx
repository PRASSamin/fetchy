"use client";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Link } from "./link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { cn } from "@/utils";
import { toast } from "sonner";
import { useRouter } from "@/hooks/useRouter";
import { Facebook, GitHub, Instagram } from "@mui/icons-material";
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Home, Menu } from "lucide-react";
import { PRAS_GITHUB } from "@/constants";
import { tools as toolsList } from "@/lib/tools/source";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
import { usePathname } from "@/i18n/navigation";
import { useDirection } from "@/hooks/useDir";
import { LocaleSwitcher } from "./locale-switcher";

export default function Navigation({ className = "" }) {
  const lang = useLocale();
  const t = useTranslations("NavigationBar");
  const rawT = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const dir = useDirection();
  const tools = toolsList
    .getTools()
    .sortBy("isAvailable", "desc", "boolean")
    .sortBy("isNew", "desc")
    .sortBy("isHot", "desc");

  const socials = [
    {
      label: "GitHub",
      url: PRAS_GITHUB,
      icon: <GitHub fontSize="medium" />,
      ringColor: "ring-purple-400/60",
    },
    {
      label: "Facebook",
      url: "https://www.facebook.com/prassamin7/",
      icon: <Facebook fontSize="medium" />,
      ringColor: "ring-blue-400/60",
    },
    {
      label: "Instagram",
      url: "https://instagram.com/PRASSamin",
      icon: <Instagram fontSize="medium" />,
      ringColor: "ring-pink-400/60",
    },
  ];

  useEffect(() => {
    if (sideBarOpen) {
      setSideBarOpen(false);
    }
  }, [pathname]);

  return (
    <header
      className={cn(
        "w-full h-16 bg-background/50 backdrop-blur-sm border-b border-border/50 py-4 relative z-50",
        className
      )}
    >
      <NavigationMenu className="flex max-w-auto justify-between items-center w-[calc(100vw-2rem)] lg:container mx-auto h-full [&>div]:w-full">
        <NavigationMenuList
          className={cn("h-16 px-4 w-full flex justify-between")}
        >
          <NavigationMenuItem className="font-bold flex h-full py-2">
            <Link
              rel="noreferrer noope1ner"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              <Image
                src={"/logo.png"}
                width={100}
                priority
                height={100}
                alt="fetchy"
                className="h-full py-2 w-auto"
              />
            </Link>
          </NavigationMenuItem>

          <div className="flex gap-2 justify-end">
            {/* Mobile Menu */}
            <Sheet open={sideBarOpen} onOpenChange={setSideBarOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size={"icon"}
                  className="[&_svg]:size-5"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={dir === "rtl" ? "left" : "right"}
                closeShow={false}
                className="h-full flex flex-col border-muted/70"
              >
                <div className="w-full h-full flex flex-col gap-2 overflow-y-auto show-scrollbar">
                  <Link
                    href={"/"}
                    className={`relative block space-y-1 rounded-lg p-4 bg-[#1a1a1a] text-white transition-all duration-200 border border-white/5 cursor-pointer w-full hover:shadow-md hover:border-white/10 hover:bg-[#222]`}
                  >
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <div className="bg-cyan-600/20 rounded p-1">
                        <Home className="text-cyan-400 w-5 h-5" />
                      </div>
                      {rawT("home")}
                    </div>
                  </Link>
                  {tools.map((tool, index) => {
                    const isComing = tool.isAvailable === "coming";
                    const isDisabled = !tool.isAvailable || isComing;

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (isDisabled) {
                            toast.info(
                              rawT("not_available_warning", {
                                type: "tool",
                              })
                            );
                            return;
                          }
                          router.push(tool.url.replace("/:lang", ""));
                        }}
                        className={`relative block space-y-1 rounded-lg p-4 bg-[#1a1a1a] text-white transition-all duration-200 border border-white/5 cursor-pointer w-full ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#222] hover:shadow-md hover:border-white/10"
                        }`}
                      >
                        <div className="text-sm font-semibold flex items-center gap-2">
                          <div className="bg-cyan-600/20 rounded p-1">
                            <tool.icon className="text-cyan-400 w-5 h-5" />
                          </div>
                          {tool.title}
                          {(tool.isHot || tool.isNew) && (
                            <span
                              className={`text-[10px] font-bold uppercase px-2  rounded-full ${
                                tool.isHot ? "bg-orange-500" : "bg-purple-600"
                              }`}
                            >
                              {tool.isHot
                                ? rawT("hot").toUpperCase()
                                : rawT("new").toUpperCase()}
                            </span>
                          )}
                          {tool.isAvailable === "coming" && (
                            <span
                              className={`text-[10px] font-bold uppercase px-2 rounded-full bg-blue-500`}
                            >
                              {rawT("soon").toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="line-clamp-2 text-sm text-muted-foreground text-left">
                          {typeof tool.description === "object"
                            ? tool.description[lang]
                            : tool.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <SheetFooter>
                  <div className="relative col-span-1 md:col-span-2 w-full min-h-[220px] rounded-xl bg-gradient-to-tl from-cyan-600/60 via-cyan-700/50 to-transparent p-4 flex flex-col justify-between backdrop-blur-md border border-cyan-600/30 shadow-lg shadow-cyan-700/20 text-white overflow-hidden">
                    <div className="w-full h-full">
                      <h3 className="text-xl font-extrabold bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent tracking-wide">
                        {t("follow_us")}
                      </h3>
                      <p className="text-sm text-cyan-100 mb-20 max-w-[360px]">
                        {t("follow_us_description")}
                      </p>

                      <div className="grid grid-cols-3">
                        {socials.map((social, idx) => (
                          <a
                            key={idx}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className={`w-14 h-14 flex items-center justify-center rounded-lg bg-cyan-900/30 backdrop-blur-sm border border-cyan-700/60 transition duration-300 shadow-sm hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50 ${social.ringColor} ring-offset-2 ring-offset-cyan-900 z-10`}
                            title={social.label}
                          >
                            {social.icon}
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Spaceship Image - absolute positioned */}
                    <div className="absolute bottom-0 right-0 -mb-10 -mr-10 pointer-events-none drop-shadow-lg">
                      <Image
                        src="/spaceship.png"
                        width={160}
                        height={160}
                        alt="fetchy"
                        className="max-h-36 w-auto opacity-75 transition-transform duration-500 hover:scale-110"
                        priority
                      />
                    </div>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Link
              href="/"
              className="hidden md:block group h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              {rawT("home")}{" "}
            </Link>
            <NavigationMenuItem className="hidden md:block">
              <NavigationMenuTrigger className="bg-transparent cursor-pointer">
                {rawT("tools")}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-[#151515] shadow-xl max-h-[90vh] overflow-auto show-scrollbar">
                <ul className="grid w-[400px] gap-2.5 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {tools.map((tool, index) => {
                    const isComing = tool.isAvailable === "coming";
                    const isDisabled = !tool.isAvailable || isComing;

                    return (
                      <NavigationMenuLink
                        key={index}
                        onClick={() => {
                          if (isDisabled) {
                            toast.info(
                              rawT("not_available_warning", { type: "tool" })
                            );
                            return;
                          }
                          router.push(tool.url.replace("/:lang", ""));
                        }}
                        className={`relative block space-y-1 rounded-lg p-4 bg-[#1a1a1a] text-white transition-all duration-200 border border-white/5 cursor-pointer ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#222] hover:shadow-md hover:border-white/10"
                        }`}
                      >
                        <div className="text-sm font-semibold flex items-center gap-2">
                          {tool.title}
                          {(tool.isHot || tool.isNew) && (
                            <span
                              className={`text-[10px] font-bold uppercase px-2  rounded-full ${
                                tool.isHot ? "bg-orange-500" : "bg-purple-600"
                              }`}
                            >
                              {tool.isHot
                                ? rawT("hot").toUpperCase()
                                : rawT("new").toUpperCase()}
                            </span>
                          )}
                          {tool.isAvailable === "coming" && (
                            <span
                              className={`text-[10px] font-bold uppercase px-2 rounded-full bg-blue-500`}
                            >
                              {rawT("soon").toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {typeof tool.description === "object"
                            ? tool.description[lang]
                            : tool.description}
                        </p>
                      </NavigationMenuLink>
                    );
                  })}
                  <div className="relative col-span-1 md:col-span-2 w-full min-h-[220px] rounded-xl bg-gradient-to-tl from-cyan-600/60 via-cyan-700/50 to-transparent px-6 py-6 flex flex-col justify-between backdrop-blur-md border border-cyan-600/30 shadow-lg shadow-cyan-700/40 text-white overflow-hidden">
                    <div className="w-full">
                      <h3 className="text-xl font-extrabold bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent tracking-wide">
                        {t("follow_us")}
                      </h3>
                      <p className="text-sm text-cyan-100 mb-16 max-w-[360px]">
                        {t("follow_us_description")}
                      </p>

                      <div className="grid grid-cols-3">
                        {socials.map((social, idx) => (
                          <a
                            key={idx}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className={`w-14 h-14 flex items-center justify-center rounded-lg bg-cyan-900/30 backdrop-blur-sm border border-cyan-700/60 transition duration-300 shadow-sm hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50 z-10 ${social.ringColor} ring-offset-2 ring-offset-cyan-900`}
                            title={social.label}
                          >
                            {social.icon}
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Spaceship Image */}
                    <div className="absolute bottom-0 right-0 -mb-10 -mr-10 pointer-events-none drop-shadow-lg">
                      <Image
                        src="/spaceship.png"
                        width={160}
                        height={160}
                        alt="fetchy"
                        className="max-h-36 w-auto opacity-75 transition-transform duration-500 hover:scale-110"
                        priority
                      />
                    </div>
                  </div>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <LocaleSwitcher />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

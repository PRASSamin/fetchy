"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "@/hooks/useRouter";
import { animated, useTransition } from "@react-spring/web";
import { toast } from "sonner";
import { GitHub } from "@mui/icons-material";

import { tools } from "@/lib/tools/source";
import { Button, buttonVariants } from "@/components/ui/button";
import { FETCHY_GITHUB } from "@/constants";
import { fluid } from "@/utils/fluid";
import { useTranslations } from "next-intl";

const Tag = ({ label, color }: { label: string; color: string }) => {
  const bgMap = {
    purple: "bg-purple-600/80",
    orange: "bg-orange-500/80",
    blue: "bg-blue-600/80",
    green: "bg-green-500/80",
    yellow: "bg-yellow-400/90 text-black",
  };

  return (
    <div
      className={`absolute top-1 right-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
        bgMap[color as keyof typeof bgMap] ?? "bg-white/20"
      }`}
    >
      {label}
    </div>
  );
};

const HeroSection = () => {
  const router = useRouter();
  const [isChoiceOpen, setIsChoiceOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const popupWrapperRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("_home");
  const rawT = useTranslations();
  const toolList = tools
    .getTools()
    .sortBy("isAvailable", "desc", "boolean")
    .sortBy("isNew", "desc")
    .sortBy("isHot", "desc");

  const transitions = useTransition(isChoiceOpen, {
    from: { opacity: 0, transform: "scale(0.9)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.9)" },
    config: { tension: 250, friction: 20 },
  });

  const [popupPosition, setPopupPosition] = useState({
    left: "0px",
    top: "100%",
  });

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsChoiceOpen(false);
      }
    };

    if (isChoiceOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChoiceOpen]);

  useEffect(() => {
    if (!isChoiceOpen || !popupWrapperRef.current || !popupRef.current) return;

    const wrapperRect = popupWrapperRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();

    const spaceRight = window.innerWidth - wrapperRect.left;
    const spaceBottom = window.innerHeight - wrapperRect.bottom;

    let left = "0px";
    let top = "100%";

    if (spaceRight < popupRect.width) {
      left = `-${popupRect.width - wrapperRect.width}px`;
    }

    if (spaceBottom < popupRect.height + 10) {
      top = `-${popupRect.height + 10}px`;
    }

    setPopupPosition({ left, top });
  }, [isChoiceOpen]);

  return (
    <section
      style={{
        background: `radial-gradient(
                    ellipse 60% 40% at center,
                    #2a1e39 0%,
                    transparent 80%
                  )`,
        height: `${window?.innerHeight - 57}px`,
      }}
      className="mx-auto grid gap-16 items-center relative"
    >
      {/* TEXT SIDE */}
      <div className="flex flex-col gap-20 relative max-w-[calc(100vw-2rem)] mx-auto">
        <div className="space-y-6 text-center lg:max-w-[80%] mx-auto">
          <h1
            style={{
              fontSize: fluid("2.25rem", "4.5rem") as string,
              lineHeight: fluid("2.5rem", "4.5rem") as string,
            }}
            className="font-bold font-manrope leading-tight"
          >
            <span className="bg-gradient-to-r from-[#7837d1] to-[#cba6ff] text-transparent bg-clip-text">
              Fetchy,
            </span>{" "}
            {t("title")}
          </h1>
          <p
            style={{
              fontSize: fluid("0.875rem", "1.125rem") as string,
              lineHeight: fluid("1.25rem", "1.75rem") as string,
            }}
            className="text-muted-foreground max-w-2xl mx-auto "
          >
            {t("description")}
          </p>
        </div>

        {/* CTA AREA */}
        <div className="flex justify-center gap-2 relative">
          <div className="relative" ref={popupWrapperRef}>
            <Button
              onClick={() => setIsChoiceOpen(!isChoiceOpen)}
              className="py-5
    bg-gradient-to-r from-[#6e56cf] via-[#9e7eea] to-[#c7a3ff]
    text-white font-semibold
    rounded-lg
    transition-all duration-300
    hover:scale-[1.03]
    active:scale-[0.98]"
            >
              Get Started
            </Button>
            {transitions(
              (style, item) =>
                item && (
                  <animated.div
                    ref={popupRef}
                    style={{
                      ...style,
                      position: "absolute",
                      left: popupPosition.left,
                      top: popupPosition.top,
                      marginTop:
                        popupPosition.top === "100%" ? "5px" : undefined,
                      marginBottom:
                        popupPosition.top !== "100%" ? "5px" : undefined,
                    }}
                    className="w-[320px] sm:w-[400px] rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 bg-white/5 overflow-hidden z-[2000]"
                  >
                    <div className="grid grid-cols-3 gap-3 p-4 max-h-[400px] overflow-y-auto">
                      {toolList.map((tool, index) => {
                        const isComing = tool.isAvailable === "coming";
                        const isDisabled = !tool.isAvailable || isComing;

                        return (
                          <div
                            key={index}
                            className={`relative group cursor-pointer transition-all duration-300 ${
                              isDisabled
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:scale-[1.05]"
                            }`}
                            onClick={() => {
                              if (isDisabled) {
                                toast.info(
                                  rawT("not_available_warning", {
                                    type: "tool",
                                  })
                                );
                                return;
                              }
                              router.push(tool.url?.replace("/:lang", ""));
                              setIsChoiceOpen(false);
                            }}
                          >
                            <div className="w-full aspect-square rounded-xl bg-[#121212]/50 border border-white/10 flex flex-col items-center justify-center p-3 gap-2 text-white text-sm hover:bg-white/10 transition-all">
                              <tool.icon className="text-white text-2xl" />
                              <span className="text-center text-xs font-medium">
                                {tool.title}
                              </span>
                            </div>

                            {tool.isNew && (
                              <Tag
                                label={rawT("new").toUpperCase()}
                                color="purple"
                              />
                            )}
                            {tool.isHot && (
                              <Tag
                                label={rawT("hot").toUpperCase()}
                                color="orange"
                              />
                            )}

                            {isDisabled && (
                              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center text-xs text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity select-none">
                                {isComing
                                  ? rawT("coming_soon")
                                  : rawT("not_available")}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </animated.div>
                )
            )}
          </div>

          <a
            rel="noopener noreferrer"
            href={FETCHY_GITHUB}
            target="_blank"
            className={`inline-flex items-center justify-center bg-transparent py-5 
    !transition-all duration-300
    hover:scale-[1.03]
    active:scale-[0.98] hover:bg-transparent ${buttonVariants({
      variant: "outline",
    })}`}
          >
            Star on GitHub
            <GitHub className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

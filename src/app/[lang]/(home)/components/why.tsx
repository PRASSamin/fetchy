import { Link } from "@/components/link";
import { tools as toolsList } from "@/lib/tools/source";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const WhyFetchy = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[calc(100vw-1rem)] container mx-auto p-0">
      <LightningCard className="order-2 md:order-1" />
      <CompatibilityCard className="order-1 md:order-2" />
    </div>
  );
};

export default WhyFetchy;

function CompatibilityCard({ className }: { className: string }) {
  const t = useTranslations("_home");
  const tools = toolsList
    .getTools()
    .filter((item) => item.isAvailable !== "coming");

  const extendedTools = tools.map((tool) => ({
    ...tool,
    className:
      tool.title === "Instagram"
        ? "shadow-[#e60058] group-hover:shadow-[#e60058]/50"
        : tool.title === "Facebook"
          ? "shadow-[#3B5998] group-hover:shadow-[#3B5998]/50"
          : tool.title === "Tiktok"
            ? "shadow-[#FFF] group-hover:shadow-[#FFF]/50"
            : tool.title === "Youtube"
              ? "shadow-[#FF0000] group-hover:shadow-[#FF0000]/50"
              : "shadow-[#EE513B] group-hover:shadow-[#EE513B]/50",
  }));

  return (
    <div
      className={cn(
        "rounded-xl bg-muted/50 border backdrop-blur-md flex flex-col overflow-hidden gap-2 justify-between order-1 md:order-2",
        className
      )}
    >
      <div className="p-5">
        <h3 className=" font-montserrat text-white text-3xl mb-1.5">
          {t("compatibility")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("compatibility_description")}
        </p>
      </div>
      <div className="flex items-start flex-wrap gap-3 w-[120%] bg-background/70 ml-8 h-56 rounded-tl-xl p-2">
        {extendedTools.map((tool) => (
          <div
            key={tool.title}
            className="relative group w-[105px] aspect-square transition-all duration-500 cursor-pointer"
          >
            <div className="flex justify-center items-center gap-2.5 w-[105px] aspect-square rounded-xl shadow-lg hover:shadow-xl z-10 transition-all duration-300 border">
              <tool.icon
                style={{
                  width: tool.icon_size,
                  height: tool.icon_size,
                }}
                className="text-foreground"
              />
            </div>

            <div
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent w-[80%] aspect-square rounded-xl shadow-[0_10px_10px_2px] group-hover:shadow-[0_10px_30px_2px] group-hover:w-full transition-all duration-2000 z-1 group-hover:duration-300 ease-in-out",
                tool.className
              )}
            />
          </div>
        ))}
        {Array.from({ length: 20 - extendedTools.length }).map((_, index) => (
          <div
            key={index}
            className="relative group w-[105px] aspect-square transition-all duration-500 cursor-pointer"
          >
            <div className="flex justify-center items-center gap-2.5 w-[105px] aspect-square rounded-xl shadow-lg hover:shadow-xl z-10 transition-all duration-300 bg-muted/20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LightningCard({ className }: { className?: string }) {
  const [showSequence, setShowSequence] = useState(false);
  const [reqTime, setReqTime] = useState("1.00s");
  const t = useTranslations("_home");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delay = Math.random() * 1500 + 1000;
    setTimeout(() => {
      setReqTime((Math.random() * 1.5 + 1).toFixed(2) + "s");
      setShowSequence(true);
    }, delay);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-xl bg-muted/50 border backdrop-blur-md flex flex-col overflow-hidden h-[360px]",
        className
      )}
    >
      {/* Glowing area */}
      <div className="h-full w-full flex items-center justify-center z-0 pointer-events-none relative">
        <style jsx>{`
          @keyframes ping-slow {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }

          @keyframes draw-line {
            0% {
              height: 0;
              opacity: 0;
            }
            100% {
              height: 50px;
              opacity: 1;
            }
          }

          @keyframes fade-tooltip {
            0% {
              opacity: 0;
              transform: translateY(10px) translateX(-50%);
            }
            100% {
              opacity: 1;
              transform: translateY(0) translateX(-50%);
            }
          }

          .animate-ping-slow {
            animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }

          .animate-line {
            animation: draw-line 0.4s ease-out forwards;
          }

          .animate-tooltip {
            animation: fade-tooltip 0.8s ease-out forwards;
          }
        `}</style>

        {/* Glowing blob */}
        <div className="relative w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-purple-500/30 via-purple-600/40 to-purple-800/50 blur-2xl opacity-30" />
        <div className="absolute w-16 h-16 bg-purple-500 rounded-full animate-ping-slow shadow-[0_0_30px_8px_rgba(168,85,247,0.2)]" />
        <div className="absolute w-8 h-8 bg-purple-400 rounded-full shadow-[0_0_20px_4px_rgba(192,132,252,0.4)]" />

        {/* dotted path & tooltip */}
        {showSequence && (
          <>
            <div
              className={`absolute left-1/2 -translate-x-1/2 bg-transparent opacity-0 animate-line z-10`}
              style={{
                top: "calc(50% + 20px)",
                width: "2px",
                height: "50px",
                backgroundImage:
                  "repeating-linear-gradient(to bottom, #a855f7, #a855f7 4px, transparent 4px, transparent 8px)",
              }}
            />
            <div
              className={`absolute left-1/2 -translate-x-1/2 px-3 py-1 text-sm font-mono bg-background/50 border-2 border-dashed rounded border-purple-500/20 text-purple-300 shadow-lg opacity-0 animate-tooltip z-20`}
              style={{
                top: "calc(50% + 70px)",
                transform: "translateX(-50%) translateY(0)",
              }}
            >
              {reqTime}
            </div>
          </>
        )}
      </div>

      {/* Text */}
      <div className="p-5">
        <h3 className=" font-montserrat text-white text-3xl mb-1.5">
          {t("lightning_fast")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("lightning_fast_description")}
        </p>
      </div>
    </div>
  );
}

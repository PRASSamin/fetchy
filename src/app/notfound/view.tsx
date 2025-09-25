"use client";
import Stars from "./components/stars";
import Moon from "./components/moon";
import { Link } from "@/components/link";
import { Home } from "lucide-react";
import ShootingStars from "./components/shooting-stars";
import { useTranslations } from "next-intl";

const NotFoundView = () => {
  const t = useTranslations("_404");
  return (
    <>
      <div
        className="absolute top-0 left-0 w-full h-screen overflow-hidden 
  bg-gradient-to-b from-[#03020b] via-[#120a2c] to-[#1b0f3d] 
  after:w-full after:h-full after:absolute after:top-0 
  after:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_30%,rgba(10,8,30,0.25)_100%)]"
      >
        <Stars />
        <ShootingStars />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center">
        <div className="mb-12 flex items-center justify-center gap-5">
          <div
            style={{
              textShadow: "20px 20px 20px rgba(0, 0, 0, 0.2)",
            }}
            className="font-russo text-[120px] sm:text-[200px]"
          >
            4
          </div>
          <Moon />
          <div
            style={{
              textShadow: "20px 20px 20px rgba(0, 0, 0, 0.2)",
            }}
            className="font-russo text-[120px] sm:text-[200px]"
          >
            4
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6 w-full max-w-xs">
          <Link
            href="/"
            className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5
                     bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800
                     rounded-full text-sm sm:text-[15px] font-medium tracking-wide
                     shadow-lg hover:shadow-purple-700/40 hover:shadow-2xl 
                     transition-all duration-300 transform hover:-translate-y-0.5 
                     border border-purple-500/20 min-w-[180px]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-2.5 text-white">
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t("back_to_home")}
            </span>
            <span
              className="absolute inset-0 bg-gradient-to-r from-purple-700/50 to-indigo-600/50 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                     rounded-full blur-sm"
            ></span>
          </Link>

          <p className="text-purple-300/85 text-[15px] leading-relaxed max-w-[280px] font-sans">
            {t("description")}
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFoundView;

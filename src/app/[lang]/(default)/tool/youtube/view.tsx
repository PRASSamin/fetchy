"use client";
import { GitHub } from "@mui/icons-material";
import { FETCHY_GITHUB } from "@/constants";
import { fluid } from "@/utils/fluid";
import { useTranslations } from "next-intl";

const YoutubeDownloaderView = () => {
  const t = useTranslations("_tools._youtube");
  return (
    <>
      {/* HERO SECTION */}
      <section className="-mt-16 h-[calc(100vh-50px)] relative bg-gradient-to-b from-neutral-900 to-black flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ff0000]/20 rounded-full blur-[120px] opacity-40" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              style={{
                fontSize: fluid("2.25rem", "3rem") as string,
                lineHeight: fluid("2.5rem", "3rem") as string,
              }}
              className="mb-4 font-semibold font-manrope text-transparent bg-clip-text bg-gradient-to-b from-neutral-200 to-neutral-400"
            >
              {t("title")}
            </h1>
            <p
              style={{
                fontSize: fluid("0.875rem", "1rem") as string,
                lineHeight: fluid("1.25rem", "1.5rem") as string,
              }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-400 mb-8"
            >
              {t("description")}
            </p>
            <a
              href={FETCHY_GITHUB}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center px-4 py-2.5 bg-neutral-800/50 backdrop-blur-sm text-white rounded-lg border border-neutral-700/50 hover:scale-[1.02] transition-all duration-300 mt-10 text-sm gap-2"
            >
              <GitHub className="w-4 h-4" />
              Star us on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default YoutubeDownloaderView;

import { fluid } from "@/utils/fluid";
import { useTranslations } from "next-intl";

const DownloaderHero = ({
  platform,
}: {
  platform: "instagram" | "facebook" | "tiktok";
}) => {
  const t = useTranslations("_tools");
  return (
    <section
      id="hero"
      className="pb-28 relative bg-gradient-to-b from-[#7837d1]/30 -mt-16 pt-44 to-black"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            style={{
              fontSize: fluid("2.25rem", "3rem") as string,
              lineHeight: fluid("2.5rem", "3rem") as string,
            }}
            className="mb-4 font-semibold font-manrope text-transparent bg-clip-text bg-gradient-to-b from-neutral-200 to-neutral-400"
            dangerouslySetInnerHTML={{
              __html: t("title", {
                platform: `<span class="capitalize">${platform}</span>`,
              }),
            }}
          />
          <p
            style={{
              fontSize: fluid("0.875rem", "1rem") as string,
              lineHeight: fluid("1.25rem", "1.5rem") as string,
            }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-400 mb-8"
          >
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DownloaderHero;

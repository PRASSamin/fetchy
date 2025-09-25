import { GitBranchIcon } from "@/components/icons/gitbranch";
import { cn } from "@/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BSL_1_1, PRAS_GITHUB } from "@/constants";

const OpenSource = ({ className }: { className?: string }) => {
  const t = useTranslations();
  const LINKS = {
    license: {
      url: BSL_1_1,
      text: "Business Source License 1.1",
    },
    github: {
      url: PRAS_GITHUB,
      label: "Visit PRAS's GitHub profile",
    },
  };

  return (
    <section
      className={cn(
        "pb-20 md:pb-32 pt-0 md:pt-10 container max-w-[calc(100vw-1rem)] px-4 mx-auto text-center flex flex-col",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2 bg-emerald-700/50 self-center justify-self-center px-4 py-1 text-sm rounded-full border border-emerald-300/50 text-emerald-300 select-none mb-5 w-fit">
        <GitBranchIcon />
        Open Source
      </div>

      <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat tracking-tight bg-gradient-to-l from-emerald-500 to-white text-transparent bg-clip-text">
        {t("open_source_title")}
      </h2>

      <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base mb-10 leading-relaxed">
        {t("open_source_description.part1")}{" "}
        <a
          href={LINKS.license.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:text-foreground transition"
        >
          {LINKS.license.text}{" "}
        </a>
        {t("open_source_description.part2")}
      </p>

      <span className="text-sm text-muted-foreground tracking-wide uppercase block pt-10">
        {t("released_by")}
      </span>
      <a
        href={LINKS.github.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={LINKS.github.label}
        className="inline-flex items-center justify-center mt-4 transition hover:scale-105"
      >
        <Image
          src="/pras.svg"
          alt="PRAS"
          width={200}
          height={200}
          className="w-32 md:w-40 h-auto"
          priority={false}
          sizes="(max-width: 768px) 128px, 160px"
        />
      </a>
    </section>
  );
};

export default OpenSource;

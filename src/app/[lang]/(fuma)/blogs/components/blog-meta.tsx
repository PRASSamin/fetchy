import Image from "next/image";

const BlogMeta: React.FC<Record<string, any>> = ({ ...props }) => {
  if (!props?.mdxData) return null;
  const { mdxData, ...rest } = props;
  const posted_by = mdxData.data.posted_by;
  return (
    <div className="sticky pb-2 pt-12 max-xl:hidden top-[calc(var(--fd-banner-height)+var(--fd-nav-height))] h-[calc(100dvh-var(--fd-banner-height)-var(--fd-nav-height))]">
      <div className="flex h-full w-(--fd-toc-width) max-w-full flex-col pe-4">
        <h3 className="text-sm font-medium text-fd-muted-foreground/90 mb-2 tracking-wide">
          POSTED BY
        </h3>
        <div className="flex flex-col">
          {posted_by?.map((item: any) => (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              key={item.username}
              className="group flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-fd-accent/5 hover:shadow-sm"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/1 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={item.avatar}
                  alt={item.name}
                  width={44}
                  height={44}
                  className="rounded-full w-11 h-11 object-cover border-2 border-fd-border/50 group-hover:border-fd-accent/50 transition-all duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-fd-foreground transition-colors">
                  {item.name}
                </span>
                <span className="text-xs text-fd-muted-foreground/80 group-hover:text-fd-muted-foreground transition-colors">
                  @{item.username}
                </span>
              </div>
              <svg
                className="ml-auto w-4 h-4 text-fd-muted-foreground/40 group-hover:text-fd-accent transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogMeta;

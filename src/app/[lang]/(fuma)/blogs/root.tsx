import { source } from "@/lib/source";
import BGPattern from "./components/bg-pattern";
import { cn, formatedTime } from "@/utils";
import Image from "next/image";
import { Link } from "@/components/link";
import { useTranslations } from "next-intl";

const truncate = (text: string, limit: number) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit).trim() + "..." : text;
};

const BlogRootPage = () => {
  const t = useTranslations("_blogs");
  const blogs = source
    .getPages()
    .filter((blog) => blog.url !== "/blogs")
    .sort((a, b) => {
      const dateA = new Date(a.data.updatedAt ?? 0).getTime();
      const dateB = new Date(b.data.updatedAt ?? 0).getTime();
      return dateB - dateA;
    });
  return (
    <div className="flex flex-col gap-10 min-h-[calc(100vh-64px-50px)]">
      <BGPattern />
      <div className="flex-1 flex flex-col w-full rounded-xl mb-5 relative md:container mx-auto">
        <div className="pt-28 pb-3 border-b border-dashed px-4">
          {blogs.length > 0 && (
            <span className="text-fd-muted-foreground">
              {blogs.length} {blogs.length === 1 ? "Blog" : "Blogs"}
            </span>
          )}
          <h1 className="text-4xl font-semibold font-rethink text-transparent bg-clip-text bg-gradient-to-t from-neutral-200 to-neutral-400 tracking-wide">
            {t("title")}
          </h1>
        </div>
        {blogs.length > 0 ? (
          <div className="flex flex-col" dir="auto">
            {blogs.map(({ data: blog, url }, index) => {
              return (
                <Link
                  key={blog.title}
                  href={url}
                  className={cn(
                    "py-5 hover:bg-fd-accent/50 px-4 transition-all duration-200 cursor-pointer",
                    index === blogs.length - 1 ? "" : "border-b border-dashed"
                  )}
                >
                  <span className="text-fd-muted-foreground/80 text-xs font-mono">
                    {formatedTime(blog.updatedAt!)}
                  </span>
                  <h2 className="font-semibold text-neutral-200 text-xl">
                    {blog.title}
                  </h2>
                  {blog.description && (
                    <>
                      <p
                        className="text-fd-muted-foreground md:hidden"
                        style={{
                          fontSize: "0.875rem",
                        }}
                      >
                        {truncate(blog.description || "", 100)}
                      </p>
                      <p
                        className="text-fd-muted-foreground hidden md:block"
                        style={{
                          fontSize: "0.875rem",
                        }}
                      >
                        {truncate(blog.description || "", 160)}
                      </p>
                    </>
                  )}
                  {blog?.posted_by && blog.posted_by.length > 0 && (
                    <div className="flex flex-wrap gap-10 mt-2">
                      {blog.posted_by.slice(0, 2).map((item: any) => (
                        <div
                          key={item.username}
                          className="flex items-center gap-3 py-2 rounded-lg"
                        >
                          <Image
                            src={item.avatar}
                            alt={item.name}
                            width={44}
                            height={44}
                            className="rounded-full w-11 h-11 object-cover border-2 border-fd-border/50 group-hover:border-fd-accent/50 transition-all duration-300"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-fd-foreground">
                              {item.name}
                            </span>
                            <span className="text-xs text-fd-muted-foreground/80">
                              @{item.username}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-fd-muted-foreground">
              {t("no_blogs")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogRootPage;

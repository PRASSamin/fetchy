import { source } from "@/lib/source";
import { DocsBody, DocsPage } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents, mdxComponents } from "@/mdx-components";
import Image from "next/image";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { Banner } from "fumadocs-ui/components/banner";
import BlogRootPage from "../root";
import BGPattern from "../components/bg-pattern";
import { metatag } from "@/lib/metatag";
import { headers } from "next/headers";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await props.params;
  const page = source.getPage(slug);

  if (!slug || slug?.length === 0) {
    return <BlogRootPage />;
  }

  if (!page) notFound();

  const MDX = page.data.body;
  const blog = page.data;

  return (
    <div
      className="flex flex-col gap-10 min-h-[calc(100vh-64px-50px)]"
      dir="ltr"
    >
      <DocsPage
        container={{
          className: "!pt-0",
        }}
        toc={page.data.toc}
        footer={{ enabled: false }}
      >
        <BGPattern />
        <div className="w-full rounded-xl mb-5 relative">
          <h1 className="text-4xl font-bold text-fd-foreground">
            {blog.title}
          </h1>
          <p className="text-fd-muted-foreground mt-2">{blog.description}</p>

          {blog.posted_by && (
            <div className="flex items-center gap-10 mt-5 flex-wrap">
              {blog.posted_by.map((item: any) => (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={item.username}
                  className="group flex items-center gap-3 py-2 rounded-lg transition-all duration-200"
                >
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={44}
                    height={44}
                    className="rounded-full w-11 h-11 object-cover border-2 border-fd-border/50 group-hover:border-fd-accent/50 transition-all duration-300"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-fd-foreground transition-colors group-hover:underline decoration-2">
                      {item.name}
                    </span>
                    <span className="text-xs text-fd-muted-foreground/80 group-hover:text-fd-muted-foreground transition-colors">
                      @{item.username}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-5 flex-wrap">
              {blog.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-fd-accent text-fd-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <DocsBody className="mb-5">
          <MDX
            // @ts-expect-error: Lucide is not assignable to MDXComponents
            components={getMDXComponents({
              ...mdxComponents,
              Banner,
              TypeTable,
            })}
          />
        </DocsBody>
      </DocsPage>
    </div>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const headersList = await headers();
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const url = new URL(headersList.get("x-current-url") || "").toString();

  return metatag({
    title: `${page.data.title} | Fetchy`,
    url,
    robots: "index, follow",
    description: page.data.description,
    keywords: page?.data?.tags || [],
  });
}

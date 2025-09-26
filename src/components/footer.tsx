import { Link } from "./link";
import {
  Instagram,
  Facebook,
  Twitter,
  GitHub,
  LinkedIn,
} from "@mui/icons-material";
import { GmailIcon as Gmail } from "./icons/gmail";
import { PRAS_GITHUB } from "@/constants";
import { cn } from "@/utils";
import { tools } from "@/lib/tools/source";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Footer = ({ className }: { className?: string }) => {
  const t = useTranslations("Footer");
  const rawT = useTranslations();
  const toolLinks = tools
    .getTools()
    .sortBy("isHot", "desc")
    .sortBy("isNew", "desc")
    .slice(0, 5);

  const SOCIAL_LINKS = [
    {
      Icon: <GitHub fontSize="small" />,
      href: PRAS_GITHUB,
      className: "hover:text-white",
    },
    {
      Icon: <LinkedIn fontSize="small" />,
      href: "https://www.linkedin.com/in/pras-samin-826421270/",
      className: "hover:text-blue-500",
    },
    {
      Icon: <Instagram fontSize="small" />,
      href: "https://www.instagram.com/imprassamin/",
      className: "hover:text-pink-500",
    },
    {
      Icon: <Facebook fontSize="small" />,
      href: "https://www.facebook.com/prassamin7/",
      className: "hover:text-blue-600",
    },
    {
      Icon: <Twitter fontSize="small" />,
      href: "https://x.com/prassamin78/",
      className: "hover:text-white",
    },
    {
      Icon: <Gmail size={20} />,
      href: "mailto:prassamin@gmail.com",
      className: "hover:grayscale-0 grayscale",
    },
  ];

  return (
    <footer
      className={cn(
        `relative overflow-hidden bg-black border-t border-neutral-800/50`,
        className
      )}
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -bottom-1/2 right-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(120,55,209,0.15)_0%,transparent_50%)]"></div>
      </div>

      {/* Content */}
      <div
        className={`relative z-10 max-w-[calc(100vw-4rem)] px-0 container mx-auto py-16`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          {/* Branding Section */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Fetchy Logo"
                width={100}
                height={28}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-neutral-400 text-sm max-w-xs">
              {t("description")}
            </p>
          </div>

          {/* Tools Section */}
          <div className="col-span-1">
            <h3 className="font-semibold text-neutral-200 mb-4 tracking-wide">
              {rawT("tools")}
            </h3>
            <ul className="space-y-3">
              {toolLinks.map((tool) => (
                <li key={tool.title}>
                  <Link
                    href={tool.url.replace("/:lang", "")}
                    className="text-neutral-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Section */}
          <div className="col-span-1">
            <h3 className="font-semibold text-neutral-200 mb-4 tracking-wide">
              {rawT("resources")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blogs"
                  className="text-neutral-400 hover:text-purple-300 transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-10 border-neutral-800" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p
            className="text-neutral-500 text-sm text-center md:text-left"
            dangerouslySetInnerHTML={{
              __html: t("copyright", {
                year: new Date().getFullYear(),
                name: `<a
                    href="https://pras.me/"
                    target="_blank"
                    class="font-semibold hover:underline text-purple-400"
                  >
                    PRAS
                  </a>`,
              }),
            }}
          ></p>
          <div className="social flex items-center justify-center gap-5 text-neutral-500">
            {SOCIAL_LINKS.map((link) => (
              <Link
                href={link.href}
                target="_blank"
                className={cn(
                  link.className,
                  "transition-all duration-300 flex"
                )}
                key={link.href}
              >
                {link.Icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

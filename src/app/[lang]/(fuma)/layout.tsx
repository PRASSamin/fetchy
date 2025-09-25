import Footer from "@/components/footer";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";
import Navigation from "@/components/navigation-bar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootProvider>
      <DocsLayout
        tree={source.pageTree}
        nav={{
          component: <Navigation className="border-border" />,
        }}
        sidebar={{
          enabled: false,
        }}
      >
        {children}
        <Footer className="border-t" />
      </DocsLayout>
    </RootProvider>
  );
}

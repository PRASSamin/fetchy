import { Accordion, Accordions } from "fumadocs-ui/components/accordion";

import { FETCHY_GITHUB } from "@/constants";
import { fluid } from "@/utils/fluid";
import { useMessages, useTranslations } from "next-intl";

const FAQ = () => {
  const t = useTranslations("_home");
  const messages = useMessages();

  return (
    <section id="faq" className="bg-background">
      <div className="max-w-[calc(100vw-1rem)] px-0 container mx-auto pb-8">
        <div className="flex flex-col">
          <div className="mb-10 text-center">
            <h2 className="bg-gradient-to-r from-foreground to-purple-600 text-transparent bg-clip-text inline-block text-3xl md:text-4xl font-bold mb-1 font-montserrat">
              {t("faq_title")}
            </h2>
            <p
              style={{
                fontSize: fluid("0.875rem", "1rem") as string,
                lineHeight: fluid("1.25rem", "1.5rem") as string,
              }}
              className="text-muted-foreground"
            >
              {t("faq_description")}
            </p>
          </div>

          <Accordions type="single" collapsible className="bg-white/1">
            {messages?._home?.faqs?.map(
              (faq: { question: string; answer: string }, index: number) => (
                <Accordion
                  key={index.toString()}
                  title={faq?.question}
                  value={index.toString()}
                  style={{
                    fontSize: fluid("0.875rem", "1rem") as string,
                    lineHeight: fluid("1.25rem", "1.5rem") as string,
                  }}
                  className="py-2"
                >
                  <p
                    className="text-white/75"
                    dangerouslySetInnerHTML={{
                      __html: faq?.answer.replace("{GITHUB}", FETCHY_GITHUB),
                    }}
                  />
                </Accordion>
              )
            )}
          </Accordions>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

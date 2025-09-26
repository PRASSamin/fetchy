import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/utils";
import { fluid } from "@/utils/fluid";
import { FETCHY_GITHUB } from "@/constants";
import { useTranslations } from "next-intl";

const DownloaderFAQ: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    faqs: {
      question: string;
      answer: string;
    }[];
  }
> = ({ faqs, className, ...props }) => {
  const t = useTranslations();
  return (
    <div {...props} className={cn("flex flex-col mt-14", className)}>
      <h3 className="text-3xl mb-6 text-white font-montserrat">{t("faq")}</h3>
      <div className="space-y-4 text-neutral-300">
        <Accordion
          type="multiple"
          defaultValue={faqs.map((_, i) => i.toString())}
          className="w-full"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={index.toString()}
              className="focus-within:ring-0"
            >
              <AccordionTrigger
                chevron={false}
                onClick={(e) => {
                  e.preventDefault();
                  return;
                }}
                style={{
                  fontSize: fluid("0.875rem", "1rem") as string,
                  lineHeight: fluid("1.25rem", "1.5rem") as string,
                }}
                className="text-left outline-none"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent
                style={{
                  fontSize: fluid("0.875rem", "1rem") as string,
                  lineHeight: fluid("1.25rem", "1.5rem") as string,
                }}
              >
                <p
                  dangerouslySetInnerHTML={{
                    __html: faq.answer.replace("{GITHUB}", FETCHY_GITHUB),
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default DownloaderFAQ;

"use client";
import { useState } from "react";

import OpenSource from "@/components/open-source";
import {
  InstagramResponse,
  InstagramStoryResponse,
} from "@/types/api/downloader";
import GlobalResultView from "../components/GlobalResultView";
import { animated, useTransition } from "@react-spring/web";
import DownloaderHero from "../components/hero";
import DownloadTool from "../components/DownloadTool";
import HowToUseFetchy from "../components/howtouse";
import { BSL_1_1 } from "@/constants";
import DownloaderFAQ from "../components/faq";
import { useMessages, useTranslations } from "next-intl";
import FBIGStoryResultView from "../components/FBIGStoryResultView";

const InstagramDownloaderView = () => {
  const [data, setData] = useState<InstagramResponse | null>(null);
  const [processingTime, setProcessingTime] = useState("");
  const messages = useMessages();
  const faqs = messages?._tools?._instagram?.faqs;
  const t = useTranslations("_tools._instagram");

  const transition = useTransition(data, {
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(20px)" },
    config: { tension: 210, friction: 20 },
  });

  return (
    <>
      <DownloaderHero platform="instagram" />

      <DownloadTool
        whitelisted={["instagram.com"]}
        platform="instagram"
        onDataReady={setData}
        onProcessingCalculated={setProcessingTime}
      />

      {transition((style, item) =>
        item ? (
          <animated.div style={style}>
            {item.type === "story" ? (
              <FBIGStoryResultView
                data={item as unknown as InstagramStoryResponse}
                processingTime={processingTime}
              />
            ) : (
              <GlobalResultView
                data={item as InstagramResponse}
                processingTime={processingTime}
              />
            )}
          </animated.div>
        ) : null
      )}

      <div className="w-full bg-gradient-to-b from-black to-neutral-900">
        <OpenSource className="!w-full !max-w-full !py-16" />
      </div>

      <section id="seo-content" className="pt-16 pb-6 bg-neutral-900">
        <div className="max-w-[calc(100%-1rem)] md:container mx-auto md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col">
              <h2 className="text-3xl text-white mb-6 font-montserrat">
                {t("about.title")}
              </h2>

              <div className="max-w-none">
                {Object.entries(
                  messages?._tools?._instagram?.about?.parts || {}
                ).map(([key, _]) => (
                  <p
                    key={key}
                    className="text-neutral-300 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: t.markup(`about.parts.${key}`, {
                        b: (chunks) => `<b>${chunks}</b>`,
                        BSL: (chunks) =>
                          `<a href="${BSL_1_1}" target="_blank" rel="noopener noreferrer" class="underline font-bold">${chunks}</a>`,
                      }),
                    }}
                  ></p>
                ))}
              </div>
            </div>
            <HowToUseFetchy />
            <DownloaderFAQ faqs={faqs || []} />
          </div>
        </div>
      </section>
    </>
  );
};

export default InstagramDownloaderView;

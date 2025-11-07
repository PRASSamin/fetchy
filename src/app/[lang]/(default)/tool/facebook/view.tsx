"use client";
import { useState } from "react";

import OpenSource from "@/components/open-source";
import {
  FacebookStoryResponse,
  FacebookVideoResponse,
} from "@/types/api/downloader";
import GlobalResultView from "../components/GlobalResultView";
import { animated, useTransition } from "@react-spring/web";
import DownloaderHero from "../components/hero";
import DownloadTool from "../components/DownloadTool";
import FBStoryResultView from "../components/FBIGStoryResultView";
import FBLiveResultView from "../components/FBLiveResultView";
import HowToUseFetchy from "../components/howtouse";
import DownloaderFAQ from "../components/faq";
import { BSL_1_1 } from "@/constants";
import { useMessages, useTranslations } from "next-intl";

const FacebookDownloaderView = () => {
  const [data, setData] = useState<
    FacebookVideoResponse | FacebookStoryResponse | null
  >(null);
  const [processingTime, setProcessingTime] = useState("");
  const t = useTranslations("_tools._tiktok");
  const messages = useMessages();

  const faqs = messages?._tools?._facebook?.faqs;

  const transition = useTransition(data, {
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(20px)" },
    config: { tension: 210, friction: 20 },
  });

  return (
    <>
      <DownloaderHero platform="facebook" />

      <DownloadTool
        whitelisted={[
          "facebook.com",
          "l.facebook.com",
          "fb.watch",
          "www.facebook.com",
          "m.facebook.com",
          "web.facebook.com",
        ]}
        platform="facebook"
        onDataReady={setData}
        onProcessingCalculated={setProcessingTime}
      />

      {transition((style, item) =>
        item ? (
          <animated.div style={style}>
            {item.type === "story" ? (
              <FBStoryResultView
                data={item as FacebookStoryResponse}
                processingTime={processingTime}
              />
            ) : item.type === "live" ? (
              <FBLiveResultView
                data={item as FacebookVideoResponse}
                processingTime={processingTime}
              />
            ) : (
              <GlobalResultView
                data={item as FacebookVideoResponse}
                processingTime={processingTime}
              />
            )}
          </animated.div>
        ) : null
      )}

      <div className="w-full bg-gradient-to-b from-black to-neutral-900">
        <OpenSource className="bg-gradient-to-b from-black to-neutral-900 !w-full !max-w-full !py-16" />
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
                  messages?._tools?._facebook?.about?.parts || {}
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

export default FacebookDownloaderView;

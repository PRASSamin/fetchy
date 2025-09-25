"use client";
import React from "react";
import Navigation from "@/components/navigation-bar";
import Footer from "@/components/footer";
import HeroSection from "./components/hero";
import FAQ from "./components/faq";

import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import WhyFetchy from "./components/why";
import Testimonials from "./components/testimonials";
import OpenSource from "@/components/open-source";

export default function Home() {
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Toaster />
      <style>
        {`
          body {
          overflow: auto !important;
          }
        `}
      </style>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-full pt-3 pb-8 bg-background">
          <Image
            width={100}
            height={100}
            src="/logo.png"
            className="w-20 animate-preloader"
            alt="preloader"
          />
        </div>
      ) : (
        <>
          <Navigation />
          <HeroSection />
          <WhyFetchy />
          <Testimonials />
          <OpenSource />
          <FAQ />
          <Footer />
        </>
      )}
    </>
  );
}

import TrustpilotReview from "@/components/trustpilot-review-button";
import { fluid } from "@/utils/fluid";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useTranslations } from "use-intl";

const Testimonials = () => {
  const t = useTranslations("_home");
  const testimonials = [
    {
      quote:
        "It works well and download speed is also good. Tried with my phone and laptop.",
      from: "Facebook user",
    },
    {
      quote: "It's great! I needed that 🤧",
      from: "Facebook user",
    },
    {
      quote:
        "You can launch it commercially... Since people are benefiting, why keep it free???",
      from: "Facebook user",
    },
    {
      quote:
        "Nice work. Thanks for sharing this. It will inspire a lot of people out there including myself.",
      from: "Facebook user",
    },
    {
      quote: "A project that helps us as well🫱🏻‍🫲🏼 Well done bro..",
      from: "Facebook user",
    },
  ];

  return (
    <section
      id="testimonials"
      style={{
        paddingBlock: fluid("5rem", "6rem") as string,
      }}
      className="max-w-[calc(100vw-1rem)] p-0 container mx-auto"
    >
      <div className="mb-10 text-center">
        <h2 className="bg-gradient-to-r from-foreground to-rose-800 text-transparent bg-clip-text inline-block text-3xl md:text-4xl font-bold mb-1 font-montserrat transition-all duration-300">
          {t("testimonials_title")}
        </h2>
        <p
          className="text-muted-foreground"
          style={{
            fontSize: fluid("0.875rem", "1rem") as string,
            lineHeight: fluid("1.25rem", "1.5rem") as string,
          }}
        >
          {t("testimonials_description")}
        </p>
      </div>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 900: 3 }}>
        <Masonry itemStyle={{ gap: "0.8rem" }} style={{ gap: "0.8rem" }}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white/5 p-6 rounded-xl border border-white/10 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-md w-full transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <QuoteIcon className="absolute -left-2 text-white/50 transform -rotate-180" />
                  <blockquote className="text-sm mt-4 text-muted-foreground italic">
                    {testimonial.quote}
                  </blockquote>
                  <QuoteIcon className="ml-auto mt-2 text-white/50" />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                — {testimonial.from}
              </p>
            </div>
          ))}
          <div className="w-full flex items-center justify-center">
            <TrustpilotReview />
          </div>
        </Masonry>
      </ResponsiveMasonry>
    </section>
  );
};

export default Testimonials;

const QuoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg
      width="12"
      height="10"
      viewBox="-1 -1 12 10"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4.7619 0H2.17262L0 8H3.60119L4.7619 0ZM10 0H7.41071L5.2381 8H8.83929L10 0Z"></path>
    </svg>
  );
};

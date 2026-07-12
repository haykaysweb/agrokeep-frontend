import { Link } from "react-router";

export default function ContactUsFaq() {
  return (
    <>
      {/* faqBanner  */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-12">
        <div className="bg-brand-primary rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Content */}
          <div className="flex items-center gap-4 text-text-light">
            <div className="">
              <img src="/Question Circle.svg" alt="" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">
                Have Questions?
              </h3>
              <p className="text-text-light/80">
                Check our FAQs — most answers are just a click away.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Link to="/faqs" className="relative inline-block">
            {/* Orange Offset */}
            <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary"></span>

            {/* Button */}
            <span className="relative z-10 flex h-10 items-center rounded-full bg-white px-8 py-3 text-brand-primary font-medium text-sm md:text-base">
              View FAQs
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}

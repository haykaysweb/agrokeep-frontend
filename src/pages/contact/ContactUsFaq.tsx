export default function ContactUsFaq() {
  const redirect = () => {
    window.location.href = "/#contact";
  };

  return (
    <>
      {/* faqBanner  */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-12">
        <div className="bg-brand-primary rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Content */}
          <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4 text-text-light">
            <div className="shrink-0">
              <img src="/cycle.svg" alt="" className="w-12 h-12 md:w-auto md:h-auto" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">
                Have Questions?
              </h3>
              <p className="text-text-light/80 text-sm md:text-base">
                Check our FAQs — most answers are just a click away.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button className="relative inline-block cursor-pointer shrink-0" onClick={redirect}>
            {/* Orange Offset */}
            <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary"></span>

            {/* Button */}
            <span className="relative z-10 flex h-10 items-center justify-center rounded-full bg-white px-8 py-3 text-brand-primary font-medium text-sm md:text-base">
              View FAQs
            </span>
          </button>
        </div>
      </section>
    </>
  );
}
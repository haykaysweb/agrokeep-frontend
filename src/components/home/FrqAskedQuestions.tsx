import { motion } from "framer-motion";

const faqs = [
  {
    q: "How do I book a storage space?",
    a: "Simply search for a storage hub, select your preferred facility, enter your storage details, and complete your booking online.",
  },
  {
    q: "How is storage pricing determined?",
    a: "Pricing varies based on storage type, crop volume, location, and duration of storage.",
  },
  {
    q: "Are all storage facilities verified?",
    a: "Yes. Every storage hub on AgroKeep undergoes a verification process before being listed on the platform.",
  },
  {
    q: "Can I book storage without internet access?",
    a: "Yes. You can check availability and reserve storage space using our dedicated USSD code.",
  },
  {
    q: "How do I become a Hub Partner?",
    a: "Click “Become a Hub Partner,” complete the application form, and our team will review your submission within 48 hours.",
  },
  {
    q: "What happens after I make a booking?",
    a: "You'll receive a booking confirmation, payment receipt, and directions to your selected storage facility.",
  },
];

export default function FrqAskedQuestions() {
  return (
    <section id="contact" className="w-full ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 py-20 px-4 md:px-12">
        {/* Left Side: Content */}
        <div className="w-full lg:w-2/5 flex flex-col space-y-6">
          <span className="flex items-center gap-2 text-brand-primary font-bold text-sm tracking-wider">
            <img src="/flowerIcon2.svg" alt="" className="w-4 h-4" />
            Frequently Asked Questions
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-main leading-tight">
            Got <span className="text-brand-primary">questions?</span>
            <br />
            We’ve got <span className="text-brand-primary">answers</span>
          </h2>
          <p className="text-text-subtle text-lg">
            Have any questions? We have made easy. Here is what you need to know
            if you would like to use any of our storage hub.
          </p>
          <p className="text-text-main font-medium">
            Still curious?{" "}
            <a
              href="#support"
              className="text-brand-primary underline underline-offset-4"
            >
              Contact our support team
            </a>{" "}
            anytime.
          </p>

          <div className="relative inline-block w-fit">
            <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary"></span>
            <button className="relative z-10 bg-brand-primary text-text-light px-8 py-3 rounded-full font-medium">
              Contact Support
            </button>
          </div>
        </div>

        {/* Right Side - Accordion */}
        <div className="w-full lg:w-3/5 flex flex-col gap-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="collapse collapse-plus bg-surface-card border border-border-light rounded-2xl"
            >
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-base font-semibold text-text-main">
                {faq.q}
              </div>
              <div className="collapse-content text-text-subtle">
                <p>{faq.a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

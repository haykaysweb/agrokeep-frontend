import { motion } from "framer-motion";

const stories = [
  {
    quote:
      "Before AgroKeep, I lost a significant portion of my harvest while searching for buyers. Now I can reserve storage space ahead of harvest and keep my produce in good condition until it's sold.",
    name: "Adewale A.",
    role: "Cassava Farmer, Oyo State",
    avatar: "https://res.cloudinary.com/dw5bai7mk/image/upload/v1782946271/Frame_103_wf9ekv.svg",
  },
  {
    quote:
      "The booking process was straightforward, and the storage facility was exactly as described. It helped me avoid losses during a period of low market demand.",
    name: "Kemi O.",
    role: "Tomato Farmer, Ogun State",
    avatar: "https://res.cloudinary.com/dw5bai7mk/image/upload/v1782946271/Frame_103_wf9ekv.svg",
  },
];

export default function Stories() {
  return (
    <section className="w-full py-20  overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-12 mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-text-main">
          Real Stories That{" "}
          <span className="text-brand-primary">Build Trust</span>
        </h2>
      </div>

      {/* Infinite Carousel Container */}
      <div className="relative flex items-center justify-center overflow-hidden py-5">
        <motion.div
          className="flex gap-6 cursor-grab"
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...stories, ...stories, ...stories].map((story, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[400px] p-2 flex flex-col items-center justify-center bg-[#faf8f2] rounded-3xl border border-border-light shadow-lg"
            >
              <div className="flex gap-1 mb-1">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-brand-secondary text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-text-subtle mb-1 text-center">
                "{story.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-12 h-12 rounded-full object-cover border border-border-light"
                />
                <div>
                  <h4 className="font-bold text-text-main">{story.name}</h4>
                  <p className="text-sm text-text-muted">{story.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

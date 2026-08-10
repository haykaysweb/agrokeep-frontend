import { motion } from "framer-motion";

export default function StorageReviews() {
  return (
    <>
      {/* --- FARMER'S REVIEW SECTION --- */}
      <div className="mt-12 text-text-main font-sans">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Farmer's Review
        </h2>

        {/* Ratings Summary Header Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-8">
          {/* Left: Overall Rating Progress Bars */}
          <div className="md:col-span-3 flex flex-col justify-center pr-2">
            <span className="text-xs font-semibold text-text-subtle mb-2">
              Overall rating
            </span>
            <div className="space-y-1.5 w-full">
              {[
                { star: 5, pct: "85%" },
                { star: 4, pct: "12%" },
                { star: 3, pct: "3%" },
                { star: 2, pct: "0%" },
                { star: 1, pct: "0%" },
              ].map((item) => (
                <div
                  key={item.star}
                  className="flex items-center gap-2 text-xs text-text-muted"
                >
                  <span className="w-2 text-right font-medium">
                    {item.star}
                  </span>
                  <div className="flex-1 bg-[#e2e6e3] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-primary h-full rounded-full"
                      style={{ width: item.pct }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 5 Category Score Cards */}
          <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { title: "Cleanliness", score: "4.9", icon: "cleanliness" },
              { title: "Security", score: "4.9", icon: "security" },
              { title: "Accuracy", score: "4.7", icon: "accuracy" },
              { title: "Communication", score: "4.8", icon: "communication" },
              { title: "Value", score: "4.6", icon: "value" },
            ].map((cat) => (
              <div
                key={cat.title}
                className="bg-surface-card border border-brand-secondary/40 rounded-xl p-3.5 flex flex-col justify-between h-24 shadow-2xs"
              >
                <div className="flex items-center gap-1.5">
                  <img
                    src={`/icons/reviews/${cat.icon}.svg`}
                    alt=""
                    className="w-4 h-4 text-brand-primary"
                  />
                  <span className="text-xs font-medium text-text-subtle truncate">
                    {cat.title}
                  </span>
                </div>
                <p className="text-lg font-bold text-text-main">{cat.score}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Review Cards Grid (2x3 Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            {
              name: "Kemi O.",
              role: "Tomato Farmer, Ogun State",
              time: "10 hours ago",
              avatar: "/images/avatars/kemi.jpg",
              stars: 5,
              review:
                '"Kept my 200 bags of maize dry through the rainy season. Zero losses. Staff were professional and reachable."',
            },
            {
              name: "Funmi A.",
              role: "Tomato Grower, Ibadan",
              time: "1 day ago",
              avatar: "/images/avatars/funmi.jpg",
              stars: 5,
              review:
                '"The cooling chamber saved my harvest. I sold at a much better price two weeks later."',
            },
            {
              name: "Kunle T.",
              role: "Yam Trader, Osogbo",
              time: "3 days ago",
              avatar: "/images/avatars/kunle.jpg",
              stars: 4,
              review:
                '"Clean, secure and well ventilated. Booking through AgroKeep was smoother than I expected."',
            },
            {
              name: "Adewale A.",
              role: "Cassava Farmer, Ekiti State",
              time: "3 days ago",
              avatar: "/images/avatars/adewale.jpg",
              stars: 4,
              review:
                'Before AgroKeep, I lost part of my harvest while searching for buyers. Now I reserve storage early and fresh until it’s sold."',
            },
            {
              name: "Kaotar G.",
              role: "Tomato Grower, Ibadan",
              time: "7 days ago",
              avatar: "/images/avatars/kaotar.jpg",
              stars: 4,
              review:
                '"I no longer worry about my harvest spoiling before I find buyers. AgroKeep made storage simple and reliable."',
            },
            {
              name: "Adebayo O.",
              role: "Yam Trader, Osogbo",
              time: "1 week ago",
              avatar: "/images/avatars/adebayo.jpg",
              stars: 5,
              review:
                '"Clean, secure and well ventilated. Booking through AgroKeep was smoother than I expected."',
            },
          ].map((rev, index) => (
            <div
              key={index}
              className="bg-surface-card rounded-2xl p-4 flex flex-col justify-between shadow-2xs border border-border-light/60"
            >
              <div>
                {/* User Header */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover bg-surface-alt/30"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-text-main leading-tight">
                      {rev.name}
                    </h3>
                    <p className="text-[11px] text-text-muted">{rev.role}</p>
                  </div>
                </div>

                {/* Stars & Time */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-brand-secondary text-xs">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < rev.stars ? "opacity-100" : "opacity-30"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-text-muted">
                    {rev.time}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-text-subtle leading-relaxed">
                  {rev.review}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action Button */}
        <div className="flex justify-start">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-block cursor-pointer"
          >
            {/* Orange Offset */}
            <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-full bg-brand-secondary"></span>

            {/* Button Surface */}
            <span className="relative z-10 flex h-11 items-center justify-center rounded-full bg-brand-primary px-6 text-text-light font-semibold text-sm">
              Show all 132 reviews
            </span>
          </motion.button>
        </div>
      </div>
    </>
  );
}

import { useNavigate } from "react-router";
import LazyLoadImageRC from "@/components/ui/LazyLoadImage";

export default function StorageDetails() {
  const navigate = useNavigate();

  const placeholderImg =
    "https://res.cloudinary.com/dw5bai7mk/image/upload/v1784385071/Frame_274_yu0yte.svg";

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-12 py-4 font-sans text-text-main">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-text-subtle font-medium text-sm hover:text-brand-primary transition-colors duration-200 cursor-pointer"
        >
          <img src="/Arrow Left.svg" alt="Arrow Back" className="h-5 w-5" />
          Back
        </button>
      </div>

      <main>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:auto-rows-[220px]">
          <div className="col-span-2 h-[260px] sm:h-[340px] md:h-full md:row-span-2 rounded-2xl md:rounded-3xl overflow-hidden shadow-xs">
            <LazyLoadImageRC
              src={placeholderImg}
              alt="Main storage facility interior view"
              className="w-full h-full block object-cover"
            />
          </div>

          {/* Top Left Secondary Sub-angle */}
          <div className="h-[140px] sm:h-[180px] md:h-full rounded-xl md:rounded-2xl overflow-hidden shadow-xs">
            <LazyLoadImageRC
              src={placeholderImg}
              alt="Storage configuration alternate view 1"
              className="w-full h-full block object-cover"
            />
          </div>

          {/* Top Right Secondary Sub-angle */}
          <div className="h-[140px] sm:h-[180px] md:h-full rounded-xl md:rounded-2xl overflow-hidden shadow-xs">
            <LazyLoadImageRC
              src={placeholderImg}
              alt="Storage configuration alternate view 2"
              className="w-full h-full block object-cover"
            />
          </div>

          {/* Bottom Left Secondary Sub-angle */}
          <div className="h-[140px] sm:h-[180px] md:h-full rounded-xl md:rounded-2xl overflow-hidden shadow-xs">
            <LazyLoadImageRC
              src={placeholderImg}
              alt="Storage configuration alternate view 3"
              className="w-full h-full block object-cover"
            />
          </div>

          {/* Bottom Right Secondary Sub-angle */}
          <div className="h-[140px] sm:h-[180px] md:h-full rounded-xl md:rounded-2xl overflow-hidden shadow-xs">
            <LazyLoadImageRC
              src={placeholderImg}
              alt="Storage configuration alternate view 4"
              className="w-full h-full block object-cover"
            />
          </div>
        </div>

        {/* Future sub-content blocks go down here */}
        <div className="mt-10">jhsajh</div>
      </main>
    </section>
  );
}

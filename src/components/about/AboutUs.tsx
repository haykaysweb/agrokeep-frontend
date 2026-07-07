export default function AboutUs() {
  return (
    <>
      {/* hero section for the contact us */}
      <section
        className="relative w-full h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dw5bai7mk/image/upload/v1783426371/photo-1625246333195-78d9c38ad449_arunqi.avif')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Semi-transparent overlay using your custom overlay color */}
        <div className="absolute inset-0 bg-overlay-dark/70" />

        {/* Content Container */}
        <div className="relative z-10 text-center px-4 max-w-2xl text-text-light">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-sans">
            About AgroKeep
          </h2>
          <p className="text-lg md:text-xl font-light text-text-light/90">
            AgroKeep exists to help farmers preserve what they work so hard to
            grow by connecting them with trusted, accessible storage
            facilities before post-harvest losses occur.
          </p>
          {/* design the two button here */}
          {/* here */}
        </div>
      </section>

      {/* Content section in the about page */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-12 py-18">
        {/* content goes in here */}
        JHSDJHJHhjhhdjh
      </main>
    </>
  );
}

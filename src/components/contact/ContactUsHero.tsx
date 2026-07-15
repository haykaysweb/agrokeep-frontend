export default function ContactUsHero() {
  return (
    <>
      <section
        className="relative w-full h-[600px] md:h-[400px]  flex items-center justify-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dw5bai7mk/image/upload/v1783422830/markus-winkler-HeqXGxnsnX4-unsplash_whdicv.jpg')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-overlay-dark/70" />
        <div className="relative z-10 text-center px-4 max-w-3xl text-text-light">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg md:text-xl font-light text-text-light/90">
            We're here to help you every step of the way! Whether you have
            questions, feedback, or need support, our team is ready to assist
            you.
          </p>
        </div>
      </section>
    </>
  );
}

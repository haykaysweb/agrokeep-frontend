import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import {
  validateContactFormSchema,
  type contactFormSchemaType,
} from "@/lib/SchemaTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { contactUsApi } from "@/api/contactUs";
import { showToast } from "@/utils/CustomToast";
import axios from "axios";

const locations = [
  { state: "Oyo State", address: "1, Oyo road, Oyo Town" },
  { state: "Oyo State", address: "1, Saki road, Saki" },
  { state: "Osun State", address: "1, Osun road, Osogbo" },
  { state: "Osun State", address: "1, Ikirun road, Ikirun" },
  { state: "Ekiti State", address: "1, Ekiti road, Ekiti Town" },
  { state: "Ekiti State", address: "1, Ekiti road, Ekiti Town" },
  { state: "Ondo State", address: "1, Ondo road, Ondo Town" },
  { state: "Ogun State", address: "1, Isagamu road, Isagamu" },
  { state: "Ogun State", address: "1, Ogun road, Ogun" },
];

export default function ContactUs() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<contactFormSchemaType>({
    resolver: zodResolver(validateContactFormSchema),
    mode: "onTouched", // Best for UX: errors show when user leaves the field
    reValidateMode: "onChange", // Instant feedback after the first error
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: contactUsApi,
    onSuccess: (res) => {
      showToast.success(
        res.data.message ||
          "Message sent successfully! We will get back to you soon.",
      );
      reset(); // Clear all form fields
    },
    onError: (error) => {
      if (import.meta.env.DEV) console.error("Contact Form Error:", error);
      if (axios.isAxiosError(error)) {
        showToast.error(
          error.response?.data?.message ||
            "Failed to send message. Please try again.",
        );
      } else {
        showToast.error("An unexpected error occurred.");
      }
    },
  });

  const onSubmitForm = async (data: contactFormSchemaType) => {
    mutation.mutate(data);
  };

  return (
    <>
      <section
        className="relative w-full h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dw5bai7mk/image/upload/v1783422830/markus-winkler-HeqXGxnsnX4-unsplash_whdicv.jpg')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-overlay-dark/70" />
        <div className="relative z-10 text-center px-4 max-w-2xl text-text-light">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg md:text-xl font-light text-text-light/90">
            We're here to help you every step of the way!
          </p>
        </div>
      </section>

      <main className="w-full max-w-7xl mx-auto px-4 md:px-12 py-18">
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-brand-primary font-medium">
              <img src="/flowerIcon3.svg" alt="" className="w-5 h-5" />
              <span>Contact Us</span>
            </div>
            <h1 className="text-5xl font-bold text-text-main">
              We Are <span className="text-brand-primary">Ready to Help</span>
            </h1>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-10">
                  <img src="/phone.svg" alt="phone" />
                </div>
                <div>
                  <p className="font-semibold text-text-main">Phone</p>
                  <p className="text-text-subtle">+234 900 0000 0000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10">
                  <img src="/email.svg" alt="email" />
                </div>
                <div>
                  <p className="font-semibold text-text-main">Email</p>
                  <p className="text-text-subtle">company@agrokeep.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column*/}
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            {/* Full Name Field */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Full name"
                className="w-full p-4 rounded-xl bg-surface-card border border-border-input focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all placeholder:text-text-muted"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-semantic-error text-xs mt-2">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email and Phone Grid Container */}
            <div className="grid grid-cols-2 gap-4">
              {/* Email Field Wrapper */}
              <div className="flex flex-col">
                <input
                  type="email"
                  placeholder="Email address"
                  className="p-4 rounded-xl bg-surface-card border border-border-input focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all placeholder:text-text-muted"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-semantic-error text-xs mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Field Wrapper */}
              <div className="flex flex-col">
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="p-4 rounded-xl bg-surface-card border border-border-input focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all placeholder:text-text-muted"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-semantic-error text-xs mt-2">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="w-full">
              <textarea
                placeholder="Message (Tell us how we can help you)"
                rows={6}
                className="w-full p-4 rounded-xl bg-surface-card border border-border-input focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all placeholder:text-text-muted resize-none"
                {...register("message")}
              />
              {errors.message && (
                <p className="text-semantic-error text-xs mt-2">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="relative inline-block w-full cursor-pointer"
              disabled={mutation.isPending}
            >
              <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary "></span>
              <span className="relative z-10 flex h-10 items-center justify-center gap-3 rounded-full bg-brand-primary px-8 py-3 text-text-light">
                {mutation.isPending ? (
                  "Sending Message..."
                ) : (
                  <span className="text-sm font-medium md:text-base">
                    Send Message
                  </span>
                )}
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary">
                  <ArrowUpRight
                    className="h-4 w-4 text-text-light"
                    strokeWidth={2.5}
                  />
                </span>
              </span>
            </motion.button>

            <p className="text-sm text-text-muted text-start">
              By submitting, you agree to our terms and privacy policy.
            </p>
          </form>
        </div>
      </main>

      {/* our storage location */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-text-main text-center mb-12">
          Our Storage Locations
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc, index) => (
            <div
              key={index}
              className="bg-surface-card p-6 rounded-2xl border border-border-light shadow-sm"
            >
              <h3 className="text-xl font-bold text-text-main mb-1">
                {loc.state}
              </h3>
              <p className="text-text-subtle mb-4">{loc.address}</p>
              <hr className="border-border-light mb-4" />
              <div className="flex items-center gap-2 text-brand-primary font-medium">
                <img src="phoneCon.svg" alt="" />
                <span>+234 900 0000 0000</span>
              </div>
            </div>
          ))}
        </div>
      </section>
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

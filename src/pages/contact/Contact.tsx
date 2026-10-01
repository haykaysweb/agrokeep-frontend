import Seo from "@/components/Seo";
import ContactUsFaq from "@/pages/contact/ContactUsFaq";
import ContactUsForm from "@/pages/contact/ContactUsForm";
import ContactUsHero from "@/pages/contact/ContactUsHero";
import StorageLocation from "@/pages/contact/StorageLocation";

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with the AgroKeep team. Reach out for support, partnership inquiries, or help finding verified crop storage hubs near you."
      />
      <section className="bg-backgroundTwo">
        <ContactUsHero />
        <ContactUsForm />
        <StorageLocation />
        <ContactUsFaq />
      </section>
    </>
  );
}

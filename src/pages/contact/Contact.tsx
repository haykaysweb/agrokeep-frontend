import ContactUsFaq from "@/pages/contact/ContactUsFaq";
import ContactUsForm from "@/pages/contact/ContactUsForm";
import ContactUsHero from "@/pages/contact/ContactUsHero";
import StorageLocation from "@/pages/contact/StorageLocation";

export default function Contact() {
  return (
    <>
      <section className="bg-backgroundTwo">
        <ContactUsHero />
        <ContactUsForm />
        <StorageLocation />
        <ContactUsFaq />
      </section>
    </>
  );
}

import ContactUsFaq from "@/components/contact/ContactUsFaq";
import ContactUsForm from "@/components/contact/ContactUsForm";
import ContactUsHero from "@/components/contact/ContactUsHero";
import StorageLocation from "@/components/contact/StorageLocation";

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

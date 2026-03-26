import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import ExperienceSection from "@/components/ExperienceSection";
import Education from "@/components/Education";
import Contact, { Footer } from "@/components/Contact";
import ScrollToTop from "@/components/ScrollToTop";
import { LanguageProvider } from "@/i18n/LanguageContext";

const Index = () => (
  <LanguageProvider>
    <Navbar />
    <Hero />
    <About />
    <ExperienceSection />
    <Education />
    <Skills />
    <Contact />
    <Footer />
    <ScrollToTop />
  </LanguageProvider>
);

export default Index;

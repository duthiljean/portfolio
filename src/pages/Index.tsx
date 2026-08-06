import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import ExperienceSection from "@/components/ExperienceSection";
import CleoShowcase from "@/components/CleoShowcase";
import Education from "@/components/Education";
import Contact, { Footer } from "@/components/Contact";
import ChatWidget from "@/components/ChatWidget";
import { LanguageProvider } from "@/i18n/LanguageContext";

const Index = () => (
  <LanguageProvider>
    <Navbar />
    <Hero />
    <About />
    <CleoShowcase />
    <ExperienceSection />
    <Skills />
    <Education />
    <Contact />
    <Footer />
    <ChatWidget />
  </LanguageProvider>
);

export default Index;

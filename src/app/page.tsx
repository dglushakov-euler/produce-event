import Hero from "@/components/sections/Hero";
import Manifest from "@/components/sections/Manifest";
import Services from "@/components/sections/Services";
import Cases from "@/components/sections/Cases";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import CtaBand from "@/components/sections/CtaBand";
import Clients from "@/components/sections/Clients";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifest />
      <Services />
      <Cases />
      <About />
      <Process />
      <CtaBand />
      <Clients />
      <Contact />
    </>
  );
}

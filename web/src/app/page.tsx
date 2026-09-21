import Image from "next/image";
import BootSection from "@/components/BootSection";
import CareerSection from "@/components/CareerSection";
import ConsoleSection from "@/components/ConsoleSection";
import ProjectsSection from "@/components/ProjectsSection";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  return (
    <>
      <div className="wrap">
        <header className="identity">
          <Image
            className="avatar"
            src="/foto-perfil.png"
            alt="Jorge Iván Grisales Marín"
            width={56}
            height={56}
            priority
          />
          <div className="identity-text">
            <h1>Jorge Iván Grisales Marín</h1>
            <p>Founder &amp; CTO. Building agentic systems on AWS/GCP.</p>
          </div>
          <div className="session-pill">
            <span className="dot" /> session active
          </div>
        </header>

        <BootSection />
        <CareerSection />
        <ProjectsSection />
        <ConsoleSection />

        <footer>
          <a href="mailto:jivagris1989@gmail.com">jivagris1989@gmail.com</a>
          <a href="https://github.com/jivagrisma" target="_blank" rel="noopener">
            github.com/jivagrisma
          </a>
          <a href="https://linkedin.com/in/ivangrisales" target="_blank" rel="noopener">
            linkedin.com/in/ivangrisales
          </a>
        </footer>
      </div>
      <StatusBar />
    </>
  );
}

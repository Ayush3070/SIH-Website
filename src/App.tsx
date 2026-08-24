import { useState, useEffect, useRef } from "react";
import IntroHero from "./components/IntroHero";
import FluidGradientEngine from "./components/FluidGradientEngine";
import ProblemStatementsGrid from "./components/ProblemStatementsGrid";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let frameId = 0;
    const compactQuery = window.matchMedia("(max-width: 1024px), (pointer: coarse)");

    const updateLogoFade = () => {
      frameId = 0;
      const logo = logoRef.current;
      if (!logo) return;

      if (compactQuery.matches) {
        logo.style.opacity = "";
        logo.style.visibility = "visible";
        return;
      }

      const fadeRange = window.innerHeight * 0.45;
      const progress = Math.min(window.scrollY / fadeRange, 1);
      logo.style.opacity = `${1 - progress}`;
      logo.style.visibility = progress >= 1 ? "hidden" : "visible";
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateLogoFade);
    };

    updateLogoFade();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  if (!loaded) {
    return <LoadingScreen onComplete={() => setLoaded(true)} />;
  }

  return (
    <main className="relative min-h-[750vh] w-screen overflow-x-hidden bg-black text-white selection:bg-cyan-300 selection:text-black">
      <FluidGradientEngine />
      <div
        ref={logoRef}
        className="tsdcem-logo fixed top-5 left-5 z-30 pointer-events-auto"
        style={{ transition: "opacity 120ms linear" }}
      >
        <img
          src="/tsdcem.png"
          alt="TSDCEM Logo"
          className="h-10 w-auto md:h-12"
          style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}
        />
      </div>
      <IntroHero />
      <section className="absolute left-0 top-[120vh] z-20 w-full pointer-events-auto">
        <ProblemStatementsGrid />
      </section>
    </main>
  );
}

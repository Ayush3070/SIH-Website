import { useEffect, useRef } from "react";
import LiquidGlass from "./LiquidGlass";

export default function IntroHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frameId = 0;

    const updateHeroPosition = () => {
      frameId = 0;
      const hero = heroRef.current;
      if (!hero) return;

      const scrollRange = window.innerHeight * 1.2;
      const progress = Math.min(window.scrollY / scrollRange, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      hero.style.transform = `translate3d(0, ${easedProgress * -72}vh, 0) scale(${1 - easedProgress * 0.08})`;
      hero.style.opacity = `${1 - easedProgress * 0.72}`;
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateHeroPosition);
    };

    updateHeroPosition();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      className="fixed inset-0 z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center pointer-events-none"
      ref={heroRef}
    >
      <div className="hero-orb" />
      <LiquidGlass
        borderRadius={42}
        className="hero-liquid-copy"
        variant="subtle"
      >
        <p className="font-mono text-sm uppercase tracking-[0.28em] text-cyan-200 md:text-base">
          Thakur Shree DPS College of Engineering and Management
        </p>
        <h1 className="mt-5 max-w-6xl text-5xl font-black leading-[0.86] tracking-[-0.08em] text-white md:text-7xl lg:text-9xl">
          Internal Hackathon
        </h1>
        <h2 className="mt-6 text-2xl font-light tracking-[0.18em] text-white/80 md:text-4xl">
          SIH Team Selection
        </h2>
      </LiquidGlass>
      <div className="absolute bottom-10 flex flex-col items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/45">
        <span className="scroll-indicator" />
      </div>
    </section>
  );
}

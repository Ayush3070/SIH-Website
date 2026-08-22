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
        <p className="font-mono text-base uppercase tracking-[0.28em] text-cyan-200 md:text-lg">
  Thakur Shree DPS College of Engineering and Management
</p>
                <h1 className="scan-heading mt-5 max-w-6xl text-5xl font-black leading-[0.86] tracking-[-0.08em] text-white md:text-7xl lg:text-9xl">
          <span className="scan-text-dim">Internal Hackathon</span>
          <span className="scan-text-neon" aria-hidden="true">
            Internal Hackathon 
          </span>
          <span className="scan-bar" aria-hidden="true" />
        </h1>
        <style>{`
          .scan-heading {
            position: relative;
            display: inline-block;
            overflow: hidden;
          }

          .scan-heading .scan-text-dim {
            color: rgba(94, 85, 85, 0.14);
          }

          .scan-heading .scan-text-neon {
            position: absolute;
            inset: 0;
            pointer-events: none;
            color:rgba(225, 246, 40, 0.9),
            text-shadow:
              0 0 12px rgba(0, 0, 0, 0.9),
              0 0 30px rgba(6, 6, 6, 0.55),
              0 0 64px rgb(46, 46, 46);
            -webkit-clip-path: inset(0 100% 0 0);
            clip-path: inset(0 100% 0 0);
            animation: scan-reveal 2.5s cubic-bezier(0.45, 0, 0.55, 1) 1s infinite;
          }

          .scan-heading .scan-bar {
            position: absolute;
            top: -8%;
            bottom: -8%;
            width: 3px;
            border-radius: 999px;
            background:rgb(27, 28, 28);
            box-shadow:
              0 0 15px 2px rgba(255, 255, 255, 0.9),
              0 0 34px 7px rgba(231, 229, 125, 0.45);
            z-index: 10;
            left: -5%;
            opacity: 0;
            animation: scan-sweep 2.5s cubic-bezier(0.45, 0, 0.55, 1) 1s infinite;
          }

          @keyframes scan-sweep {
            0% { left: -5%; opacity: 0; }
            4% { opacity: 1; }
            92% { opacity: 1; }
            100% { left: 103%; opacity: 0; }
          }

          @keyframes scan-reveal {
            0% { -webkit-clip-path: inset(0 100% 0 0); clip-path: inset(0 100% 0 0); }
            100% { -webkit-clip-path: inset(0 0% 0 0); clip-path: inset(0 0% 0 0); }
          }

          @media (prefers-reduced-motion: reduce) {
            .scan-heading .scan-text-neon,
            .scan-heading .scan-bar {
              animation: none;
            }
            .scan-heading .scan-bar {
              opacity: 0;
            }
          }
        `}</style>
      </LiquidGlass>
      <div className="absolute bottom-10 flex flex-col items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/45">
        <span className="scroll-indicator" />
      </div>
    </section>
  );
}

export default function IntroHero() {
  return (
    <section className="fixed inset-0 z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center pointer-events-none">
      <div className="hero-orb" />
      <p className="font-mono text-sm uppercase tracking-[0.28em] text-cyan-200 md:text-base">
        Thakur Shree DPS College of Engineering and Management
      </p>
      <h1 className="mt-5 max-w-6xl text-5xl font-black leading-[0.86] tracking-[-0.08em] text-white md:text-7xl lg:text-9xl">
        Internal Hackathon
      </h1>
      <h2 className="mt-6 text-2xl font-light tracking-[0.18em] text-white/80 md:text-4xl">
        SIH Team Selection
      </h2>
      <div className="absolute bottom-10 flex flex-col items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/45">
        <span>Scroll to explore</span>
        <span className="scroll-indicator" />
      </div>
    </section>
  );
}

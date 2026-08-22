import { useState, useEffect } from "react";
import ThreePortalBackground from "./components/ThreePortalBackground";
import IntroHero from "./components/IntroHero";
import ProblemStatementsGrid from "./components/ProblemStatementsGrid";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2700);
    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    return <LoadingScreen onComplete={() => setLoaded(true)} />;
  }

  return (
    <main className="relative min-h-[750vh] w-screen overflow-x-hidden bg-black text-white selection:bg-cyan-300 selection:text-black">
      <ThreePortalBackground />
      <IntroHero />
      <section className="absolute left-0 top-[120vh] z-20 w-full pointer-events-auto">
        <ProblemStatementsGrid />
      </section>
    </main>
  );
}

import ThreePortalBackground from "./components/ThreePortalBackground";
import IntroHero from "./components/IntroHero";
import ProblemStatementsGrid from "./components/ProblemStatementsGrid";

export default function App() {
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

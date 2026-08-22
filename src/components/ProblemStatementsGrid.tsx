import { problemStatements } from "../data/problemStatements";

const difficultyStyles = {
  Easy: "border-emerald-300/30 text-emerald-200",
  Medium: "border-cyan-300/30 text-cyan-200",
  Hard: "border-rose-300/30 text-rose-200",
};

export default function ProblemStatementsGrid() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <header className="glass-panel mb-8 p-6 md:mb-10 md:p-9">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-cyan-200">
          SIH Internal Selection
        </p>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <h2 className="text-4xl font-black leading-none tracking-[-0.06em] text-white md:text-6xl lg:text-7xl">
            Problem Statements
          </h2>
          <p className="text-sm leading-7 text-white/62 md:text-base">
            Choose a challenge, form a focused team, and prepare a prototype
            plan for the college-level SIH selection round.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {problemStatements.map((statement, index) => (
          <article
            className="glass-card group min-h-[255px] p-5 md:p-6"
            key={statement.id}
            style={{ animationDelay: `${Math.min(index * 28, 500)}ms` }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <span className="font-mono text-xs font-bold tracking-[0.18em] text-cyan-200">
                {statement.id}
              </span>
              <span
                className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
                  difficultyStyles[statement.difficulty]
                }`}
              >
                {statement.difficulty}
              </span>
            </div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/42">
              {statement.domain}
            </p>
            <h3 className="mb-4 text-2xl font-extrabold leading-tight tracking-[-0.035em] text-white">
              {statement.title}
            </h3>
            <p className="text-sm leading-7 text-white/60">
              {statement.description}
            </p>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-cyan-200/0 via-cyan-200/35 to-fuchsia-300/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </article>
        ))}
      </div>
    </div>
  );
}

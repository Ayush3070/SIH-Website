import { problemStatements } from "../data/problemStatements";
import type { ProblemStatement } from "../data/problemStatements";
import { useEffect, useState } from "react";
import LiquidGlass from "./LiquidGlass";

const difficultyStyles = {
  Easy: "border-emerald-300/30 text-emerald-200",
  Medium: "border-cyan-300/30 text-cyan-200",
  Hard: "border-rose-300/30 text-rose-200",
};

export default function ProblemStatementsGrid() {
  const [selectedStatement, setSelectedStatement] =
    useState<ProblemStatement | null>(null);

  useEffect(() => {
    if (!selectedStatement) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedStatement(null);
      }
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedStatement]);

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <header className="glass-panel mb-8 p-6 md:mb-10 md:p-9 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-cyan-200">
            SIH Internal Selection
          </p>
          <div className="mt-4">
            <h2 className="text-4xl font-black leading-none tracking-[-0.06em] text-white md:text-6xl lg:text-7xl">
              Problem Statements
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/62 md:text-base">
              Choose a challenge, form a focused team, and prepare a prototype
              plan for the college-level SIH selection round.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {problemStatements.map((statement, index) => (
            <LiquidGlass
              aria-label={`View detailed problem statement for ${statement.title}`}
              className="glass-card group min-h-[255px] p-5 md:p-6"
              borderRadius={26}
              key={statement.id}
              onClick={() => setSelectedStatement(statement)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedStatement(statement);
                }
              }}
              role="button"
              style={{ animationDelay: `${Math.min(index * 28, 500)}ms` }}
              tabIndex={0}
              variant="default"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
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
            </LiquidGlass>
          ))}
        </div>
      </div>

      {selectedStatement ? (
        <ProblemStatementDialog
          onClose={() => setSelectedStatement(null)}
          statement={selectedStatement}
        />
      ) : null}
    </>
  );
}

function ProblemStatementDialog({
  onClose,
  statement,
}: {
  onClose: () => void;
  statement: ProblemStatement;
}) {
  return (
    <div
      aria-labelledby="problem-dialog-title"
      aria-modal="true"
      className="problem-dialog-backdrop"
      role="dialog"
    >
      <button
        aria-label="Close problem statement details"
        className="problem-dialog-scrim"
        onClick={onClose}
        type="button"
      />

      <article className="problem-dialog-card">
        <button
          aria-label="Close problem statement details"
          className="problem-dialog-close"
          onClick={onClose}
          type="button"
        >
          Close
        </button>

        <div className="problem-dialog-eyebrow">
          <span>{statement.id}</span>
          <span>{statement.domain}</span>
          <span>{statement.difficulty}</span>
        </div>

        <h3 id="problem-dialog-title">{statement.title}</h3>

        <section>
          <h4>Detailed Problem Statement</h4>
          <p>
            {statement.description} The team must identify the intended users,
            define the real-world workflow, and build a prototype that proves
            the proposed solution can work in a practical deployment scenario.
          </p>
        </section>

        <section>
          <h4>Expected Prototype</h4>
          <div className="problem-dialog-grid">
            <p>Working interface or dashboard for the primary user journey.</p>
            <p>Core automation, prediction, analysis, or decision-support logic.</p>
            <p>Clear output, report, alert, recommendation, or measurable result.</p>
          </div>
        </section>

        <section>
          <h4>Evaluation Focus</h4>
          <p>
            Selection should emphasize feasibility, technical depth, usability,
            impact, and clarity of execution. The best teams should show a
            buildable implementation plan instead of only presenting an idea.
          </p>
        </section>
      </article>
    </div>
  );
}

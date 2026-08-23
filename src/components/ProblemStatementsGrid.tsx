import { problemStatements } from "../data/problemStatements";
import type { ProblemStatement } from "../data/problemStatements";
import { useEffect, useState } from "react";
import LiquidGlass from "./LiquidGlass";

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
              aria-label={`View detailed problem statement for ${statement["Problem Statement Title"]}`}
              className="glass-card group min-h-[255px] p-5 md:p-6"
              borderRadius={26}
              key={statement["PS.Id"]}
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
                  PS.No. {statement["PS.No."]}
                </span>
                <span className="rounded-full border border-cyan-300/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-200">
                  {statement.Category}
                </span>
              </div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/42">
                {statement.Theme}
              </p>
              <h3 className="mb-4 text-2xl font-extrabold leading-tight tracking-[-0.035em] text-white">
                {statement["Problem Statement Title"]}
              </h3>
              <p className="font-mono text-xs tracking-[0.18em] text-white/45">
                {statement["PS.Id"]}
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
          <span>PS.No. {statement["PS.No."]}</span>
          <span>{statement.Theme}</span>
          <span>{statement["PS.Id"]}</span>
        </div>

        <h3 id="problem-dialog-title">{statement["Problem Statement Title"]}</h3>

        <section>
          <h4>Details</h4>
          <div className="problem-dialog-grid">
            <p>Theme: {statement.Theme}</p>
            <p>Category: {statement.Category}</p>
            <p>PS ID: {statement["PS.Id"]}</p>
          </div>
        </section>

        <section>
          <p>
            <a
              href="https://sih.gov.in/sih2026PS"
              rel="noreferrer"
              style={{ color: "inherit", textDecoration: "none" }}
              target="_blank"
            >
              CLICK HERE
            </a>
          </p>
        </section>
      </article>
    </div>
  );
}

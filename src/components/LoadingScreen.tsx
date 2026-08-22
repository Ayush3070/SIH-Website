import { useEffect, useState, useRef } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>(1);

  useEffect(() => {
    let startTime = performance.now();
    const duration = 2400;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setProgress(eased);

      if (p < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setVisible(false);
          onComplete();
        }, 300);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "#02030a" }}
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="relative z-10 flex flex-col items-center gap-6 pointer-events-none">
        <div className="font-mono text-xs uppercase tracking-[0.4em] text-white/40">
          SIH Internal Selection
        </div>

        <div className="relative w-72 h-72">
          <svg className="w-full h-full" viewBox="0 0 288 288">
            <defs>
              <filter id="progressGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="144"
              cy="144"
              r="120"
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="1.5"
            />
            <circle
              cx="144"
              cy="144"
              r="120"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="1.5"
              strokeDasharray={`${progress * 754} 754`}
              strokeLinecap="round"
              transform="rotate(-90 144 144)"
              filter="url(#progressGlow)"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#39ff14" />
                <stop offset="50%" stopColor="#ff8c00" />
                <stop offset="100%" stopColor="#39ff14" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-black text-5xl md:text-7xl tracking-[-0.04em] text-white/60">
              {Math.round(progress * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
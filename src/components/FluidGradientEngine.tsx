import React from "react";

export default function FluidGradientEngine({ className }: { className?: string }) {
  return (
    <div className={"fluid-bg fixed inset-0 w-full h-full pointer-events-none " + (className || "")}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fluid-bg-video w-full h-full object-cover"
      >
        <source
          src="https://cdn.jiro.build/videos/background/fluid-gradient-engine.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/15" />
    </div>
  );
}

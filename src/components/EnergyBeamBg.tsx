import React from "react";

export default function EnergyBeamBg({ className }: { className?: string }) {
  return (
    <div className={"fixed inset-0 w-full h-full pointer-events-none " + (className || "")}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      >
        <source
          src="https://cdn.jiro.build/videos/background/energy-beam-bg.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/15" />
    </div>
  );
}

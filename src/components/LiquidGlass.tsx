import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";

const GLASS_PRESETS = {
  subtle: {
    backgroundOpacity: 0.25,
    saturation: 1.1,
    blur: 3,
    distortionScale: 18,
  },
  default: {
    backgroundOpacity: 0.35,
    saturation: 1.25,
    blur: 7,
    distortionScale: 34,
  },
  bold: {
    backgroundOpacity: 0.45,
    saturation: 1.45,
    blur: 12,
    distortionScale: 54,
  },
};

type GlassVariant = keyof typeof GLASS_PRESETS;

type LiquidGlassProps = {
  borderRadius?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: GlassVariant;
} & HTMLAttributes<HTMLDivElement>;

export default function LiquidGlass({
  borderRadius = 32,
  children,
  className = "",
  style,
  variant = "default",
  ...props
}: LiquidGlassProps) {
  const uniqueId = useId().replace(/:/g, "-");
  const filterId = `liquid-glass-${uniqueId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const displacementMapRef = useRef<SVGFEDisplacementMapElement>(null);
  const preset = useMemo(() => GLASS_PRESETS[variant], [variant]);

  useEffect(() => {
    const updateFilterMap = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.max(rect.width, 200);
      const height = Math.max(rect.height, 64);
      const svgContent = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="glassGrad-${uniqueId}" cx="45%" cy="30%" r="80%">
              <stop offset="0%" stop-color="rgb(35,35,35)"/>
              <stop offset="45%" stop-color="rgb(18,18,18)"/>
              <stop offset="100%" stop-color="rgb(5,5,5)"/>
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#glassGrad-${uniqueId})" rx="${borderRadius}"/>
        </svg>
      `;

      feImageRef.current?.setAttribute(
        "href",
        `data:image/svg+xml,${encodeURIComponent(svgContent)}`,
      );
      displacementMapRef.current?.setAttribute(
        "scale",
        preset.distortionScale.toString(),
      );
    };

    updateFilterMap();

    const observer = new ResizeObserver(updateFilterMap);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [borderRadius, preset, uniqueId]);

  return (
    <div
      {...props}
      className={`liquid-glass ${className}`}
      ref={containerRef}
      style={
        {
          "--glass-radius": `${borderRadius}px`,
          "--glass-bg-opacity": preset.backgroundOpacity,
          "--glass-saturation": preset.saturation,
          "--glass-blur": `${preset.blur}px`,
          "--glass-filter": `url(#${filterId})`,
          ...style,
        } as CSSProperties
      }
    >
      <svg
        aria-hidden="true"
        className="liquid-glass-svg"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter
          colorInterpolationFilters="sRGB"
          height="200%"
          id={filterId}
          width="200%"
          x="-50%"
          y="-50%"
        >
          <feImage
            height="100%"
            preserveAspectRatio="none"
            ref={feImageRef}
            result="map"
            width="100%"
            x="0"
            y="0"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            ref={displacementMapRef}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="liquid-glass-content">{children}</div>
      <div className="liquid-glass-topline" />
      <div className="liquid-glass-shine" />
    </div>
  );
}

interface LogoProps {
  variant?: "light" | "dark" | "auto";
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  className?: string;
}

const SIZES = {
  sm: { icon: 32, wordmark: 14, gap: 10 },
  md: { icon: 40, wordmark: 18, gap: 12 },
  lg: { icon: 52, wordmark: 22, gap: 16 },
};

/**
 * ZumArzt Logo — Konzept "Pfeil trifft Kreuz"
 * Gradient Blau→Grün, weißes Kreuz, gerundetes Icon.
 */
const Logo = ({ variant = "auto", size = "md", iconOnly = false, className = "" }: LogoProps) => {
  const s = SIZES[size];
  const textColor =
    variant === "light" ? "#FFFFFF"
    : variant === "dark" ? "#0F172A"
    : "currentColor";
  const accentColor = variant === "light" ? "#A7F3D0" : "#10B981";

  const totalWidth = iconOnly ? s.icon : s.icon + s.gap + (size === "sm" ? 82 : size === "md" ? 104 : 130);

  return (
    <svg
      width={totalWidth}
      height={s.icon}
      viewBox={`0 0 ${totalWidth} ${s.icon}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ZumArzt"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2={s.icon} y2={s.icon} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* ── Icon Background ── */}
      <rect
        width={s.icon}
        height={s.icon}
        rx={s.icon * 0.27}
        fill="url(#logo-grad)"
      />

      {/* ── Cross vertical bar ── */}
      <rect
        x={s.icon * 0.44}
        y={s.icon * 0.21}
        width={s.icon * 0.12}
        height={s.icon * 0.58}
        rx={s.icon * 0.06}
        fill="white"
      />

      {/* ── Cross horizontal bar ── */}
      <rect
        x={s.icon * 0.21}
        y={s.icon * 0.44}
        width={s.icon * 0.58}
        height={s.icon * 0.12}
        rx={s.icon * 0.06}
        fill="white"
      />

      {/* ── Wordmark ── */}
      {!iconOnly && (
        <>
          <text
            x={s.icon + s.gap}
            y={s.icon * 0.44}
            fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
            fontWeight="700"
            fontSize={s.wordmark}
            fill={textColor}
            letterSpacing="-0.3"
          >
            Zum
          </text>
          <text
            x={s.icon + s.gap}
            y={s.icon * 0.86}
            fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
            fontWeight="800"
            fontSize={s.wordmark}
            fill={accentColor}
            letterSpacing="-0.3"
          >
            Arzt
          </text>
        </>
      )}
    </svg>
  );
};

export default Logo;

interface LogoMarkProps {
  height?: number;
  light?: boolean;
}

export function LogoMark({ height = 52, light = true }: LogoMarkProps) {
  const color = light ? "#ffffff" : "#0D2565";
  const scale = height / 52;
  const w = Math.round(230 * scale);
  const h = Math.round(52 * scale);

  return (
    <svg
      viewBox="0 0 230 52"
      height={h}
      width={w}
      style={{ display: "block", overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Signal icon above the "i" — centered at x≈79 (after "omn" in Arimo Bold 36px) */}
      <g transform="translate(72, 0)">
        {/* outer arc */}
        <path
          d="M 0 10 A 7 7 0 0 1 14 10"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* inner arc */}
        <path
          d="M 3.5 13 A 3.5 3.5 0 0 1 10.5 13"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* centre dot */}
        <circle cx="7" cy="17" r="1.8" fill={color} />
      </g>

      {/* Full "omniQure" wordmark as one string */}
      <text
        x="0"
        y="41"
        fontFamily="'Arimo', Arial, sans-serif"
        fontWeight="700"
        fontSize="36"
        fill={color}
        letterSpacing="-0.5"
      >
        omniQure
      </text>

      {/* "PEPTIDE RESEARCH INSTITUTE" subtitle */}
      <text
        x="1"
        y="51"
        fontFamily="'Arimo', Arial, sans-serif"
        fontWeight="500"
        fontSize="7.5"
        fill={color}
        letterSpacing="2.4"
        opacity="0.9"
      >
        PEPTIDE RESEARCH INSTITUTE
      </text>
    </svg>
  );
}

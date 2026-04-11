import { buildRoutePath, decodePolyline } from '../lib/runUtils';

export default function RunRoute({
  summaryPolyline,
  className,
}: {
  summaryPolyline: string;
  className?: string;
}) {
  const { d, viewBox } = buildRoutePath(decodePolyline(summaryPolyline));

  return (
    <svg
      viewBox={viewBox}
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="run-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d76d43" />
          <stop offset="100%" stopColor="#8f5d3e" />
        </linearGradient>
      </defs>
      <path
        d={d}
        stroke="rgba(143, 93, 62, 0.12)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        stroke="url(#run-stroke)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

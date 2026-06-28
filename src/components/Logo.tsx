import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0 select-none group">
      {/* V icon — stylized V as a play/forward arrow with purple-to-blue gradient + glow */}
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="vt-grad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="vt-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background rounded square */}
        <rect width="34" height="34" rx="9" fill="url(#vt-grad)" />

        {/* Stylized V shape — two angled strokes forming a sharp V that reads as a play/forward caret */}
        <g filter="url(#vt-glow)">
          {/* Left arm of V */}
          <path
            d="M7 9L17 25L27 9"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Inner forward-arrow accent — a smaller V nestled inside, offset right, giving depth + motion */}
          <path
            d="M13 9L20 20"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.45"
            fill="none"
          />
        </g>
      </svg>

      {/* Wordmark */}
      <span className="text-[1.3rem] font-bold tracking-tight leading-none">
        <span className="text-red-600">Vee</span>
        <span style={{ color: '#7C3AED' }}>Tube</span>
      </span>
    </Link>
  );
}

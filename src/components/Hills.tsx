export function Hills({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1392 300" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9F0E1" />
          <stop offset="1" stopColor="#C9DABA" />
        </linearGradient>
        <linearGradient id="shadeG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1D2E12" stopOpacity="0.05" />
          <stop offset="1" stopColor="#1D2E12" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect width="1392" height="300" fill="url(#skyG)" />
      <path d="M0 230 C200 170 330 150 480 190 S760 120 920 160 S1250 130 1392 190 L1392 300 L0 300 Z" fill="#B5CBA0" />
      <path d="M0 262 C220 212 380 232 560 247 S900 202 1100 232 S1330 217 1392 242 L1392 300 L0 300 Z" fill="#8DAE74" />
      <path d="M0 292 C300 252 520 287 760 277 S1180 252 1392 282 L1392 300 L0 300 Z" fill="#5E8B47" />
      <rect width="1392" height="300" fill="url(#shadeG)" />
    </svg>
  )
}

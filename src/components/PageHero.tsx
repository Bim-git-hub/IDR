type Variant = 'finance' | 'planning' | 'nature' | 'document' | 'calendar' | 'market' | 'analytics' | 'workspace' | 'office' | 'wallet'

interface PageHeroProps {
  eyebrow: string
  title: string
  description: string
  variant: Variant
  children?: React.ReactNode
}

function Illustration({ variant }: { variant: Variant }) {
  const common = 'absolute inset-0 w-full h-full'
  const defs = (
    <defs>
      <linearGradient id={`bg-${variant}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2e4a12" />
        <stop offset="100%" stopColor="#1a2e0a" />
      </linearGradient>
      <linearGradient id={`glow-${variant}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8dae74" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#8dae74" stopOpacity="0" />
      </linearGradient>
    </defs>
  )

  const shapes: Record<Variant, React.ReactNode> = {
    finance: <g><circle cx="78%" cy="30%" r="120" fill="url(#glow-finance)" /><path d="M0 180 C180 140 320 160 520 120 S820 60 1200 100 L1200 220 L0 220Z" fill="#4f7a3a" opacity=".25" /><path d="M700 170 L760 130 L820 145 L880 100 L940 115 L1000 70" fill="none" stroke="#9dd07a" strokeWidth="3" strokeLinecap="round" /><circle cx="1000" cy="70" r="5" fill="#e8c14a" /></g>,
    planning: <g><circle cx="82%" cy="25%" r="130" fill="url(#glow-planning)" /><rect x="720" y="60" width="180" height="120" rx="12" fill="#fff" opacity=".06" stroke="#fff" strokeOpacity=".12" /><path d="M750 95h120M750 115h90M750 135h110" stroke="#9dd07a" strokeWidth="3" strokeLinecap="round" opacity=".5" /><path d="M0 190 C200 160 400 170 600 140 S900 120 1200 150 L1200 220 L0 220Z" fill="#4f7a3a" opacity=".2" /></g>,
    nature: <g><circle cx="75%" cy="20%" r="140" fill="url(#glow-nature)" /><path d="M0 170 C150 130 280 150 420 120 S650 80 800 110 S1050 70 1200 100 L1200 220 L0 220Z" fill="#8dae74" opacity=".2" /><path d="M0 190 C200 160 350 175 550 150 S850 130 1200 160 L1200 220 L0 220Z" fill="#4f7a3a" opacity=".25" /><circle cx="920" cy="55" r="28" fill="#e8c14a" opacity=".25" /></g>,
    document: <g><circle cx="80%" cy="30%" r="120" fill="url(#glow-document)" /><rect x="760" y="45" width="110" height="140" rx="10" fill="#fff" opacity=".07" stroke="#fff" strokeOpacity=".1" /><path d="M780 75h70M780 95h55M780 115h65M780 140h40" stroke="#9dd07a" strokeWidth="3" strokeLinecap="round" opacity=".45" /><path d="M0 185 C250 155 500 170 750 145 S1000 130 1200 155 L1200 220 L0 220Z" fill="#4f7a3a" opacity=".2" /></g>,
    calendar: <g><circle cx="78%" cy="28%" r="130" fill="url(#glow-calendar)" /><rect x="740" y="50" width="140" height="130" rx="12" fill="#fff" opacity=".07" stroke="#fff" strokeOpacity=".1" /><path d="M740 80h140" stroke="#fff" strokeOpacity=".15" strokeWidth="2" /><g fill="#9dd07a" opacity=".5"><circle cx="770" cy="105" r="6" /><circle cx="810" cy="105" r="6" /><circle cx="850" cy="130" r="6" /></g><path d="M0 190 C220 160 450 175 700 145 S1000 130 1200 155 L1200 220 L0 220Z" fill="#4f7a3a" opacity=".2" /></g>,
    market: <g><circle cx="80%" cy="25%" r="130" fill="url(#glow-market)" /><path d="M680 160 L730 140 L770 150 L820 110 L870 125 L920 85 L970 95 L1020 60" fill="none" stroke="#9dd07a" strokeWidth="3" strokeLinecap="round" opacity=".6" /><path d="M680 160 L730 140 L770 150 L820 110 L870 125 L920 85 L970 95 L1020 60 L1020 180 L680 180Z" fill="#9dd07a" opacity=".08" /><path d="M0 190 C200 165 400 175 600 150 S900 135 1200 160 L1200 220 L0 220Z" fill="#4f7a3a" opacity=".2" /></g>,
    analytics: <g><circle cx="82%" cy="28%" r="130" fill="url(#glow-analytics)" /><g fill="#9dd07a" opacity=".35"><rect x="720" y="110" width="24" height="60" rx="4" /><rect x="760" y="85" width="24" height="85" rx="4" /><rect x="800" y="100" width="24" height="70" rx="4" /><rect x="840" y="70" width="24" height="100" rx="4" /><rect x="880" y="90" width="24" height="80" rx="4" /></g><path d="M0 190 C250 160 500 175 750 150 S1000 135 1200 160 L1200 220 L0 220Z" fill="#4f7a3a" opacity=".2" /></g>,
    workspace: <g><circle cx="78%" cy="30%" r="130" fill="url(#glow-workspace)" /><circle cx="850" cy="90" r="45" fill="none" stroke="#9dd07a" strokeWidth="2" opacity=".25" /><circle cx="850" cy="90" r="25" fill="none" stroke="#9dd07a" strokeWidth="2" opacity=".35" /><circle cx="850" cy="90" r="5" fill="#e8c14a" opacity=".6" /><path d="M0 190 C200 160 400 175 600 150 S900 130 1200 155 L1200 220 L0 220Z" fill="#4f7a3a" opacity=".2" /></g>,
    office: <g><circle cx="80%" cy="25%" r="140" fill="url(#glow-office)" /><rect x="730" y="70" width="60" height="45" rx="6" fill="#fff" opacity=".06" stroke="#fff" strokeOpacity=".1" /><rect x="800" y="55" width="80" height="60" rx="6" fill="#fff" opacity=".08" stroke="#fff" strokeOpacity=".12" /><path d="M0 185 C220 155 450 170 700 145 S1000 130 1200 155 L1200 220 L0 220Z" fill="#4f7a3a" opacity=".2" /></g>,
    wallet: <g><circle cx="78%" cy="28%" r="130" fill="url(#glow-wallet)" /><rect x="760" y="75" width="130" height="85" rx="14" fill="#fff" opacity=".08" stroke="#fff" strokeOpacity=".12" /><rect x="760" y="75" width="130" height="28" rx="14" fill="#fff" opacity=".05" /><circle cx="865" cy="130" r="12" fill="#e8c14a" opacity=".35" /><path d="M0 190 C200 160 400 175 600 150 S900 130 1200 155 L1200 220 L0 220Z" fill="#4f7a3a" opacity=".2" /></g>,
  }

  return (
    <svg viewBox="0 0 1200 220" preserveAspectRatio="xMidYMid slice" className={common} aria-hidden="true">
      {defs}
      <rect width="1200" height="220" fill={`url(#bg-${variant})`} />
      {shapes[variant]}
      <rect width="1200" height="220" fill="url(#shade)" opacity="0" />
    </svg>
  )
}

export function PageHero({ eyebrow, title, description, variant, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-[#2e4a12]/30 min-h-[168px] anim-fade-up">
      <Illustration variant={variant} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e0a]/40 via-transparent to-transparent" />
      <div className="relative px-6 py-7 md:px-8 md:py-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-white/85">{eyebrow}</span>
          <h1 className="mt-3 text-[32px] md:text-[40px] font-bold tracking-tight display text-white leading-[1.05]">{title}</h1>
          <p className="mt-2 text-sm text-white/75 max-w-2xl">{description}</p>
        </div>
        {children && <div className="shrink-0 flex items-center gap-2">{children}</div>}
      </div>
    </section>
  )
}

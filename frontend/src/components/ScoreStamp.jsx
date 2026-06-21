const VERDICT_STYLES = {
  strong_fit: {
    label: "STRONG FIT",
    ring: "from-emerald-500 to-emerald-400",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    badge: "bg-emerald-500",
    shadow: "shadow-emerald-100",
  },
  possible_fit: {
    label: "POSSIBLE FIT",
    ring: "from-amber-500 to-amber-400",
    bg: "bg-amber-50",
    text: "text-amber-700",
    badge: "bg-amber-500",
    shadow: "shadow-amber-100",
  },
  weak_fit: {
    label: "WEAK FIT",
    ring: "from-rose-500 to-rose-400",
    bg: "bg-rose-50",
    text: "text-rose-700",
    badge: "bg-rose-500",
    shadow: "shadow-rose-100",
  },
};

export default function ScoreStamp({ score, verdict }) {
  const style = VERDICT_STYLES[verdict] || VERDICT_STYLES.possible_fit;
  const pathId = `arc-${verdict}`;
  
  // Calculate percentage for progress ring
  const percentage = Math.min(Math.max(score || 0, 0), 100);
  const circumference = 2 * Math.PI * 70; // r=70
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* Animated glow effect */}
      <div className={`absolute -inset-4 rounded-full ${style.bg} opacity-50 blur-2xl animate-pulse`}></div>
      
      {/* Main SVG */}
      <div className="relative transform transition-all duration-500 hover:scale-105 hover:rotate-1">
        <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-xl" role="img" aria-label={`Match score ${score} out of 100, ${style.label}`}>
          <defs>
            <path id={pathId} d="M 30 100 A 70 70 0 1 1 170 100" fill="none" />
            
            {/* Gradient definitions */}
            <linearGradient id={`gradient-${verdict}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={style.ring.split(' ')[1]} />
              <stop offset="100%" className={style.ring.split(' ')[2]} />
            </linearGradient>
            
            <filter id={`shadow-${verdict}`}>
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Outer glow ring */}
          <circle 
            cx="100" 
            cy="100" 
            r="92" 
            className={`${style.bg} transition-colors duration-300`} 
            filter={`url(#shadow-${verdict})`}
          />
          
          {/* Progress ring background */}
          <circle
            cx="100"
            cy="100"
            r="78"
            className="fill-white stroke-gray-200"
            strokeWidth="6"
          />
          
          {/* Progress ring */}
          <circle
            cx="100"
            cy="100"
            r="78"
            className={`fill-none transition-all duration-1000 ease-out`}
            stroke={`url(#gradient-${verdict})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 100 100)"
          />

          {/* Decorative dashed ring */}
          <circle
            cx="100"
            cy="100"
            r="68"
            className="fill-none stroke-gray-200/50"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />

          {/* Verdict label on arc */}
          <text 
            fontSize="11" 
            fontFamily="var(--font-mono)" 
            fontWeight="700" 
            letterSpacing="3" 
            className={style.text}
            fill="currentColor"
          >
            <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
              {style.label}
            </textPath>
          </text>

          {/* Score number */}
          <text
            x="100"
            y="108"
            textAnchor="middle"
            fontSize="52"
            fontFamily="var(--font-display)"
            fontWeight="800"
            className="text-gray-800"
            fill="currentColor"
          >
            {score}
          </text>
          
          {/* "/100" label */}
          <text
            x="100"
            y="132"
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-mono)"
            className="text-gray-400"
            fill="currentColor"
          >
            / 100
          </text>
          
          {/* Small decorative dot */}
          <circle cx="100" cy="160" r="3" className={style.badge} fill="currentColor" />
        </svg>
        
        {/* Floating badge */}
        <div className={`absolute -top-1 -right-1 rounded-full ${style.badge} px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg animate-bounce`}>
          {verdict === 'strong_fit' ? '⭐' : verdict === 'possible_fit' ? '💡' : '📈'}
        </div>
      </div>
      
      {/* Score breakdown hint */}
      <div className="text-center mt-1">
        <div className={`inline-flex items-center gap-2 rounded-full ${style.bg} px-4 py-1.5 shadow-sm ${style.text}`}>
          <span className={`h-2 w-2 rounded-full ${style.badge}`}></span>
          <span className="text-xs font-medium">
            {percentage >= 80 ? 'Excellent match' : percentage >= 60 ? 'Good potential' : 'Needs improvement'}
          </span>
        </div>
      </div>
    </div>
  );
}
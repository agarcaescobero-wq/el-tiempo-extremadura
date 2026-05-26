import { CityWeatherData, getWeatherDesc } from "../types";
import { WeatherIcon } from "./WeatherIcon";
import { motion } from "motion/react";

interface CityCardProps {
  cityName: string;
  data: CityWeatherData;
}

// Custom styling and folklore data for each municipality
const cityMetadataMap: Record<string, {
  bg: string;
  accent: string;
  badge: string;
  tag: string;
  altitude: string;
  gradientBg: string;
  tint: string;
}> = {
  "Cáceres": {
    bg: "bg-radial from-stone-50 to-amber-50/20 border-stone-200/90 shadow-stone-100/50",
    accent: "text-amber-600",
    badge: "bg-amber-100/70 text-stone-800 border-amber-200/30",
    tag: "Plaza Mayor • Casco Antiguo",
    altitude: "459m",
    gradientBg: "from-amber-500/5 to-stone-500/5",
    tint: "amber",
  },
  "Badajoz": {
    bg: "bg-radial from-zinc-50 to-emerald-50/20 border-emerald-100 shadow-emerald-55/30",
    accent: "text-teal-600",
    badge: "bg-emerald-100/70 text-emerald-950 border-emerald-250/30",
    tag: "Plaza Alta • Vegas del Guadiana",
    altitude: "186m",
    gradientBg: "from-teal-500/5 to-emerald-500/5",
    tint: "emerald",
  },
  "Coria": {
    bg: "bg-radial from-sky-50 to-blue-50/20 border-blue-200/50 shadow-blue-50/30",
    accent: "text-blue-600",
    badge: "bg-blue-100/60 text-blue-900 border-blue-200/30",
    tag: "Catedral • Río Alagón",
    altitude: "280m",
    gradientBg: "from-blue-500/5 to-sky-500/5",
    tint: "blue",
  },
  "Plasencia": {
    bg: "bg-radial from-slate-50 to-indigo-50/20 border-indigo-200/50 shadow-indigo-150/30",
    accent: "text-indigo-600",
    badge: "bg-indigo-100/60 text-indigo-900 border-indigo-200/30",
    tag: "Acueducto • Valle del Jerte",
    altitude: "415m",
    gradientBg: "from-indigo-500/5 to-slate-500/5",
    tint: "indigo",
  },
  "Navalmoral de la Mata": {
    bg: "bg-radial from-violet-50 to-purple-50/20 border-purple-200/50 shadow-purple-50/30",
    accent: "text-purple-600",
    badge: "bg-purple-100/60 text-purple-900 border-purple-200/30",
    tag: "Vegas del Tajo • Campo Arañuelo",
    altitude: "291m",
    gradientBg: "from-purple-500/5 to-violet-500/5",
    tint: "purple",
  },
  "Valencia de Alcántara": {
    bg: "bg-radial from-orange-50 to-amber-50/15 border-orange-200/50 shadow-orange-50/30",
    accent: "text-orange-600",
    badge: "bg-orange-100/60 text-orange-900 border-orange-200/30",
    tag: "Dólmenes • Raya Portuguesa",
    altitude: "440m",
    gradientBg: "from-orange-500/5 to-amber-500/5",
    tint: "orange",
  },
  "Trujillo": {
    bg: "bg-radial from-rose-50 to-orange-50/15 border-rose-200/50 shadow-rose-50/30",
    accent: "text-rose-600",
    badge: "bg-rose-100/60 text-rose-950 border-rose-200/30",
    tag: "Plaza Mayor • Castillo altivo",
    altitude: "564m",
    gradientBg: "from-rose-500/5 to-orange-500/5",
    tint: "rose",
  },
  "Zorita": {
    bg: "bg-radial from-amber-50/40 to-yellow-50/15 border-yellow-200/50 shadow-yellow-50/30",
    accent: "text-amber-700",
    badge: "bg-yellow-100/70 text-amber-950 border-yellow-200/30",
    tag: "Sierra de Zorita",
    altitude: "424m",
    gradientBg: "from-yellow-500/5 to-amber-500/5",
    tint: "yellow",
  },
  "Jerez de los Caballeros": {
    bg: "bg-radial from-red-50 to-amber-50/15 border-red-200/50 shadow-red-50/20",
    accent: "text-red-600",
    badge: "bg-red-100/60 text-red-950 border-red-200/30",
    tag: "Torres Templarias • Sierra Suroeste",
    altitude: "506m",
    gradientBg: "from-red-500/5 to-amber-500/5",
    tint: "red",
  },
  "Castuera": {
    bg: "bg-radial from-amber-50/30 to-zinc-50 border-amber-200/40 shadow-stone-50/20",
    accent: "text-amber-800",
    badge: "bg-amber-100/50 text-stone-900 border-amber-200/30",
    tag: "La Serena • Cuna del Turrón",
    altitude: "186m",
    gradientBg: "from-amber-600/5 to-stone-500/5",
    tint: "amber",
  },
  "Mérida": {
    bg: "bg-radial from-teal-50/40 to-slate-50 border-teal-200/50 shadow-teal-50/25",
    accent: "text-teal-700",
    badge: "bg-teal-100/60 text-teal-950 border-teal-200/30",
    tag: "Teatro Romano • Río Guadiana",
    altitude: "217m",
    gradientBg: "from-teal-600/5 to-slate-500/5",
    tint: "emerald",
  },
  "Don Benito": {
    bg: "bg-radial from-cyan-50 to-slate-50 border-cyan-200/50 shadow-cyan-50/25",
    accent: "text-cyan-700",
    badge: "bg-cyan-100/60 text-cyan-950 border-cyan-200/30",
    tag: "Las Vegas Altas • Comercio activo",
    altitude: "264m",
    gradientBg: "from-cyan-600/5 to-slate-500/5",
    tint: "blue",
  },
  "Herrera del Duque": {
    bg: "bg-radial from-emerald-50/30 to-neutral-50 border-emerald-200/50 shadow-emerald-50/20",
    accent: "text-emerald-700",
    badge: "bg-emerald-100/60 text-emerald-950 border-emerald-200/30",
    tag: "Valdecaballeros • La Siberia Extremeña",
    altitude: "468m",
    gradientBg: "from-emerald-600/5 to-neutral-500/5",
    tint: "emerald",
  },
  "Zafra": {
    bg: "bg-radial from-pink-50/45 to-zinc-50 border-pink-200/50 shadow-pink-50/20",
    accent: "text-pink-700",
    badge: "bg-pink-100/60 text-pink-950 border-pink-200/30",
    tag: "Sevilla la Chica • Plaza Grande",
    altitude: "508m",
    gradientBg: "from-pink-600/5 to-zinc-500/5",
    tint: "rose",
  },
  "Azuaga": {
    bg: "bg-radial from-fuchsia-50/30 to-slate-100 border-fuchsia-200/40 shadow-stone-50/15",
    accent: "text-fuchsia-700",
    badge: "bg-fuchsia-100/60 text-fuchsia-950 border-fuchsia-200/30",
    tag: "Campiña Sur • Sierra Morena",
    altitude: "593m",
    gradientBg: "from-fuchsia-600/5 to-slate-500/5",
    tint: "purple",
  }
};

export function CityCard({ cityName, data }: CityCardProps) {
  const current = data.current;
  const daily = data.daily;

  const isHot = current.temperature_2m > 34.9;

  const originalTheme = cityMetadataMap[cityName] || {
    bg: "bg-white border-stone-200 shadow-sm",
    accent: "text-stone-600",
    gradientBg: "from-stone-500/5 to-stone-200/5",
  };

  const cardTheme = isHot
    ? {
        bg: "bg-radial from-rose-50 to-red-50/30 border-red-300 shadow-red-50/30 ring-1 ring-red-500/5",
        accent: "text-red-600",
        gradientBg: "from-red-500/5 to-orange-500/5",
      }
    : originalTheme;

  const todayMin = daily?.temperature_2m_min?.[0] ?? 0;
  const todayMax = daily?.temperature_2m_max?.[0] ?? 0;

  // Let's define visual formatting for the predicted maximum temperature
  const isMaxTempHot = todayMax > 34.9;
  const isMaxTempWarm = todayMax >= 29 && todayMax <= 34.9;

  let maxTempColorClass = "text-stone-700";
  let maxTempBgClass = "bg-stone-50/50 border border-stone-200/40";

  if (isMaxTempHot) {
    maxTempColorClass = "text-red-600 font-extrabold";
    maxTempBgClass = "bg-red-50/70 border border-red-200/50 px-1.5 py-0.5 rounded";
  } else if (isMaxTempWarm) {
    maxTempColorClass = "text-amber-600 font-extrabold";
    maxTempBgClass = "bg-amber-50/70 border border-amber-200/50 px-1.5 py-0.5 rounded";
  } else {
    maxTempBgClass = "bg-stone-50/50 border border-stone-100 px-1 py-0.5 rounded";
  }

  const cleanId = cityName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");

  return (
    <motion.div
      id={`city-card-${cleanId}`}
      whileHover={{ y: -1.5, transition: { duration: 0.12 } }}
      className={`relative overflow-hidden rounded-xl border p-3 ${cardTheme.bg} shadow-xs transition-all duration-150`}
    >
      {/* Red dot warning for extremely hot conditions */}
      {(isHot || isMaxTempHot) && (
        <span className="absolute top-2 right-2 flex h-2 w-2 z-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}

      {/* Mini background corner gradient */}
      <div className={`absolute top-0 right-0 -mt-14 -mr-14 h-24 w-24 rounded-full bg-gradient-to-br ${cardTheme.gradientBg} blur-lg opacity-70`} />

      <div className="relative flex flex-col justify-between h-full min-w-0">
        {/* Name and alert indicator */}
        <div className="min-w-0">
          <span className="flex items-center gap-1 text-[8.5px] font-bold tracking-widest uppercase opacity-65 text-stone-400">
            <WeatherIcon name={isHot ? "Flame" : "MapPin"} size={8} className={`${cardTheme.accent}`} />
            {isHot ? "AVISO CALOR" : "OVZ EXTREMADURA"}
          </span>
          <h2 className="font-display text-sm font-black tracking-tight text-stone-850 truncate mt-0.5" title={cityName}>
            {cityName}
          </h2>
        </div>

        {/* Temperature Area: Actual & Máx Prevista side-by-side */}
        <div className="my-2 flex items-center justify-between border-t border-b border-stone-100/60 py-2 gap-1.5 min-w-0">
          {/* Actual Column */}
          <div className="flex flex-col min-w-0">
            <span className="text-[7.5px] font-bold text-stone-400 uppercase tracking-widest font-mono whitespace-nowrap">Actual</span>
            <span className={`font-display text-sm font-extrabold tracking-tight ${isHot ? "text-red-700" : "text-stone-900"} whitespace-nowrap`}>
              {current.temperature_2m.toFixed(1)}
              <span className="align-top font-sans text-[8.5px] font-light text-stone-400 ml-0.5">°C</span>
            </span>
          </div>

          {/* Max Prevista Column (Enlarged) */}
          <div className="flex flex-col items-end text-right min-w-0">
            <span className="text-[7.5px] font-bold text-stone-400 uppercase tracking-widest font-mono whitespace-nowrap">Máx Prevista</span>
            <span className={`font-display text-base leading-none mt-0.5 whitespace-nowrap tracking-tight ${maxTempBgClass} ${maxTempColorClass}`}>
              {todayMax.toFixed(1)}
              <span className="align-baseline font-sans text-[9px] font-normal ml-0.5">°C</span>
            </span>
          </div>
        </div>

        {/* Minimum Temperature Block */}
        <div className="flex items-center justify-between text-[10px] text-stone-500 pt-0.5 select-none">
          <span className="text-[7.5px] font-mono uppercase tracking-wider text-stone-400">Temp Mínima</span>
          <span className="font-semibold text-stone-600 font-mono text-[11px] leading-none">
            {todayMin.toFixed(0)}°C
          </span>
        </div>
      </div>
    </motion.div>
  );
}

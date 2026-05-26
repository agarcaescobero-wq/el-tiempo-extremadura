export interface WeatherCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  time: string;
}

export interface WeatherDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  uv_index_max?: number[];
}

export interface CityWeatherData {
  current: WeatherCurrent;
  daily: WeatherDaily;
}

export interface WeatherApiResponse {
  success: boolean;
  data: {
    caceres: CityWeatherData;
    badajoz: CityWeatherData;
    coria: CityWeatherData;
    plasencia: CityWeatherData;
    navalmoral: CityWeatherData;
    valenciaAlcantara: CityWeatherData;
    trujillo: CityWeatherData;
    zorita: CityWeatherData;
    jerez: CityWeatherData;
    castuera: CityWeatherData;
    merida: CityWeatherData;
    donBenito: CityWeatherData;
    herrera: CityWeatherData;
    zafra: CityWeatherData;
    azuaga: CityWeatherData;
  };
}

export interface WeatherTextDescription {
  label: string;
  iconName: "Sun" | "CloudSun" | "CloudFog" | "CloudDrizzle" | "CloudRain" | "Snowflake" | "CloudRainWind" | "CloudLightning" | "Cloud";
  bgClass: string;
  textClass: string;
}

export function getWeatherDesc(code: number): WeatherTextDescription {
  if (code === 0) {
    return {
      label: "Cielo Despejado",
      iconName: "Sun",
      bgClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      textClass: "text-amber-500",
    };
  }
  if (code === 1 || code === 2 || code === 3) {
    return {
      label: "Nubes y Claros",
      iconName: "CloudSun",
      bgClass: "bg-sky-500/10 text-sky-500 border-sky-500/20",
      textClass: "text-sky-500",
    };
  }
  if (code === 45 || code === 48) {
    return {
      label: "Niebla Densa",
      iconName: "CloudFog",
      bgClass: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      textClass: "text-zinc-400",
    };
  }
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    return {
      label: "Llovizna Ligera",
      iconName: "CloudDrizzle",
      bgClass: "bg-blue-400/10 text-blue-400 border-blue-400/20",
      textClass: "text-blue-400",
    };
  }
  if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67) {
    return {
      label: "Lluvia Intensa",
      iconName: "CloudRain",
      bgClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      textClass: "text-blue-500",
    };
  }
  if (code === 71 || code === 73 || code === 75 || code === 77) {
    return {
      label: "Niveando",
      iconName: "Snowflake",
      bgClass: "bg-teal-400/10 text-teal-400 border-teal-400/20",
      textClass: "text-teal-400",
    };
  }
  if (code === 80 || code === 81 || code === 82) {
    return {
      label: "Chubascos",
      iconName: "CloudRainWind",
      bgClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      textClass: "text-indigo-400",
    };
  }
  if (code === 95 || code === 96 || code === 99) {
    return {
      label: "Tormenta",
      iconName: "CloudLightning",
      bgClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      textClass: "text-purple-400",
    };
  }
  return {
    label: "Nublado",
    iconName: "Cloud",
    bgClass: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
    textClass: "text-neutral-400",
  };
}

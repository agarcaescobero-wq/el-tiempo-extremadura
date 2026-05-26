import {
  Sun,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudRainWind,
  CloudLightning,
  Cloud,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Sparkles,
  Navigation,
  RotateCw,
  MapPin,
  TrendingUp,
  Info,
  ChevronRight,
  TrendingDown,
  Calendar,
  AlertCircle,
  Flame
} from "lucide-react";

const iconsMap = {
  Sun,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudRainWind,
  CloudLightning,
  Cloud,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Sparkles,
  Navigation,
  RotateCw,
  MapPin,
  TrendingUp,
  Info,
  ChevronRight,
  TrendingDown,
  Calendar,
  AlertCircle,
  Flame
};

export type WeatherIconType = keyof typeof iconsMap;

interface WeatherIconProps {
  name: WeatherIconType;
  className?: string;
  size?: number;
}

export function WeatherIcon({ name, className = "", size = 24 }: WeatherIconProps) {
  const IconComponent = iconsMap[name] || Cloud;
  return <IconComponent className={className} size={size} />;
}

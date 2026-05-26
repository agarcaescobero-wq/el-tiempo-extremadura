import { useState, useEffect } from "react";
import { CityCard } from "./components/CityCard";
import { WeatherIcon } from "./components/WeatherIcon";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [data, setData] = useState<WeatherApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localTime, setLocalTime] = useState("");
  
  // Custom interactive features
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "tempAsc" | "tempDesc">("name");

  // Live timer for local digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather for all municipalities directly from Open-Meteo
  const fetchWeather = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    try {
      const cities = [
        { key: "caceres", name: "Cáceres", lat: 39.4764, lon: -6.3722 },
        { key: "badajoz", name: "Badajoz", lat: 38.8778, lon: -6.9706 },
        { key: "coria", name: "Coria", lat: 39.9831, lon: -6.5361 },
        { key: "plasencia", name: "Plasencia", lat: 40.0302, lon: -6.0894 },
        { key: "navalmoral", name: "Navalmoral de la Mata", lat: 39.8916, lon: -5.5414 },
        { key: "valenciaAlcantara", name: "Valencia de Alcántara", lat: 39.4128, lon: -7.2435 },
        { key: "trujillo", name: "Trujillo", lat: 39.4597, lon: -5.8812 },
        { key: "zorita", name: "Zorita", lat: 39.2847, lon: -5.6991 },
        { key: "jerez", name: "Jerez de los Caballeros", lat: 38.3204, lon: -6.7725 },
        { key: "castuera", name: "Castuera", lat: 38.7231, lon: -5.5435 },
        { key: "merida", name: "Mérida", lat: 38.9161, lon: -6.3437 },
        { key: "donBenito", name: "Don Benito", lat: 38.9554, lon: -5.8614 },
        { key: "herrera", name: "Herrera del Duque", lat: 39.1681, lon: -5.0506 },
        { key: "zafra", name: "Zafra", lat: 38.4233, lon: -6.4172 },
        { key: "azuaga", name: "Azuaga", lat: 38.2588, lon: -5.6775 },
      ];
      const lats = cities.map(c => c.lat).join(",");
      const lons = cities.map(c => c.lon).join(",");
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max,weather_code&timezone=Europe/Madrid&forecast_days=7`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("No se pudo obtener la información meteorológica. Inténtalo de nuevo.");
      }
      const json = await res.json();
      const results = Array.isArray(json) ? json : [json];
      const weatherData: Record<string, any> = {};
      cities.forEach((city, index) => {
        weatherData[city.key] = results[index];
      });
      setData(weatherData as any);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al conectar con la estación meteorológica.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  // Map data to consumable list of items
  const getCityList = () => {
    if (!data) return [];
    return [
      { name: "Cáceres", data: data.caceres },
      { name: "Badajoz", data: data.badajoz },
      { name: "Coria", data: data.coria },
      { name: "Plasencia", data: data.plasencia },
      { name: "Navalmoral de la Mata", data: data.navalmoral },
      { name: "Valencia de Alcántara", data: data.valenciaAlcantara },
      { name: "Trujillo", data: data.trujillo },
      { name: "Zorita", data: data.zorita },
      { name: "Jerez de los Caballeros", data: data.jerez },
      { name: "Castuera", data: data.castuera },
      { name: "Mérida", data: data.merida },
      { name: "Don Benito", data: data.donBenito },
      { name: "Herrera del Duque", data: data.herrera },
      { name: "Zafra", data: data.zafra },
      { name: "Azuaga", data: data.azuaga },
    ];
  };

  // Filter & sort cities
  const filteredAndSortedCities = getCityList()
    .filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name, "es");
      }
      if (sortBy === "tempAsc") {
        return a.data.current.temperature_2m - b.data.current.temperature_2m;
      }
      if (sortBy === "tempDesc") {
        return b.data.current.temperature_2m - a.data.current.temperature_2m;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-stone-100/40 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Structural constraint to prevent layout blow-up on wide displays */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        {/* Navigation / Metric Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200/50 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 px-1.5 rounded-md bg-emerald-600 text-white font-mono font-bold text-[9px] tracking-wider">OVZ</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 font-mono">Oficinas Veterinarias de Zona de Extremadura</span>
            </div>
            <h1 className="font-display text-2xl font-black tracking-tight text-stone-900 mt-1.5 sm:text-3xl">
              Temperaturas en las distintas OVZ de Extremadura
            </h1>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl">
              Termómetro oficial en tiempo real de los 15 municipios sede de las Oficinas Veterinarias de Zona (OVZ) de la región.
            </p>
          </div>

          <div className="flex items-center gap-3.5 ml-auto md:ml-0">
            {/* Clock badge */}
            <div className="flex flex-col items-end px-3 py-1.5 bg-white rounded-xl border border-stone-200/60 shadow-xs">
              <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Hora Local</span>
              <span className="font-mono text-xs font-bold text-stone-800 tracking-wide mt-0.5">{localTime || "12:00:00"}</span>
            </div>

            {/* General Refresh Button */}
            <button
              id="btn-refresh-all"
              onClick={() => fetchWeather()}
              disabled={loading}
              className="py-2 px-3.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 active:scale-97 text-stone-700 hover:text-stone-900 font-bold text-xs shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <WeatherIcon name="RotateCw" size={11} className={loading ? "animate-spin text-emerald-500" : ""} />
              Actualizar
            </button>
          </div>
        </header>

        {/* Loading Screen */}
        {loading && !data && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="relative flex h-12 w-12 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75" />
              <span className="relative rounded-full h-9 w-9 bg-white border border-stone-200 shadow-xs flex items-center justify-center">
                <WeatherIcon name="RotateCw" className="animate-spin text-emerald-600" size={15} />
              </span>
            </span>
            <h3 className="font-display text-base font-bold text-stone-900 mt-3 font-sans">Sintonizando municipios extremeños</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-xs leading-relaxed">
              Descargando lecturas climatológicas locales en tiempo real...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 flex flex-col items-center text-center max-w-md mx-auto my-12 shadow-xs">
            <span className="p-2.5 bg-rose-100 rounded-xl text-rose-600 mb-3">
              <WeatherIcon name="AlertCircle" size={20} />
            </span>
            <h3 className="font-display text-base font-bold text-stone-900">Estación meteorológica sin respuesta</h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              No se ha podido conectar con el servicio climatológico central.
            </p>
            <div className="bg-white/80 border border-rose-100 rounded-lg p-2.5 text-[10px] font-mono text-rose-700 my-3 max-w-full truncate">
              {error}
            </div>
            <button
              onClick={() => fetchWeather()}
              className="py-1.5 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Action Controls search and sorting */}
        {data && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Search filter input */}
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Buscar por sede de OVZ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-stone-800 placeholder-stone-400 text-xs border border-stone-200/95 rounded-xl py-2 pl-3.5 pr-10 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-xs"
              />
              <span className="absolute right-3 top-2.5 text-stone-400">
                <WeatherIcon name="MapPin" size={13} />
              </span>
            </div>

            {/* Sorting controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">Ordenar por:</span>
              <div className="inline-flex rounded-lg border border-stone-200/90 bg-white p-0.5 shadow-xs">
                <button
                  onClick={() => setSortBy("name")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    sortBy === "name"
                      ? "bg-stone-100 text-stone-900"
                      : "text-stone-500 hover:text-stone-850"
                  }`}
                >
                  Sede (A-Z)
                </button>
                <button
                  onClick={() => setSortBy("tempDesc")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    sortBy === "tempDesc"
                      ? "bg-rose-50 text-rose-700 border border-rose-100/20"
                      : "text-stone-500 hover:text-stone-850"
                  }`}
                  title="Más cálidas primero"
                >
                  T. Máxima
                </button>
                <button
                  onClick={() => setSortBy("tempAsc")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    sortBy === "tempAsc"
                      ? "bg-sky-50 text-sky-700 border border-sky-100/20"
                      : "text-stone-500 hover:text-stone-855"
                  }`}
                  title="Más frescas primero"
                >
                  T. Mínima
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid display layout (Denser compact 4-column layout) */}
        {data && (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedCities.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border border-stone-200 p-10 text-center"
                >
                  <span className="p-2.5 bg-stone-100 rounded-full inline-block text-stone-405 mb-2.5">
                    <WeatherIcon name="Info" size={16} />
                  </span>
                  <h4 className="font-display font-bold text-stone-800 text-sm">No se encontraron oficinas veterinarias</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">Ninguno de nuestros municipios extremeños con sede OVZ coincide con "{searchQuery}"</p>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
                >
                  {filteredAndSortedCities.map((city) => (
                    <motion.div
                      layout
                      key={city.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CityCard cityName={city.name} data={city.data} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Minimal visual elegant footer */}
        <footer className="mt-12 pt-6 border-t border-stone-200/50 text-center flex flex-col items-center gap-1">
          <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest">
            REGISTRO DE OVZ EXTREMADURA • TERMÓMETRO DINÁMICO
          </span>
          <p className="text-[10px] text-stone-400 max-w-md">
            Información ambiental oficial de libre uso extraída de la API de Open-Meteo. Actualización inmediata.
          </p>
        </footer>
      </div>
    </div>
  );
}

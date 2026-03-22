"use client";

import { useState, useEffect } from "react";
import { addCrop, CropData } from "../../../services/api/crops";
import { FarmInfo } from "../../../services/api/users";
import PlotGrid from "./PlotGrid";

const CROP_REQUIREMENTS: Record<string, {n: string, p: string, k: string, temp: string, hum: string, ph: string}> = {
    "Wheat": { n: "60-100", p: "30-60", k: "30-60", temp: "15-25", hum: "40-60", ph: "6.0-7.5" },
    "Corn": { n: "100-150", p: "40-80", k: "60-100", temp: "20-30", hum: "50-70", ph: "5.8-7.0" },
    "Rice": { n: "80-120", p: "40-60", k: "40-60", temp: "20-35", hum: "60-80", ph: "5.5-6.5" },
    "Soybeans": { n: "20-40", p: "40-60", k: "60-80", temp: "20-30", hum: "50-70", ph: "6.0-7.0" },
    "Potatoes": { n: "80-120", p: "60-100", k: "100-150", temp: "15-20", hum: "50-70", ph: "5.0-6.0" },
    "Cotton": { n: "100-140", p: "40-60", k: "60-80", temp: "25-35", hum: "40-60", ph: "5.8-8.0" }
};

interface AddCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  farm: FarmInfo | null;
  crops: CropData[];
}

export default function AddCropModal({ isOpen, onClose, onSuccess, farm, crops }: AddCropModalProps) {
  const [formData, setFormData] = useState({
    crop_type: "Wheat",
    nitrogen_n: 0,
    phosphorus_p: 0,
    potassium_k: 0,
    temperature: 0,
    humidity: 0,
    rainfall: 0,
    ph_level: 7.0,
    plot_index: 0,
  });

  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && farm) {
      const occupiedPlots = new Set(crops.filter(c => c.is_active).map(c => c.plot_index));
      let firstAvailable = 0;
      for (let i = 1; i <= farm.total_plots; i++) {
        if (!occupiedPlots.has(i)) {
          firstAvailable = i;
          break;
        }
      }
      setFormData(prev => ({ ...prev, plot_index: firstAvailable }));
    }
  }, [isOpen, farm, crops]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "crop_type" ? value : Number(value)
    }));
  };

  const fetchWeather = () => {
    setWeatherLoading(true);
    setError("");

    if (typeof window !== "undefined" && !window.isSecureContext && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      setError("Geolocation requires a secure connection (HTTPS) or localhost. Please try accessing the site via http://localhost:3000");
      setWeatherLoading(false);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m`);
            if (!res.ok) throw new Error("Failed to fetch weather data");
            const data = await res.json();

            setFormData(prev => ({
              ...prev,
              temperature: data.current.temperature_2m,
              humidity: data.current.relative_humidity_2m
            }));
          } catch (err: any) {
             setError(err.message || "Error fetching weather");
          } finally {
            setWeatherLoading(false);
          }
        },
        (err) => {
          let msg = "Geolocation error: Please allow location access.";
          if (err.code === 1) msg = "Permission Denied: Please enable location access in your browser settings and try again.";
          else if (err.code === 2) msg = "Position Unavailable: Location information is unavailable.";
          else if (err.code === 3) msg = "Timeout: The request to get user location timed out.";
          
          setError(msg);
          setWeatherLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setWeatherLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await addCrop(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save crop data");
    } finally {
      setLoading(false);
    }
  };

  const reqs = CROP_REQUIREMENTS[formData.crop_type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden relative">
        <div className="p-6 border-b border-olive-100 flex justify-between items-center bg-white z-10 shrink-0">
          <h2 className="text-2xl font-bold text-olive-900 flex items-center gap-2">
            Add Crop Data
            <span className="bg-olive-100 text-olive-700 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block border border-olive-200 ml-2">Smart Agronomy Tool</span>
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-olive-400 hover:text-olive-700 hover:bg-olive-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto w-full custom-scrollbar bg-gray-50">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Plot Selection Column */}
              {farm && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-olive-900 mb-1">1. Target Plot Map</h3>
                    <p className="text-sm text-olive-600 mb-4">Click to select the geographical plot area on your farm where this crop is planted.</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-olive-200 shadow-sm">
                    <PlotGrid 
                      farm={farm} 
                      crops={crops} 
                      selectedPlot={formData.plot_index} 
                      onSelectPlot={(idx) => setFormData({...formData, plot_index: idx})} 
                      disableOccupiedPlots={true}
                    />
                  </div>
                  <p className="text-sm text-center font-bold text-olive-800 bg-white p-3 rounded-xl border border-olive-200 shadow-sm">
                    {formData.plot_index === 0 ? "No plots available." : <>Selected Plot Map: <span className="bg-olive-600 text-white px-2 py-0.5 rounded shadow-sm ml-1">Grid Area #{formData.plot_index}</span></>}
                  </p>
                </div>
              )}

              {/* Data Entry Column */}
              {formData.plot_index === 0 ? (
                <div className="bg-orange-50 text-orange-700 p-6 rounded-2xl border border-orange-200 flex flex-col justify-center text-center h-full shadow-inner">
                  <div className="mx-auto w-12 h-12 bg-white rounded-full border border-orange-200 flex items-center justify-center mb-4 text-orange-500 shadow-sm">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Farm at Maximum Capacity</h3>
                  <p className="text-sm">All available plots map geographically to active crops across your dashboard fields. Please harvest or clear an existing plot location from your Dashboard before planting new yields.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-olive-900 mb-4">2. Crop Information</h3>
                    <label className="text-sm font-medium text-olive-800">Crop Type Specie</label>
                    <select
                      name="crop_type"
                      value={formData.crop_type}
                      onChange={handleChange}
                      className="w-full mt-1 rounded-xl border border-olive-200 p-3 shadow-sm bg-white focus:ring-2 focus:ring-olive-500 font-bold text-olive-900 cursor-pointer"
                    >
                      <option value="Wheat">🌾 Wheat</option>
                      <option value="Corn">🌽 Corn</option>
                      <option value="Rice">🍚 Rice</option>
                      <option value="Soybeans">🌱 Soybeans</option>
                      <option value="Potatoes">🥔 Potatoes</option>
                      <option value="Cotton">☁️ Cotton</option>
                    </select>
                  </div>

                  <div className="space-y-2 bg-white p-4 rounded-2xl border border-olive-200 shadow-sm">
                    <div className="flex justify-between items-center mb-1 border-b border-gray-100 pb-2">
                       <label className="text-sm font-bold text-olive-900 flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path></svg> Weather Matrix</label>
                       <button
                         type="button"
                         onClick={fetchWeather}
                         disabled={weatherLoading}
                         className="text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                       >
                         {weatherLoading ? "Fetching..." : (
                           <>
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/></svg>
                             Live Sync
                           </>
                         )}
                       </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2 group">
                      <div>
                        <span className="text-xs text-olive-600 mb-1 block font-medium">Temp °C <span className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded ml-1 cursor-help relative group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors" title={`AI Recommended Temp limit is ${reqs.temp}°C for ${formData.crop_type}`}>Hover for optimal limits</span></span>
                        <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2.5 focus:border-olive-400 focus:ring-1 focus:ring-olive-500 cursor-help" title={`AI Knowledge Base Recommended: ${reqs.temp}°C`} />
                      </div>
                      <div>
                        <span className="text-xs text-olive-600 mb-1 block font-medium">Humidity %</span>
                        <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2.5 focus:border-olive-400 focus:ring-1 focus:ring-olive-500 cursor-help" title={`AI Knowledge Base Recommended: ${reqs.hum}%`} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 border border-olive-200 shadow-sm rounded-2xl p-5 bg-olive-50 relative group">
                    <h3 className="text-sm font-bold text-olive-900 border-b border-olive-200 pb-2 flex justify-between items-center group-hover:border-olive-300">
                       <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7"></path><path d="M15 7h6v6"></path></svg> Soil Nutrients</span>
                       <span className="text-[10px] bg-olive-100 text-olive-600 px-2 py-0.5 rounded cursor-help transition-all opacity-0 group-hover:opacity-100" title={`Optimal N-P-K brackets differ heavily by crop species. Hover over input boxes to examine recommended footprints.`}>Hover inputs securely for AI guidelines</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-olive-800 block mb-1">Nitrogen (N)</label>
                        <input type="number" name="nitrogen_n" value={formData.nitrogen_n} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2 focus:border-olive-400 focus:ring-1 focus:ring-olive-500 bg-white shadow-sm cursor-help hover:ring-2 hover:ring-olive-200 transition-all font-mono text-sm" title={`AI Recommended Nitrogen: ${reqs.n}`} />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-olive-800 block mb-1">Phosphorus (P)</label>
                        <input type="number" name="phosphorus_p" value={formData.phosphorus_p} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2 focus:border-olive-400 focus:ring-1 focus:ring-olive-500 bg-white shadow-sm cursor-help hover:ring-2 hover:ring-olive-200 transition-all font-mono text-sm" title={`AI Recommended Phosphorus: ${reqs.p}`} />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-olive-800 block mb-1">Potassium (K)</label>
                        <input type="number" name="potassium_k" value={formData.potassium_k} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2 focus:border-olive-400 focus:ring-1 focus:ring-olive-500 bg-white shadow-sm cursor-help hover:ring-2 hover:ring-olive-200 transition-all font-mono text-sm" title={`AI Recommended Potassium: ${reqs.k}`} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 bg-white p-4 rounded-2xl shadow-sm border border-olive-200">
                      <label className="text-[11px] font-bold text-olive-800 block">Rainfall (mm)</label>
                      <input type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2.5 focus:border-olive-400 focus:ring-1 focus:ring-olive-500 mt-1 cursor-help" title={`AI Recommended: Varied by local zone.`} />
                    </div>
                    <div className="space-y-1 bg-white p-4 rounded-2xl shadow-sm border border-olive-200">
                      <label className="text-[11px] font-bold text-olive-800 block flex justify-between">pH Level <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 rounded" title={`Optimal pH allows nutrient dissolving pathways. Recommended limit is: ${reqs.ph} for ${formData.crop_type}`}>Target: {reqs.ph}</span></label>
                      <input type="number" step="0.1" name="ph_level" value={formData.ph_level} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2.5 focus:border-olive-400 focus:ring-1 focus:ring-olive-500 mt-1 cursor-help font-mono" title={`AI Knowledge Base Recommended: ${reqs.ph}`} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-olive-100 flex justify-end gap-3 shrink-0 bg-white sticky bottom-0 z-20 pb-2">
              <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl border border-olive-200 text-olive-700 font-bold hover:bg-olive-50 transition-colors cursor-pointer bg-white">
                Cancel Layout
              </button>
              <button type="submit" disabled={loading || formData.plot_index === 0} className="px-6 py-3 rounded-xl bg-olive-900 border border-olive-950 text-white font-bold hover:bg-olive-950 transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Committing Plot Data..." : (
                  <>
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                     Commit Soil Entry
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

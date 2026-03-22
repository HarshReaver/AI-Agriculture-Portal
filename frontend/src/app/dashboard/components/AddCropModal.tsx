"use client";

import { useState, useEffect } from "react";
import { addCrop, CropData } from "../../../services/api/crops";
import { FarmInfo } from "../../../services/api/users";
import PlotGrid from "./PlotGrid";

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
    plot_index: 1,
  });

  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-olive-100 flex justify-between items-center bg-white z-10 shrink-0">
          <h2 className="text-2xl font-bold text-olive-900">Add Crop Data</h2>
          <button onClick={onClose} className="rounded-full p-2 text-olive-400 hover:text-olive-700 hover:bg-olive-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto w-full custom-scrollbar">
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
                    <h3 className="text-lg font-bold text-olive-900 mb-1">1. Target Plot</h3>
                    <p className="text-sm text-olive-600 mb-4">Click to select the geographical plot area on your farm where this crop is planted.</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border-2 border-olive-100">
                    <PlotGrid 
                      farm={farm} 
                      crops={crops} 
                      selectedPlot={formData.plot_index} 
                      onSelectPlot={(idx) => setFormData({...formData, plot_index: idx})} 
                    />
                  </div>
                  <p className="text-sm text-center font-bold text-olive-800 bg-olive-50 p-3 rounded-xl border border-olive-100">
                    Selected Plot: <span className="bg-olive-600 text-white px-2 py-0.5 rounded ml-1">{formData.plot_index}</span>
                  </p>
                </div>
              )}

              {/* Data Entry Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-olive-900 mb-4">2. Crop Information</h3>
                  <label className="text-sm font-medium text-olive-800">Crop Type</label>
                  <select
                    name="crop_type"
                    value={formData.crop_type}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-xl border border-olive-200 p-3 focus:ring-2 focus:ring-olive-500 font-medium"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Corn">Corn</option>
                    <option value="Rice">Rice</option>
                    <option value="Soybeans">Soybeans</option>
                    <option value="Potatoes">Potatoes</option>
                    <option value="Cotton">Cotton</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-medium text-olive-800">Weather & Environment</label>
                    <button
                      type="button"
                      onClick={fetchWeather}
                      disabled={weatherLoading}
                      className="text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 shadow-sm"
                    >
                      {weatherLoading ? "Fetching..." : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          Auto-fetch Local
                        </>
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-olive-500 mb-1 block font-medium">Temp (°C)</span>
                      <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2.5 focus:ring-2 focus:ring-olive-500" />
                    </div>
                    <div>
                      <span className="text-xs text-olive-500 mb-1 block font-medium">Humidity (%)</span>
                      <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2.5 focus:ring-2 focus:ring-olive-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border border-olive-100 rounded-2xl p-5 bg-olive-50/50">
                  <h3 className="text-sm font-bold text-olive-900 border-b border-olive-200 pb-2">Soil Nutrients</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-olive-700 block mb-1">Nitrogen (N)</label>
                      <input type="number" name="nitrogen_n" value={formData.nitrogen_n} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2 focus:ring-2 focus:ring-olive-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-olive-700 block mb-1">Phosphorus (P)</label>
                      <input type="number" name="phosphorus_p" value={formData.phosphorus_p} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2 focus:ring-2 focus:ring-olive-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-olive-700 block mb-1">Potassium (K)</label>
                      <input type="number" name="potassium_k" value={formData.potassium_k} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2 focus:ring-2 focus:ring-olive-500" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-olive-800">Rainfall (mm)</label>
                    <input type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2.5 focus:ring-2 focus:ring-olive-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-olive-800">pH Level</label>
                    <input type="number" step="0.1" name="ph_level" value={formData.ph_level} onChange={handleChange} required className="w-full rounded-xl border border-olive-200 p-2.5 focus:ring-2 focus:ring-olive-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-olive-100 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl border border-olive-200 text-olive-700 font-bold hover:bg-olive-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl bg-olive-600 text-white font-bold hover:bg-olive-700 transition-all shadow-md active:scale-95 disabled:opacity-50">
                {loading ? "Saving..." : "Save Plot Entry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { fetchCrops, clearHistory, CropData } from "../../services/api/crops";
import { useRouter } from "next/navigation";
import { getToken } from "../../services/api/auth";

export default function HistoryPage() {
  const [crops, setCrops] = useState<CropData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchCrops();
      setCrops(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    loadHistory();
  }, [router]);

  const handleClear = async () => {
    if (confirm("Are you sure you want to permanently delete all plot history? This cannot be undone.")) {
      try {
        await clearHistory();
        loadHistory();
      } catch (e) {
        alert("Failed to clear history");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-olive-900">Crop History & Logs</h1>
          <p className="text-olive-600 mt-1">Review all past and present planting records across your entire farm.</p>
        </div>
        <button 
          onClick={handleClear} 
          disabled={crops.length === 0}
          className="bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          Purge History
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-olive-50 rounded-2xl border border-olive-100"></div>
          <div className="h-20 bg-olive-50 rounded-2xl border border-olive-100"></div>
          <div className="h-20 bg-olive-50 rounded-2xl border border-olive-100"></div>
        </div>
      ) : crops.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-3xl border border-olive-200 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-olive-50 rounded-full flex items-center justify-center mb-4 text-olive-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="9" x2="15" y1="15" y2="15"/></svg>
          </div>
          <h2 className="text-xl font-bold text-olive-900 mb-2">No ledgers documented</h2>
          <p className="text-olive-600">Your agricultural timeline is completely empty.</p>
        </div>
      ) : (
        <div className="bg-white border text-left border-olive-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-olive-200">
              <thead className="bg-olive-50">
                <tr>
                  <th className="px-6 py-5 text-xs font-bold text-olive-800 uppercase tracking-wider text-left">Date Logged</th>
                  <th className="px-6 py-5 text-xs font-bold text-olive-800 uppercase tracking-wider text-left">Crop Specie</th>
                  <th className="px-6 py-5 text-xs font-bold text-olive-800 uppercase tracking-wider text-left">Location</th>
                  <th className="px-6 py-5 text-xs font-bold text-olive-800 uppercase tracking-wider text-left">Life Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-olive-800 uppercase tracking-wider text-left">Environment Details</th>
                  <th className="px-6 py-5 text-xs font-bold text-olive-800 uppercase tracking-wider text-left">Soil Nutrients (N-P-K)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-olive-100">
                {crops.map((crop) => (
                  <tr key={crop.id} className="hover:bg-olive-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-olive-600 font-medium">
                      {crop.created_at ? new Date(crop.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown Timeline'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-base font-bold text-olive-900">{crop.crop_type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {crop.plot_index ? (
                         <span className="bg-olive-100 text-olive-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">Plot #{crop.plot_index}</span>
                      ) : (
                         <span className="text-gray-400 italic text-sm">Orphaned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {crop.is_active ? (
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200 inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Active
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Harvested & Cleared
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-olive-700 font-medium">
                      <span className="mr-3">🌡️ {crop.temperature}°C</span>
                      <span>💧 {crop.humidity}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-olive-600">
                      <div className="flex gap-1.5">
                         <span className="font-mono bg-olive-50 px-2 py-1 rounded shadow-inner border border-olive-200 text-xs font-bold text-olive-800" title="Nitrogen">{crop.nitrogen_n}</span>
                         <span className="font-mono bg-olive-50 px-2 py-1 rounded shadow-inner border border-olive-200 text-xs font-bold text-olive-800" title="Phosphorus">{crop.phosphorus_p}</span>
                         <span className="font-mono bg-olive-50 px-2 py-1 rounded shadow-inner border border-olive-200 text-xs font-bold text-olive-800" title="Potassium">{crop.potassium_k}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

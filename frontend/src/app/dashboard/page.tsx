"use client";

import { useEffect, useState } from "react";
import { fetchCrops, CropData } from "../../services/api/crops"
import AddCropModal from "./components/AddCropModal";
import { useRouter } from "next/navigation";
import { getToken } from "../../services/api/auth";

export default function DashboardPage() {
  const [crops, setCrops] = useState<CropData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const loadCrops = async () => {
    setLoading(true);
    try {
      const data = await fetchCrops();
      setCrops(data);
    } catch (error) {
      console.error("Error loading crops:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    loadCrops();
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-olive-900 tracking-tight">Farmer Dashboard</h1>
          <p className="text-olive-600 mt-1">Manage your crop data and monitor yields.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-olive-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-olive-700 transition-all hover:shadow-md active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New Crop Data
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-olive-100 p-6 h-64"></div>
          ))}
        </div>
      ) : crops.length === 0 ? (
        <div className="bg-olive-50 rounded-3xl border border-olive-200 border-dashed p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-olive-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
          </div>
          <h3 className="text-xl font-bold text-olive-900 mb-2">No crop data found</h3>
          <p className="text-olive-600 max-w-md">Start building your smart agriculture history by recording your first crop batch.</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-6 text-olive-600 font-medium hover:text-olive-800 flex items-center gap-1">
            Add your first field record <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <div key={crop.id} className="bg-white rounded-2xl border border-olive-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="bg-olive-50 px-6 py-4 border-b border-olive-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-olive-900">{crop.crop_type}</span>
                </div>
                <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-full text-olive-600 border border-olive-200">
                  {crop.created_at ? new Date(crop.created_at).toLocaleDateString() : 'Recent'}
                </span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-xs text-olive-500 uppercase font-semibold mb-1">Environment</p>
                    <p className="text-sm text-olive-800 font-medium flex items-center gap-1">
                      🌡️ {crop.temperature}°C
                    </p>
                    <p className="text-sm text-olive-800 font-medium flex items-center gap-1 mt-0.5">
                      💧 {crop.humidity}%
                    </p>
                    <p className="text-sm text-olive-800 font-medium flex items-center gap-1 mt-0.5">
                      🌧️ {crop.rainfall}mm
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-olive-500 uppercase font-semibold mb-1">Soil Status</p>
                    <div className="flex gap-2 items-end">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-12 bg-olive-100 rounded-t-sm relative flex items-end justify-center pb-1 text-[10px] font-bold text-olive-800">N
                          <div className="absolute bottom-0 w-full bg-olive-600 rounded-t-sm opacity-50" style={{ height: `${Math.min(crop.nitrogen_n / 2, 100)}%` }}></div>
                        </div>
                        <span className="text-[10px] text-olive-600 mt-1">{crop.nitrogen_n}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-12 bg-olive-100 rounded-t-sm relative flex items-end justify-center pb-1 text-[10px] font-bold text-olive-800">P
                          <div className="absolute bottom-0 w-full bg-olive-600 rounded-t-sm opacity-50" style={{ height: `${Math.min(crop.phosphorus_p / 2, 100)}%` }}></div>
                        </div>
                        <span className="text-[10px] text-olive-600 mt-1">{crop.phosphorus_p}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-12 bg-olive-100 rounded-t-sm relative flex items-end justify-center pb-1 text-[10px] font-bold text-olive-800">K
                          <div className="absolute bottom-0 w-full bg-olive-600 rounded-t-sm opacity-50" style={{ height: `${Math.min(crop.potassium_k / 2, 100)}%` }}></div>
                        </div>
                        <span className="text-[10px] text-olive-600 mt-1">{crop.potassium_k}</span>
                      </div>
                    </div>
                    <p className="text-xs text-olive-600 mt-2 font-medium">pH: {crop.ph_level}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCropModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadCrops}
      />
    </div>
  );
}

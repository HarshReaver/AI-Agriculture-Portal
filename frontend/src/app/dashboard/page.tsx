"use client";

import { useEffect, useState } from "react";
import { fetchCrops, CropData } from "../../services/api/crops";
import { getProfile, FarmInfo } from "../../services/api/users";
import AddCropModal from "./components/AddCropModal";
import PlotGrid from "./components/PlotGrid";
import { useRouter } from "next/navigation";
import { getToken } from "../../services/api/auth";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DashboardPage() {
  const [crops, setCrops] = useState<CropData[]>([]);
  const [farm, setFarm] = useState<FarmInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Realtime sensor polling
  const [sensorData, setSensorData] = useState<any[]>([]);

  const loadCrops = async () => {
    setLoading(true);
    try {
      const profileResponse = await getProfile();
      setFarm(profileResponse.farm);
      const data = await fetchCrops();
      setCrops(data);
    } catch (error: any) {
      if (error.message === "Needs Setup") {
        router.push("/setup");
        return;
      }
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

    // Sensor Polling Loop
    const fetchSensors = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch('http://localhost:8000/api/sensors/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSensorData(data);
        }
      } catch (e) { }
    };

    fetchSensors();
    const interval = setInterval(fetchSensors, 5000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-olive-900 tracking-tight">Farmer Dashboard</h1>
          <p className="text-olive-600 mt-1">Manage your crop data and monitor live sensor yields visually.</p>
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
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-olive-50 rounded-3xl border border-olive-100"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-white rounded-3xl border border-olive-100"></div>
            <div className="h-64 bg-white rounded-3xl border border-olive-100"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {farm && (
            <section>
              <h2 className="text-xl font-bold text-olive-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                Active Plot Geo-Map
              </h2>
              <div className="bg-white p-2 rounded-[2rem] border border-olive-100 shadow-sm">
                <PlotGrid farm={farm} crops={crops} onClearSuccess={loadCrops} />
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold text-olive-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
              Live IoT Sensor Analytics
            </h2>

            {sensorData.length === 0 ? (
              <div className="bg-olive-50 rounded-3xl border border-olive-200 border-dashed p-12 text-center text-olive-600">
                Fetching hardware synchronization telemetry...
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl border border-olive-100 shadow-sm">
                  <h3 className="text-lg font-bold text-olive-900 mb-6 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                    Live Soil Moisture Density (%)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sensorData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="plot_index" tickFormatter={(val) => `Plot ${val}`} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                        <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold', color: '#1f2937' }} />
                        <Bar dataKey="soil_moisture" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Moisture Lvl" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-olive-100 shadow-sm">
                  <h3 className="text-lg font-bold text-olive-900 mb-6 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]"></span>
                    Sunlight UV Index Cast
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sensorData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="plot_index" tickFormatter={(val) => `Plot ${val}`} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} domain={[0, 12]} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold', color: '#1f2937' }} />
                        <Line type="monotone" dataKey="sunlight_uv" stroke="#eab308" strokeWidth={4} dot={{ r: 5, fill: '#fff', strokeWidth: 3 }} activeDot={{ r: 8, stroke: '#eab308', strokeWidth: 2, fill: '#fff' }} name="UV Exposure" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      <AddCropModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadCrops}
        farm={farm}
        crops={crops}
      />
    </div>
  );
}

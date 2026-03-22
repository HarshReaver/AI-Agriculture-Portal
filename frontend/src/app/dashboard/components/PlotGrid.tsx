import React, { useState } from 'react';
import { CropData, clearPlot } from '../../../services/api/crops';
import { FarmInfo } from '../../../services/api/users';

interface PlotGridProps {
  farm: FarmInfo;
  crops: CropData[];
  onSelectPlot?: (index: number) => void;
  selectedPlot?: number;
  onClearSuccess?: () => void;
}

export default function PlotGrid({ farm, crops, onSelectPlot, selectedPlot, onClearSuccess }: PlotGridProps) {
  const { total_plots, rows, cols } = farm;
  
  const [detailsModalPlot, setDetailsModalPlot] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);

  // Group crops by plot index filtering for active only to find the most recent active crop for each plot
  const plotData = new Map<number, CropData>();
  crops.forEach(crop => {
    if (crop.plot_index && crop.is_active && !plotData.has(crop.plot_index)) {
      plotData.set(crop.plot_index, crop);
    }
  });

  const cells = [];
  for (let i = 1; i <= total_plots; i++) {
    const crop = plotData.get(i);
    const isSelected = selectedPlot === i;
    
    cells.push(
      <div 
        key={i} 
        onClick={() => {
          if (onSelectPlot) {
             onSelectPlot(i);
          } else if (crop) {
             setDetailsModalPlot(i);
          }
        }}
        className={`relative group border-2 rounded-xl h-36 flex flex-col justify-between p-3 transition-all ${onSelectPlot ? 'cursor-pointer hover:border-olive-500 hover:shadow-md' : (crop ? 'cursor-pointer hover:border-olive-400 hover:shadow-md' : 'cursor-default')} ${isSelected ? 'border-olive-600 bg-olive-50 scale-105 shadow-md z-10' : 'border-olive-200 bg-white'} ${crop ? 'bg-gradient-to-br from-white to-olive-50' : 'bg-gray-50'}`}
      >
        <div className="flex justify-between items-start">
          <span className={`text-xs font-bold px-2 py-1 rounded-md shadow-sm ${isSelected ? 'bg-olive-600 text-white' : 'bg-olive-100 text-olive-800'}`}>Plot {i}</span>
          {crop && <span className="text-2xl drop-shadow-sm" title={crop.crop_type}>🌱</span>}
        </div>
        
        <div className="text-center mt-2">
          {crop ? (
            <p className="font-bold text-olive-900 text-sm truncate">{crop.crop_type}</p>
          ) : (
            <p className="text-xs text-olive-400 font-medium italic mt-4">Empty Plot</p>
          )}
        </div>
      </div>
    );
  }

  const activeCropForModal = detailsModalPlot ? plotData.get(detailsModalPlot) : null;

  const handleClearPlot = async () => {
    if (!activeCropForModal || !activeCropForModal.id) return;
    if (confirm("Are you sure you want to clear this plot? This deletes the active crop state but preserves it in your history logs.")) {
      setClearing(true);
      try {
        await clearPlot(activeCropForModal.id);
        setDetailsModalPlot(null);
        if (onClearSuccess) onClearSuccess();
      } catch (e) {
        alert("Failed to clear the plot.");
      } finally {
        setClearing(false);
      }
    }
  };

  return (
    <>
      <div 
        className="grid gap-4 w-full p-6 bg-olive-100/30 rounded-3xl border border-olive-200 shadow-inner" 
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells}
      </div>

      {detailsModalPlot && activeCropForModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setDetailsModalPlot(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
               <div className="w-16 h-16 bg-olive-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-olive-100">🌱</div>
               <div>
                 <h3 className="text-2xl font-bold text-olive-900">{activeCropForModal.crop_type}</h3>
                 <span className="bg-olive-600 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md">Plot #{detailsModalPlot}</span>
               </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-sm font-medium text-gray-500">Local Environment</span>
                <span className="font-bold text-gray-900">🌡️ {activeCropForModal.temperature}°C | 💧 {activeCropForModal.humidity}%</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-sm font-medium text-gray-500">Water Irrigation</span>
                <span className="font-bold text-gray-900">{activeCropForModal.rainfall}mm rainfall</span>
              </div>
              <div className="bg-olive-50 p-4 rounded-xl border border-olive-100">
                <p className="text-xs text-olive-500 font-bold uppercase mb-2">Soil Nutritional Matrix (N-P-K)</p>
                <div className="flex justify-between text-center">
                  <div><span className="block text-xl font-bold text-olive-900">{activeCropForModal.nitrogen_n}</span><span className="text-[10px] text-olive-600">Nitrogen</span></div>
                  <div><span className="block text-xl font-bold text-olive-900">{activeCropForModal.phosphorus_p}</span><span className="text-[10px] text-olive-600">Phosphorus</span></div>
                  <div><span className="block text-xl font-bold text-olive-900">{activeCropForModal.potassium_k}</span><span className="text-[10px] text-olive-600">Potassium</span></div>
                  <div><span className="block text-xl font-bold text-olive-900">{activeCropForModal.ph_level}</span><span className="text-[10px] text-olive-600">pH Lvl</span></div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleClearPlot}
              disabled={clearing}
              className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl border border-red-200 hover:bg-red-100 transition-colors shadow-sm disabled:opacity-50"
            >
              {clearing ? "Clearing..." : "Harvest / Clear active Plot"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

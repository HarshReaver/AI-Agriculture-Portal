import React, { useState } from 'react';
import { CropData, clearPlot } from '../../../services/api/crops';
import { FarmInfo } from '../../../services/api/users';

const CropEmojiMap: Record<string, string> = {
    "Wheat": "🌾", "Corn": "🌽", "Rice": "🍚", "Soybeans": "🌱", "Potatoes": "🥔", "Cotton": "☁️"
};

interface PlotGridProps {
  farm: FarmInfo;
  crops: CropData[];
  onSelectPlot?: (index: number) => void;
  selectedPlot?: number;
  onClearSuccess?: () => void;
  disableOccupiedPlots?: boolean;
}

export default function PlotGrid({ farm, crops, onSelectPlot, selectedPlot, onClearSuccess, disableOccupiedPlots }: PlotGridProps) {
  const { total_plots, rows, cols } = farm;
  
  const [detailsModalPlot, setDetailsModalPlot] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);
  const [showPenalties, setShowPenalties] = useState(true);

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
    const isDisabled = disableOccupiedPlots && !!crop;
    
    cells.push(
      <div 
        key={i} 
        onClick={() => {
          if (isDisabled) return;
          if (onSelectPlot) {
             onSelectPlot(i);
          } else if (crop) {
             setDetailsModalPlot(i);
             setShowPenalties(true); // reset state natively
          }
        }}
        className={`relative group border-2 rounded-2xl overflow-hidden h-40 flex flex-col justify-between p-3 transition-all ${
          isDisabled 
            ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-200 grayscale' 
            : onSelectPlot 
              ? 'cursor-pointer hover:border-olive-500 hover:shadow-xl' 
              : (crop ? 'cursor-pointer hover:border-olive-400 hover:shadow-xl' : 'cursor-default')
        } ${isSelected && !isDisabled ? 'border-olive-700 bg-olive-50 scale-105 shadow-xl z-20' : (!isDisabled ? 'border-olive-100 bg-white' : '')}`}
      >
        {crop && !isDisabled && !isSelected && (
           <div className="absolute inset-0 bg-gradient-to-br from-olive-50 to-white opacity-50"></div>
        )}
        
        <div className="flex justify-between items-start z-10">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider ${isSelected ? 'bg-olive-900 text-white' : (isDisabled ? 'bg-gray-200 text-gray-500' : 'bg-white text-olive-800 border-olive-200 border')}`}>Plot {i}</span>
        </div>
        
        <div className="text-center mt-2 absolute inset-0 flex flex-col items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
          {crop ? (
            <>
               <span className="text-5xl drop-shadow-md mb-2 transform group-hover:scale-110 transition-transform duration-300" title={crop.crop_type}>{CropEmojiMap[crop.crop_type] || "🌱"}</span>
               <p className="font-extrabold text-olive-900 text-sm tracking-tight bg-white/70 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm border border-white/50">{crop.crop_type}</p>
            </>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-olive-300 group-hover:text-olive-500 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" x2="21" y1="9" y2="9"></line><line x1="9" x2="9" y1="21" y2="9"></line></svg>
               <p className="text-[10px] font-bold uppercase tracking-widest bg-olive-50 px-2 py-0.5 rounded-md text-olive-400 border border-olive-100">Fallow Plot</p>
             </div>
          )}
        </div>
      </div>
    );
  }

  const activeCropForModal = detailsModalPlot ? plotData.get(detailsModalPlot) : null;

  const handleClearPlot = async () => {
    if (!activeCropForModal || !activeCropForModal.id) return;
    if (confirm("Are you sure you want to harvest and clear this active plot? This deletes the active node natively safely recording it in full-history ledgers.")) {
      setClearing(true);
      try {
        await clearPlot(activeCropForModal.id);
        setDetailsModalPlot(null);
        if (onClearSuccess) onClearSuccess();
      } catch (e) {
        alert("Failed to clear the plot dynamically.");
      } finally {
        setClearing(false);
      }
    }
  };

  const getStatusColor = (val: number, ideal: [number, number]) => {
     if (val >= ideal[0] && val <= ideal[1]) return "text-green-600 bg-green-50 border-green-200 border shadow-inner";
     const variance = (ideal[1] - ideal[0]) * 0.2; 
     if (val >= (ideal[0] - variance) && val <= (ideal[1] + variance)) return "text-yellow-600 bg-yellow-50 border-yellow-200 border shadow-inner";
     return "text-red-600 bg-red-50 border-red-200 border font-black underline decoration-red-300 shadow-inner";
  };

  return (
    <>
      <div 
        className="grid gap-3 w-full p-4 sm:p-6 bg-olive-100/30 rounded-3xl border border-olive-200 shadow-inner" 
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells}
      </div>

      {detailsModalPlot && activeCropForModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] shadow-2xl relative flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-olive-100 flex justify-between items-center bg-white z-10 shrink-0 rounded-t-3xl">
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 bg-gradient-to-br from-white to-olive-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 border-olive-100 relative">
                   {CropEmojiMap[activeCropForModal.crop_type] || "🌱"}
                   <div className="absolute -bottom-2 -right-2 bg-olive-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider border border-white">Map #{detailsModalPlot}</div>
                 </div>
                 <div>
                   <h3 className="text-2xl font-extrabold text-olive-900 tracking-tight flex items-center gap-2">
                      {activeCropForModal.crop_type}
                   </h3>
                   <span className="text-xs font-medium text-olive-500">Log #{activeCropForModal.id?.slice(-6) || 'N/A'}</span>
                 </div>
              </div>
              
              <button onClick={() => setDetailsModalPlot(null)} className="rounded-full p-2 text-olive-400 hover:text-olive-700 hover:bg-olive-50 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto w-full custom-scrollbar bg-gray-50 flex-grow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column: Analytics & Yield */}
                <div className="space-y-6">
                  {activeCropForModal.analytics && (
                    <div className="bg-olive-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-8 text-olive-700 opacity-20 text-9xl font-sans font-black pointer-events-none">kg</div>
                      
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                          <span className="font-bold text-sm text-olive-200 block mb-0.5">Final Estimated Yield Production</span>
                          <div className="flex items-center gap-2">
                             <span className="text-4xl font-black tracking-tight">{activeCropForModal.analytics.predicted_yield_kg}</span>
                             <span className="text-xl font-bold text-olive-400 mt-2">kg</span>
                          </div>
                        </div>
                        <div className="text-right">
                           <span className="text-[10px] text-olive-300 font-bold uppercase block mb-1">Health Deficit Score</span>
                           <span className={`text-xl font-black ${activeCropForModal.analytics.health_score_percent > 75 ? 'text-green-400' : activeCropForModal.analytics.health_score_percent > 40 ? 'text-yellow-400' : 'text-red-400'}`}>{activeCropForModal.analytics.health_score_percent}%</span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-olive-950 rounded-full h-3 mb-3 relative z-10 shadow-inner overflow-hidden flex">
                        <div className="bg-green-400 h-full shadow-[0_0_12px_rgba(74,222,128,0.8)] rounded-l-full" style={{ width: `${activeCropForModal.analytics.health_score_percent}%` }}></div>
                        {100 - activeCropForModal.analytics.health_score_percent > 0 && (
                           <div className="bg-red-500/80 h-full" style={{ width: `${100 - activeCropForModal.analytics.health_score_percent}%` }}></div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center relative z-10">
                        <button onClick={() => setShowPenalties(!showPenalties)} className="text-[11px] font-bold text-olive-300 hover:text-white transition-colors flex items-center gap-1 bg-olive-800 px-2 py-1 rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform ${showPenalties ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                          Calculations Breakdown
                        </button>
                        
                        <span className="text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded-full text-blue-100 flex items-center gap-1.5 border border-white/20">
                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                           Harvests in {activeCropForModal.analytics.days_to_harvest} days
                        </span>
                      </div>

                      {showPenalties && (
                         <div className="mt-4 pt-4 border-t border-olive-700/50 space-y-2 relative z-10 animate-fade-in">
                            <div className="flex justify-between text-xs font-medium text-olive-100">
                               <span>Base Optimal Yield Assumption:</span>
                               <span className="font-mono">{activeCropForModal.analytics.base_yield_kg} kg</span>
                            </div>
                            {activeCropForModal.analytics.penalties.length > 0 ? (
                               activeCropForModal.analytics.penalties.map((pen, idx) => (
                                 <div key={idx} className="flex justify-between text-xs items-center bg-red-500/10 p-1.5 rounded text-red-100 group relative">
                                    <span className="font-bold flex items-center gap-1.5 cursor-help">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                      {pen.metric}
                                      <div className="absolute left-0 bottom-full mb-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-black text-white text-[10px] p-2 rounded w-48 shadow-xl z-50">
                                        {pen.reason}
                                      </div>
                                    </span>
                                    <span className="font-mono text-red-300">{pen.impact_kg} kg</span>
                                 </div>
                               ))
                            ) : (
                               <div className="text-xs text-green-300 font-bold bg-green-500/10 p-1.5 rounded flex items-center gap-1.5">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                  Zero structural penalties! Perfect environment.
                               </div>
                            )}
                            <div className="flex justify-between text-xs font-black text-white pt-1">
                               <span>Final Projected Sum:</span>
                               <span className="font-mono">{activeCropForModal.analytics.predicted_yield_kg} kg</span>
                            </div>
                         </div>
                      )}
                    </div>
                  )}

                  {activeCropForModal.analytics && (
                    <div className="bg-white border text-left border-olive-200 p-5 rounded-2xl shadow-sm">
                      <p className="text-[11px] text-olive-600 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> 
                        AI Pre-Planned Rotation Successors
                      </p>
                      <div className="flex flex-col gap-2">
                        {activeCropForModal.analytics.recommended_rotation.map((rot, i) => (
                          <div key={i} className="group flex items-start gap-3 p-3 rounded-xl border border-olive-50 hover:border-olive-200 hover:bg-olive-50 transition-colors cursor-default relative overflow-hidden">
                             <div className="bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm flex items-center gap-1 shrink-0 z-10">
                                <span className="text-xl leading-none">{CropEmojiMap[rot.crop] || "🌱"}</span>
                             </div>
                             <div className="z-10 relative mt-0.5">
                               <div className="text-sm font-bold text-olive-900 leading-none mb-1 group-hover:text-olive-700 transition-colors">{rot.crop} Sequence</div>
                               <div className="text-xs text-olive-600 leading-relaxed font-medium group-hover:text-olive-800 transition-colors">{rot.reason}</div>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Environment & Soil Matrix */}
                <div className="space-y-6">
                   <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
                      <span className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path></svg> Live Environment
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-xs font-semibold text-gray-500 block mb-1">Temperature (°C)</span>
                            <span className={`text-base font-mono px-2 py-0.5 rounded inline-block ${activeCropForModal.analytics ? getStatusColor(activeCropForModal.temperature, activeCropForModal.analytics.ideal_bounds.ideal_temp) : 'font-bold'}`} title={activeCropForModal.analytics ? `Limits: ${activeCropForModal.analytics.ideal_bounds.ideal_temp[0]}-${activeCropForModal.analytics.ideal_bounds.ideal_temp[1]}` : ''}>{activeCropForModal.temperature}</span>
                         </div>
                         <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-xs font-semibold text-gray-500 block mb-1">Humidity (%)</span>
                            <span className={`text-base font-mono px-2 py-0.5 rounded inline-block ${activeCropForModal.analytics ? getStatusColor(activeCropForModal.humidity, activeCropForModal.analytics.ideal_bounds.ideal_humidity) : 'font-bold'}`} title={activeCropForModal.analytics ? `Limits: ${activeCropForModal.analytics.ideal_bounds.ideal_humidity[0]}-${activeCropForModal.analytics.ideal_bounds.ideal_humidity[1]}` : ''}>{activeCropForModal.humidity}</span>
                         </div>
                         <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm col-span-2">
                            <span className="text-xs font-semibold text-gray-500 block mb-1">Rainfall (mm)</span>
                            <span className="text-base font-mono px-2 py-0.5 font-bold text-blue-600 inline-block">{activeCropForModal.rainfall}</span>
                         </div>
                      </div>
                   </div>

                   <div className="bg-olive-50 border border-olive-200 p-5 rounded-2xl shadow-sm">
                      <span className="text-sm font-bold text-olive-900 flex items-center gap-2 mb-4 border-b border-olive-200 pb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7"></path><path d="M15 7h6v6"></path></svg> Soil Analytics Array
                      </span>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-olive-100 shadow-sm">
                            <span className="text-sm font-bold text-olive-800">Nitrogen (N)</span>
                            <span className={`text-base font-mono px-2 py-1 rounded inline-block ${activeCropForModal.analytics ? getStatusColor(activeCropForModal.nitrogen_n, activeCropForModal.analytics.ideal_bounds.ideal_n) : 'font-bold'}`} title={activeCropForModal.analytics ? `Limits: ${activeCropForModal.analytics.ideal_bounds.ideal_n[0]}-${activeCropForModal.analytics.ideal_bounds.ideal_n[1]}` : ''}>{activeCropForModal.nitrogen_n}</span>
                         </div>
                         <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-olive-100 shadow-sm">
                            <span className="text-sm font-bold text-olive-800">Phosphorus (P)</span>
                            <span className={`text-base font-mono px-2 py-1 rounded inline-block ${activeCropForModal.analytics ? getStatusColor(activeCropForModal.phosphorus_p, activeCropForModal.analytics.ideal_bounds.ideal_p) : 'font-bold'}`} title={activeCropForModal.analytics ? `Limits: ${activeCropForModal.analytics.ideal_bounds.ideal_p[0]}-${activeCropForModal.analytics.ideal_bounds.ideal_p[1]}` : ''}>{activeCropForModal.phosphorus_p}</span>
                         </div>
                         <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-olive-100 shadow-sm">
                            <span className="text-sm font-bold text-olive-800">Potassium (K)</span>
                            <span className={`text-base font-mono px-2 py-1 rounded inline-block ${activeCropForModal.analytics ? getStatusColor(activeCropForModal.potassium_k, activeCropForModal.analytics.ideal_bounds.ideal_k) : 'font-bold'}`} title={activeCropForModal.analytics ? `Limits: ${activeCropForModal.analytics.ideal_bounds.ideal_k[0]}-${activeCropForModal.analytics.ideal_bounds.ideal_k[1]}` : ''}>{activeCropForModal.potassium_k}</span>
                         </div>
                         {activeCropForModal.ph_level !== undefined && (
                           <div className="flex justify-between items-center bg-white p-3 text-sm text-olive-700 border border-olive-200 rounded-xl shadow-sm border-dashed">
                             <span className="font-bold">Soil pH Lvl Target</span>
                             <span className={`font-mono px-2 py-1 rounded inline-block text-sm ${activeCropForModal.analytics ? getStatusColor(activeCropForModal.ph_level, activeCropForModal.analytics.ideal_bounds.ideal_ph) : 'font-bold text-gray-900'}`} title={activeCropForModal.analytics ? `Limits: ${activeCropForModal.analytics.ideal_bounds.ideal_ph[0]}-${activeCropForModal.analytics.ideal_bounds.ideal_ph[1]}` : ''}>{activeCropForModal.ph_level}</span>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-white border-t border-olive-100 mt-auto shrink-0 rounded-b-3xl flex justify-end">
              <button 
                onClick={handleClearPlot}
                disabled={clearing}
                className="bg-red-50 text-red-600 font-bold py-3 px-6 rounded-xl border border-red-200 hover:bg-red-100 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                {clearing ? "Deleting..." : "Harvest / Clear Plot"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

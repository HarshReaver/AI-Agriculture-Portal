import { API_URL, getToken } from './auth';

export interface CropData {
  id?: string;
  crop_type: string;
  nitrogen_n: number;
  phosphorus_p: number;
  potassium_k: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  ph_level?: number;
  plot_index?: number;
  created_at?: string;
  is_active?: boolean;
  analytics?: {
    days_to_harvest: number;
    progress_percent: number;
    base_yield_kg: number;
    predicted_yield_kg: number;
    health_score_percent: number;
    recommended_rotation: { crop: string, reason: string }[];
    penalties: { metric: string, impact_kg: number, reason: string }[];
    ideal_bounds: {
        ideal_n: [number, number];
        ideal_p: [number, number];
        ideal_k: [number, number];
        ideal_temp: [number, number];
        ideal_humidity: [number, number];
        ideal_ph: [number, number];
    };
  };
}

export const fetchCrops = async (): Promise<CropData[]> => {
  const token = getToken();
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${API_URL}/crops/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch crop data');
  }

  return await response.json();
};

export const addCrop = async (cropData: CropData): Promise<CropData> => {
  const token = getToken();
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${API_URL}/crops/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(cropData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add crop data');
  }

  return await response.json();
};

export const clearPlot = async (cropId: string) => {
  const token = getToken();
  if (!token) throw new Error("No token");

  const response = await fetch(`${API_URL}/crops/${cropId}/clear`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to clear plot");
  return await response.json();
};

export const clearHistory = async () => {
  const token = getToken();
  if (!token) throw new Error("No token");

  const response = await fetch(`${API_URL}/crops/history`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to clear history");
  return await response.json();
};

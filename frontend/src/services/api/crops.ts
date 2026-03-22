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
  created_at?: string;
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

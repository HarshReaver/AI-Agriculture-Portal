import { API_URL, getToken } from './auth';

export interface UserProfile {
  user_email: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

export interface FarmInfo {
  user_email: string;
  total_plots: number;
  rows: number;
  cols: number;
  created_at: string;
}

export const getProfile = async (): Promise<{ profile: UserProfile, farm: FarmInfo }> => {
  const token = getToken();
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error("Needs Setup");
    throw new Error('Failed to fetch profile');
  }
  return await response.json();
};

export const setupProfile = async (username: string, totalPlots: number) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token found");

  const formData = new FormData();
  formData.append('username', username);
  formData.append('total_plots', totalPlots.toString());

  const response = await fetch(`${API_URL}/users/setup`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  if (!response.ok) throw new Error('Failed to setup profile');
  return await response.json();
};

export const updateProfile = async (username?: string, totalPlots?: number) => {
  const token = getToken();
  if (!token) throw new Error("No token");

  const formData = new FormData();
  if (username) formData.append('username', username);
  if (totalPlots) formData.append('total_plots', totalPlots.toString());

  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return await response.json();
};

export const uploadAvatar = async (file: File) => {
  const token = getToken();
  if (!token) throw new Error("No token");

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/users/upload-avatar`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  if (!response.ok) throw new Error('Avatar upload failed');
  return await response.json();
};

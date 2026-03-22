"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile, uploadAvatar, UserProfile, FarmInfo } from "../../services/api/users";
import { updatePassword } from "../../services/api/auth";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [farm, setFarm] = useState<FarmInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // Forms
  const [username, setUsername] = useState("");
  const [plots, setPlots] = useState(1);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getProfile();
      setProfile(data.profile);
      setFarm(data.farm);
      setUsername(data.profile.username);
      setPlots(data.farm.total_plots);
      if (data.profile.avatar_url) setAvatarPreview(data.profile.avatar_url);
    } catch (e: any) {
      if (e.message === "Needs Setup") router.push("/setup");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(username, plots);
      showMessage("Profile updated successfully", "success");
      await loadData(); // Reload stats
    } catch (e: any) {
      showMessage(e.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      showMessage("New passwords do not match", "error");
      return;
    }
    setSaving(true);
    try {
      await updatePassword(passwords.current, passwords.newPass);
      showMessage("Password updated securely", "success");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (e: any) {
      showMessage(e.message || "Failed to update password", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file)); // Optimistic UI
      try {
        await uploadAvatar(file);
        showMessage("Avatar updated!", "success");
        await loadData();
      } catch (err: any) {
        showMessage("Avatar upload failed", "error");
      }
    }
  };

  if (loading) return <div className="min-h-screen pt-20 text-center animate-pulse">Loading settings...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-olive-900 mb-8">Account Settings</h1>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-olive-100 shadow-sm text-center">
            <div className="relative inline-block group mb-4">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-olive-50 mx-auto shadow-md bg-olive-100 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <svg className="h-16 w-16 text-olive-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity font-medium">
                Change
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>
            <h3 className="font-bold text-lg text-olive-900">{profile?.username}</h3>
            <p className="text-sm text-olive-500">{profile?.user_email}</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-olive-100 shadow-sm">
            <h4 className="font-semibold text-olive-900 border-b border-olive-50 pb-2 mb-4">Farm Layout</h4>
            <div className="space-y-3 text-sm text-olive-700">
              <div className="flex justify-between"><span>Total Plots</span> <span className="font-medium bg-olive-50 px-2 py-0.5 rounded-lg">{farm?.total_plots}</span></div>
              <div className="flex justify-between"><span>Grid Columns</span> <span className="font-medium">{farm?.cols}</span></div>
              <div className="flex justify-between"><span>Grid Rows</span> <span className="font-medium">{farm?.rows}</span></div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-olive-100 shadow-sm">
            <h3 className="text-xl font-bold text-olive-900 mb-4">Profile Details</h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-olive-700 mb-1">Display Name</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-4 py-2 border border-olive-200 rounded-xl focus:ring-2 focus:ring-olive-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-olive-700 mb-1">Farmland Plots</label>
                <input type="number" min="1" max="100" value={plots} onChange={e => setPlots(parseInt(e.target.value))} required className="w-full px-4 py-2 border border-olive-200 rounded-xl focus:ring-2 focus:ring-olive-500" />
                <p className="text-xs text-olive-500 mt-1">Changing this will automatically recompute your dashboard visual grid.</p>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={saving} className="bg-olive-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-olive-700 transition-colors shadow-sm disabled:opacity-50">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-olive-100 shadow-sm">
            <h3 className="text-xl font-bold text-olive-900 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-olive-700 mb-1">Current Password</label>
                <input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required className="w-full px-4 py-2 border border-olive-200 rounded-xl focus:ring-2 focus:ring-olive-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-1">New Password</label>
                  <input type="password" value={passwords.newPass} onChange={e => setPasswords({...passwords, newPass: e.target.value})} required className="w-full px-4 py-2 border border-olive-200 rounded-xl focus:ring-2 focus:ring-olive-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-1">Confirm New Password</label>
                  <input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required className="w-full px-4 py-2 border border-olive-200 rounded-xl focus:ring-2 focus:ring-olive-500" />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={saving} className="border border-olive-300 text-olive-700 px-5 py-2.5 rounded-xl font-medium hover:bg-olive-50 transition-colors shadow-sm disabled:opacity-50">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

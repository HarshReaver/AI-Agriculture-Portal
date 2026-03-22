"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { setupProfile, uploadAvatar } from "../../services/api/users";

export default function SetupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    total_plots: 1,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = async () => {
    if (step === 1 && !formData.username) {
      setError("Please enter a username");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");
    try {
      await setupProfile(formData.username, formData.total_plots);
      
      if (avatarFile) {
        try {
          await uploadAvatar(avatarFile);
        } catch (err) {
          console.error("Avatar upload failed", err);
        }
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to complete setup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-olive-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-olive-900">
          Welcome to AgriPortal
        </h2>
        <p className="mt-2 text-center text-sm text-olive-600">
          Let's setup your farming profile
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-olive-100">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 p-4 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-olive-700">Username / Farm Name</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="block w-full px-4 py-3 border border-olive-200 rounded-xl focus:ring-2 focus:ring-olive-500 focus:border-olive-500 sm:text-sm transition-all shadow-sm"
                    placeholder="e.g. Green Acres Farm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-olive-700 mb-2">Profile Avatar (Optional)</label>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-olive-100 flex items-center justify-center overflow-hidden border-2 border-olive-200 shadow-sm">
                    {avatarFile ? (
                      <img src={URL.createObjectURL(avatarFile)} alt="Avatar Preview" className="h-full w-full object-cover" />
                    ) : (
                      <svg className="h-8 w-8 text-olive-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white py-2 px-4 border border-olive-200 rounded-xl shadow-sm text-sm font-medium text-olive-700 hover:bg-olive-50 focus:outline-none transition-all"
                  >
                    Upload Photo
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) setAvatarFile(e.target.files[0]);
                    }}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleNext}
                  className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-olive-600 hover:bg-olive-700 transition-all hover:shadow-lg active:scale-[0.98]"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-olive-700">How many plots are on your farm?</label>
                <p className="text-xs text-olive-500 mt-1 mb-3">We will automatically generate a localized field grid based on this number.</p>
                <div className="mt-1">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.total_plots}
                    onChange={(e) => setFormData({...formData, total_plots: parseInt(e.target.value) || 1})}
                    className="block w-full px-4 py-3 border border-olive-200 rounded-xl shadow-sm focus:ring-2 focus:ring-olive-500 focus:border-olive-500 sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 flex justify-center py-3 px-4 border border-olive-200 rounded-xl shadow-sm text-sm font-semibold text-olive-700 bg-white hover:bg-olive-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="w-2/3 flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-olive-600 hover:bg-olive-700 transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Complete Setup"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

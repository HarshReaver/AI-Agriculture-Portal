"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from '../../services/api/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        console.log("Registering...");
        await register(email, password);
        // auto-login after register
        await login(email, password);
      } else {
        await login(email, password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-olive-50">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-olive-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-olive-900">
            {isRegistering ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-olive-600">
            Access your AI smart agriculture dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-1" htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border-0 py-2.5 px-3 text-olive-900 ring-1 ring-inset ring-olive-200 placeholder:text-olive-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-olive-600 sm:text-sm sm:leading-6"
                placeholder="farmer@agrismart.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegistering ? "new-password" : "current-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-md border-0 py-2.5 px-3 text-olive-900 ring-1 ring-inset ring-olive-200 placeholder:text-olive-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-olive-600 sm:text-sm sm:leading-6"
                placeholder="••••••••"
              />
            </div>
            {isRegistering && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-olive-700 mb-1" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required={isRegistering}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="relative block w-full rounded-md border-0 py-2.5 px-3 text-olive-900 ring-1 ring-inset ring-olive-200 placeholder:text-olive-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-olive-600 sm:text-sm sm:leading-6"
                  placeholder="••••••••"
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-olive-600 py-2.5 px-3 text-sm font-semibold text-white hover:bg-olive-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Processing...' : (isRegistering ? 'Sign up' : 'Sign in')}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-olive-600 pt-4 flex flex-col gap-2">
          <span>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="font-semibold text-olive-700 hover:text-olive-900"
          >
            {isRegistering ? 'Sign in instead' : 'Create one now'}
          </button>
        </div>
      </div>
    </div>
  );
}

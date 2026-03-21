"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getToken, logout } from '../../services/api/auth';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!getToken());
    };
    
    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-olive-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {/* A simple leaf or plant icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-olive-600"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <span className="text-xl font-bold tracking-tighter text-olive-900 overflow-hidden">
            AgriSmart AI
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium text-olive-700 hover:text-olive-900 transition-colors">
            Features
          </Link>
          <Link href="/#about" className="text-sm font-medium text-olive-700 hover:text-olive-900 transition-colors">
            About System
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="text-sm font-medium text-olive-700 hover:text-olive-900 transition-colors">
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="rounded-full bg-white border border-olive-200 px-5 py-2 text-sm font-medium text-olive-800 shadow-sm hover:bg-olive-50 hover:shadow-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-600"
            >
              Log Out
            </button>
          ) : (
            <Link 
              href="/login"
              className="rounded-full bg-olive-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-olive-700 hover:shadow-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-600 inline-block"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

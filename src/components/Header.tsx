import React, { useState, useEffect } from 'react';
import { Sun, Moon, Clock, ShieldAlert, Award, BookOpen } from 'lucide-react';
import { getBengaliDate, getBengaliTime, engToBng } from '../utils/bengali';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  totalCount: number;
  starredCount: number;
  localCount: number;
}

export default function Header({
  darkMode,
  setDarkMode,
  totalCount,
  starredCount,
  localCount
}: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-800 to-teal-900 dark:from-slate-900 dark:to-emerald-950 text-white shadow-md border-b border-emerald-700/50 dark:border-emerald-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo and Branding Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-emerald-900 shadow-inner flex-shrink-0 animate-pulse-ring">
              <Award className="w-7 h-7" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center justify-center sm:justify-start gap-1">
                <span>বাপবিবো পরিচিতি নির্দেশিকা</span>
                <span className="hidden md:inline-block text-xs bg-amber-400 text-emerald-950 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  অফিসিয়াল
                </span>
              </h1>
              <p className="text-xs text-emerald-100 dark:text-emerald-300 tracking-wide font-light">
                বাংলাদেশ পল্লী বিদ্যুতায়ন বোর্ড (BREB) • ডিজিটাল ডিরেক্টরি
              </p>
            </div>
          </div>

          {/* Time, Counters, and Theme Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            
            {/* Live Clock (Desktop & Tablet) */}
            <div className="hidden md:flex items-center gap-2 bg-emerald-950/40 dark:bg-slate-950/40 px-3 py-1.5 rounded-lg border border-emerald-700/30 text-emerald-50 text-xs">
              <Clock className="w-4 h-4 text-amber-300" />
              <div className="flex flex-col text-right">
                <span className="font-medium">{getBengaliDate(time)}</span>
                <span className="text-[10px] opacity-85 font-mono">{getBengaliTime(time)}</span>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex items-center gap-2 text-xs">
              <div className="bg-emerald-700/50 dark:bg-emerald-900/40 border border-emerald-600/30 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>মোট: <strong className="font-bold text-amber-300">{engToBng(totalCount.toString())}</strong></span>
              </div>

              {starredCount > 0 && (
                <div className="bg-amber-500/20 border border-amber-500/30 px-2.5 py-1.5 rounded-lg text-amber-300">
                  <span>প্রিয়: <strong>{engToBng(starredCount.toString())}</strong></span>
                </div>
              )}

              {localCount > 0 && (
                <div className="bg-teal-500/20 border border-teal-500/30 px-2.5 py-1.5 rounded-lg text-teal-300">
                  <span>স্থানীয়: <strong>{engToBng(localCount.toString())}</strong></span>
                </div>
              )}
            </div>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              id="theme-toggle"
              className="p-2 rounded-lg bg-emerald-950/40 dark:bg-slate-800 hover:bg-emerald-950/80 dark:hover:bg-slate-700 border border-emerald-700/50 dark:border-slate-600 text-amber-300 transition-all duration-300 flex items-center justify-center cursor-pointer"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-indigo-200" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}

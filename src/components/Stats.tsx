import React, { useState } from 'react';
import { Users, Building, PhoneCall, Mail, ChevronDown, ChevronUp, PieChart } from 'lucide-react';
import { engToBng } from '../utils/bengali';

interface StatsProps {
  contacts: any[];
  uniqueSectionsCount: number;
}

export default function Stats({ contacts, uniqueSectionsCount }: StatsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Math metrics
  const total = contacts.length;
  const withMobile = contacts.filter(c => c.mobile && c.mobile.trim() !== '').length;
  const withEmail = contacts.filter(c => c.email && c.email.trim() !== '').length;
  const withIntercom = contacts.filter(c => c.intercom && c.intercom.trim() !== '').length;

  const mobilePercent = total > 0 ? Math.round((withMobile / total) * 100) : 0;
  const emailPercent = total > 0 ? Math.round((withEmail / total) * 100) : 0;
  const intercomPercent = total > 0 ? Math.round((withIntercom / total) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors duration-300">
      
      {/* Trigger bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-slate-800 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-950/40 transition-all cursor-pointer"
        id="stats-panel-trigger"
      >
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm md:text-base">পরিচিতি ডিরেক্টরি পরিসংখ্যান ও ওভারভিউ</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-normal text-slate-500 dark:text-slate-400">
          <span>{isOpen ? "লুকিয়ে রাখুন" : "বিশদ দেখুন"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Stats Panels Grid */}
      {isOpen && (
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          
          {/* Card 1: Total Contacts */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-500/10 dark:border-emerald-500/20 flex items-start gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">সর্বমোট পরিচিতি</p>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {engToBng(total.toString())} <span className="text-xs font-normal text-slate-500">জন</span>
              </h3>
            </div>
          </div>

          {/* Card 2: Departments */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-500/10 dark:border-indigo-500/20 flex items-start gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">পরিদপ্তর ও দপ্তর</p>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {engToBng(uniqueSectionsCount.toString())} <span className="text-xs font-normal text-slate-500">টি</span>
              </h3>
            </div>
          </div>

          {/* Card 3: Mobile Presence */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-500/10 dark:border-amber-500/20 flex flex-col justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">মোবাইল নম্বর যুক্ত</p>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
                  {engToBng(withMobile.toString())} <span className="text-xs font-normal text-slate-500">জনের</span>
                </h3>
              </div>
            </div>
            <div className="mt-1">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>মোবাইল কভারেজ</span>
                <span>{engToBng(mobilePercent.toString())}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full"
                  style={{ width: `${mobilePercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Card 4: Email Presence */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-500/5 to-blue-500/5 dark:from-sky-500/10 dark:to-blue-500/10 border border-sky-500/10 dark:border-sky-500/20 flex flex-col justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">ইমেইল ঠিকানা যুক্ত</p>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
                  {engToBng(withEmail.toString())} <span className="text-xs font-normal text-slate-500">জনের</span>
                </h3>
              </div>
            </div>
            <div className="mt-1">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>ইমেইল কভারেজ</span>
                <span>{engToBng(emailPercent.toString())}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-1.5 rounded-full"
                  style={{ width: `${emailPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

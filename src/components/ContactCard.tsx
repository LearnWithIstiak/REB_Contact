import React from 'react';
import { Star, Smartphone, Phone, Mail, Building2, MapPin, ArrowUpRight } from 'lucide-react';
import { Contact } from '../data/contacts';
import { bngToEng } from '../utils/bengali';

interface ContactCardProps {
  key?: any;
  contact: Contact;
  viewType: 'grid' | 'list';
  isStarred: boolean;
  onToggleStar: (e: React.MouseEvent) => void;
  onViewDetails: () => void;
}

export default function ContactCard({
  contact,
  viewType,
  isStarred,
  onToggleStar,
  onViewDetails
}: ContactCardProps) {
  
  const handleCallClick = (e: React.MouseEvent, type: string, phone: string) => {
    e.stopPropagation(); // Avoid opening details modal
  };

  if (viewType === 'list') {
    return (
      <div
        onClick={onViewDetails}
        className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 transition-all duration-200 cursor-pointer text-sm"
      >
        {/* Name and Designation Column */}
        <div className="flex items-start gap-3 sm:w-1/3">
          {/* Avatar circle */}
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-base flex-shrink-0">
            {contact.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1">
              <span>{contact.name}</span>
              {contact.isLocal && (
                <span className="text-[9px] bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded-full font-bold">
                  স্থানীয়
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{contact.designation}</p>
          </div>
        </div>

        {/* Section badge column */}
        <div className="sm:w-1/4 mt-2 sm:mt-0 flex flex-wrap items-center">
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold max-w-full truncate">
            {contact.section}
          </span>
        </div>

        {/* Mobile Number Column */}
        <div className="sm:w-1/4 mt-2 sm:mt-0 flex flex-col justify-center">
          {contact.mobile ? (
            <a
              href={`tel:${bngToEng(contact.mobile)}`}
              onClick={(e) => handleCallClick(e, 'mobile', contact.mobile)}
              className="text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold hover:underline flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>{contact.mobile}</span>
            </a>
          ) : (
            <span className="text-slate-300 dark:text-slate-700 italic text-xs">নম্বর নেই</span>
          )}
          {contact.intercom && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
              ইন্টারকম: {contact.intercom}
            </span>
          )}
        </div>

        {/* Buttons tray Column */}
        <div className="flex items-center gap-2 mt-3 sm:mt-0 justify-end">
          {/* Favorite toggle */}
          <button
            onClick={onToggleStar}
            className="p-2 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all cursor-pointer"
            title="প্রিয় কন্টাক্ট হিসেবে সেভ করুন"
          >
            <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          {/* Quick Call Button */}
          {contact.mobile && (
            <a
              href={`tel:${bngToEng(contact.mobile)}`}
              onClick={(e) => handleCallClick(e, 'mobile', contact.mobile)}
              className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer"
              title="কল করুন"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}

          {/* Quick Mail Button */}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-all cursor-pointer"
              title="ইমেইল করুন"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}

          <div className="p-2 rounded-lg text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

      </div>
    );
  }

  // Default Grid View
  return (
    <div
      onClick={onViewDetails}
      className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/60 transition-all duration-300 cursor-pointer flex flex-col justify-between relative"
    >
      {/* Star Button in top-right */}
      <button
        onClick={onToggleStar}
        className="absolute top-4 right-4 p-2 rounded-xl text-slate-300 dark:text-slate-700 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer"
        title="প্রিয় তালিকায় যোগ করুন"
      >
        <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
      </button>

      <div>
        {/* Section Badge */}
        <span className="inline-block px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-lg text-[10px] font-bold tracking-wide mb-3 truncate max-w-[80%]">
          {contact.section}
        </span>

        {/* Profile Card Intro */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-inner">
            {contact.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex flex-wrap items-center gap-1">
              <span className="truncate">{contact.name}</span>
              {contact.isLocal && (
                <span className="text-[8px] bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-1 py-0.2 rounded-full font-bold">
                  স্থানীয়
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate font-medium">
              {contact.designation}
            </p>
          </div>
        </div>

        {/* Details List */}
        <div className="mt-4 space-y-2 text-xs border-t border-slate-50 dark:border-slate-800/50 pt-3">
          
          {/* Mobile */}
          {contact.mobile ? (
            <a
              href={`tel:${bngToEng(contact.mobile)}`}
              onClick={(e) => handleCallClick(e, 'mobile', contact.mobile)}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-mono"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{contact.mobile}</span>
            </a>
          ) : (
            <div className="flex items-center gap-2 text-slate-300 dark:text-slate-700 italic">
              <Smartphone className="w-3.5 h-3.5" />
              <span>মোবাইল নম্বর নেই</span>
            </div>
          )}

          {/* Intercom */}
          {contact.intercom && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>ইন্টারকম: <strong className="font-semibold">{contact.intercom}</strong></span>
            </div>
          )}

          {/* Location */}
          {contact.office && (
            <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 line-clamp-1" title={contact.office}>
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span className="truncate leading-normal">{contact.office}</span>
            </div>
          )}

        </div>
      </div>

      {/* Footer view actions */}
      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/40 flex justify-between items-center text-[10px] text-slate-400">
        <span className="group-hover:text-emerald-500 font-semibold transition-colors flex items-center gap-0.5">
          বিস্তারিত দেখুন <ArrowUpRight className="w-3 h-3" />
        </span>
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {contact.mobile && (
            <a
              href={`tel:${bngToEng(contact.mobile)}`}
              onClick={(e) => handleCallClick(e, 'mobile', contact.mobile)}
              className="p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 text-slate-400 dark:text-slate-500 cursor-pointer"
            >
              <Phone className="w-3 h-3" />
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/40 text-slate-400 dark:text-slate-500 cursor-pointer"
            >
              <Mail className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

    </div>
  );
}

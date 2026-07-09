import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Grid, List, UserPlus, Star, Trash2, PhoneCall, Award,
  ShieldAlert, Download, History, UserCheck, RefreshCw, FileText,
  X, ChevronRight, CheckCircle, ChevronDown, Filter, Info, Building
} from 'lucide-react';

// Import data and utilities
import { INITIAL_CONTACTS, Contact } from './data/contacts';
import { textMatches, bngToEng, engToBng, downloadVCard } from './utils/bengali';

// Import custom components
import Header from './components/Header';
import Stats from './components/Stats';
import Dialer from './components/Dialer';
import ContactCard from './components/ContactCard';
import ContactDetailModal from './components/ContactDetailModal';
import AddContactModal from './components/AddContactModal';

export default function App() {
  // State managers
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('bapbibo_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [dialValue, setDialValue] = useState('');
  const [dialIntercomOnly, setDialIntercomOnly] = useState(false);
  const [selectedSection, setSelectedSection] = useState('all');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'id' | 'name' | 'intercom'>('id');
  
  // Tab Filters: 'all' | 'favorites' | 'local' | 'history'
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'local' | 'history'>('all');

  // Starred (Favorite) Contacts list
  const [starredIds, setStarredIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('bapbibo_starred_ids');
    return saved ? JSON.parse(saved) : [];
  });

  // Local user-added contacts list
  const [localContacts, setLocalContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('bapbibo_local_contacts');
    return saved ? JSON.parse(saved) : [];
  });

  // Local call log history
  const [callHistory, setCallHistory] = useState<Array<{
    id: number;
    name: string;
    number: string;
    timestamp: string;
  }>>(() => {
    const saved = localStorage.getItem('bapbibo_call_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal displays
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Apply Dark Mode Class to document Element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bapbibo_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Persist Stars
  useEffect(() => {
    localStorage.setItem('bapbibo_starred_ids', JSON.stringify(starredIds));
  }, [starredIds]);

  // Persist Local Contacts
  useEffect(() => {
    localStorage.setItem('bapbibo_local_contacts', JSON.stringify(localContacts));
  }, [localContacts]);

  // Persist Call History
  useEffect(() => {
    localStorage.setItem('bapbibo_call_history', JSON.stringify(callHistory));
  }, [callHistory]);

  // Merge static contacts with locally added contacts
  const allContacts = useMemo(() => {
    return [...localContacts, ...INITIAL_CONTACTS];
  }, [localContacts]);

  // Get unique list of sections from all contacts (for dropdown selection)
  const uniqueSections = useMemo(() => {
    const sections = new Set(allContacts.map(c => c.section).filter(Boolean));
    return Array.from(sections).sort();
  }, [allContacts]);

  // Trigger Local Toast
  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Toggle Favorite
  const handleToggleStar = (id: number) => {
    setStarredIds(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('প্রিয় তালিকা থেকে সরানো হয়েছে');
        return prev.filter(item => item !== id);
      } else {
        showToast('প্রিয় তালিকায় যুক্ত করা হয়েছে');
        return [...prev, id];
      }
    });
  };

  // Log Dial Call
  const handleLogCall = (name: string, number: string) => {
    const newLog = {
      id: Date.now(),
      name,
      number,
      timestamp: new Date().toLocaleString('bn-BD', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
    setCallHistory(prev => [newLog, ...prev]);
  };

  // Clear Call Logs
  const handleClearCallHistory = () => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে কল হিস্টোরি মুছে ফেলতে চান?')) {
      setCallHistory([]);
      showToast('কল হিস্টোরি সফলভাবে মুছে ফেলা হয়েছে');
    }
  };

  // Delete Locally Added Contact
  const handleDeleteLocalContact = (id: number) => {
    setLocalContacts(prev => prev.filter(c => c.id !== id));
    // Also clear from stars if starred
    setStarredIds(prev => prev.filter(item => item !== id));
    showToast('কন্টাক্ট সফলভাবে মুছে ফেলা হয়েছে');
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDialValue('');
    setSelectedSection('all');
    setActiveTab('all');
  };

  // Export all contacts as CSV
  const handleExportAllCSV = () => {
    const headers = ['ID', 'Section/Department', 'Name', 'Designation', 'Office Location', 'Email', 'Office Phone', 'Intercom', 'Mobile', 'Fax'];
    const csvRows = [headers.join(',')];

    allContacts.forEach(c => {
      const values = [
        c.id,
        `"${c.section.replace(/"/g, '""')}"`,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.designation.replace(/"/g, '""')}"`,
        `"${(c.office || '').replace(/"/g, '""')}"`,
        c.email || '',
        c.phone_office || '',
        c.intercom || '',
        c.mobile || '',
        c.fax || ''
      ];
      csvRows.push(values.join(','));
    });

    const blob = new Blob([`\ufeff${csvRows.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bapbibo_contacts_directory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('কন্টাক্ট এক্সেল ফাইল ডাউনলোড হচ্ছে...');
  };

  // Compute final contact list based on search, tabs, filters, and dial value
  const filteredContacts = useMemo(() => {
    let result = [...allContacts];

    // 1. Tab Filters
    if (activeTab === 'favorites') {
      result = result.filter(c => starredIds.includes(c.id));
    } else if (activeTab === 'local') {
      result = result.filter(c => c.isLocal);
    }

    // 2. Section Dropdown Filter
    if (selectedSection !== 'all') {
      result = result.filter(c => c.section === selectedSection);
    }

    // 3. Search Bar Input Filter
    if (searchQuery.trim() !== '') {
      result = result.filter(c => 
        textMatches(c.name, searchQuery) ||
        textMatches(c.designation, searchQuery) ||
        textMatches(c.section, searchQuery) ||
        textMatches(c.office, searchQuery) ||
        textMatches(c.mobile, searchQuery) ||
        textMatches(c.intercom, searchQuery) ||
        textMatches(c.email, searchQuery)
      );
    }

    // 4. Dialpad Keypad Filter
    if (dialValue.trim() !== '') {
      const englishDial = bngToEng(dialValue);
      result = result.filter(c => {
        const engMobile = bngToEng(c.mobile || '');
        const engOffice = bngToEng(c.phone_office || '');
        const engIntercom = bngToEng(c.intercom || '');

        if (dialIntercomOnly) {
          return engIntercom.includes(englishDial);
        } else {
          return (
            engMobile.includes(englishDial) ||
            engOffice.includes(englishDial) ||
            engIntercom.includes(englishDial)
          );
        }
      });
    }

    // 5. Apply sorting
    result.sort((a, b) => {
      if (sortOrder === 'name') {
        return a.name.localeCompare(b.name, 'bn');
      } else if (sortOrder === 'intercom') {
        const intA = parseInt(bngToEng(a.intercom)) || 999999;
        const intB = parseInt(bngToEng(b.intercom)) || 999999;
        return intA - intB;
      } else {
        return a.id - b.id; // default ID order
      }
    });

    return result;
  }, [allContacts, activeTab, selectedSection, searchQuery, dialValue, dialIntercomOnly, sortOrder, starredIds]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-12 font-sans">
      
      {/* Header component */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        totalCount={allContacts.length}
        starredCount={starredIds.length}
        localCount={localContacts.length}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">

        {/* Collapsible Stats/Dashboard Overview */}
        <Stats contacts={allContacts} uniqueSectionsCount={uniqueSections.length} />

        {/* Control Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Search, Category Filters, Dialpad, Local add triggers */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Search and Category Filters */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-500" />
                <span>ডিরেক্টরি ফিল্টার ও সার্চ</span>
              </h3>

              {/* Text Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="নাম, পদবী, মোবাইল, বা ইন্টারকম খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 text-sm transition-all text-slate-800 dark:text-slate-100"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Office Section Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  দপ্তর/পরিদপ্তর দিয়ে ফিল্টার
                </label>
                <div className="relative">
                  <select
                    value={selectedSection}
                    onChange={(e) => {
                      setSelectedSection(e.target.value);
                      // Clear dial pad to avoid double filtering unless intentional
                      setDialValue('');
                    }}
                    className="w-full py-2.5 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 cursor-pointer appearance-none"
                  >
                    <option value="all">সকল দপ্তর ও পরিদপ্তর ({engToBng(uniqueSections.length.toString())}টি)</option>
                    {uniqueSections.map((sect, i) => {
                      const count = allContacts.filter(c => c.section === sect).length;
                      return (
                        <option key={i} value={sect}>
                          {sect} ({engToBng(count.toString())})
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Reset Filters & Export Utilities */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/40">
                <button
                  onClick={handleResetFilters}
                  disabled={!searchQuery && !dialValue && selectedSection === 'all' && activeTab === 'all'}
                  className="w-full sm:w-1/2 py-2 px-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  ফিল্টার মুছুন
                </button>
                
                <button
                  onClick={handleExportAllCSV}
                  className="w-full sm:w-1/2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  এক্সেল ডাউনলোড (CSV)
                </button>
              </div>

            </div>

            {/* Smart Dialer utility component */}
            <Dialer
              dialValue={dialValue}
              setDialValue={setDialValue}
              dialIntercomOnly={dialIntercomOnly}
              setDialIntercomOnly={setDialIntercomOnly}
            />

            {/* Local custom contact triggers */}
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 active:scale-98 cursor-pointer"
            >
              <UserPlus className="w-5 h-5 text-amber-300" />
              <span>নতুন কন্টাক্ট যুক্ত করুন</span>
            </button>

          </div>

          {/* RIGHT PANEL: Tab Filters, Contact Listings Table/Grid */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Tabs and Grid/List Controller */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Tab options */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    activeTab === 'all'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  সকল পরিচিতি
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    activeTab === 'favorites'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  প্রিয় পরিচিতি ({engToBng(starredIds.length.toString())})
                </button>
                <button
                  onClick={() => setActiveTab('local')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    activeTab === 'local'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  স্থানীয় কন্টাক্ট ({engToBng(localContacts.length.toString())})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    activeTab === 'history'
                      ? 'bg-slate-700 dark:bg-slate-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  কল লগ ({engToBng(callHistory.length.toString())})
                </button>
              </div>

              {/* View layout selectors and Sorting */}
              <div className="flex items-center justify-between w-full md:w-auto gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50 dark:border-slate-800">
                
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400">সাজানো:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="py-1 px-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-lg focus:outline-none text-xs font-medium cursor-pointer"
                  >
                    <option value="id">ডিফল্ট ক্রম</option>
                    <option value="name">নামানুসারে (A-Z)</option>
                    <option value="intercom">ইন্টারকম ক্রমে</option>
                  </select>
                </div>

                {/* Grid/List View trigger */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                  <button
                    onClick={() => setViewType('grid')}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      viewType === 'grid'
                        ? 'bg-white dark:bg-slate-900 shadow-2xs text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      viewType === 'list'
                        ? 'bg-white dark:bg-slate-900 shadow-2xs text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* CALL HISTORY TAB VIEW */}
            {activeTab === 'history' ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-base flex items-center gap-2 text-slate-800 dark:text-slate-100">
                      <History className="w-5 h-5 text-indigo-500" />
                      <span>স্থানীয় ডায়াল এবং কলিং রেকর্ডস</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">ডিরেক্টরি থেকে সরাসরি করা কলের হিস্টোরি (ব্রাউজারে সংরক্ষিত)</p>
                  </div>
                  {callHistory.length > 0 && (
                    <button
                      onClick={handleClearCallHistory}
                      className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      রেকর্ড খালি করুন
                    </button>
                  )}
                </div>

                {callHistory.length > 0 ? (
                  <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-[500px] overflow-y-auto pr-1">
                    {callHistory.map((log) => (
                      <div key={log.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-800 dark:text-slate-100">{log.name}</p>
                          <p className="text-[11px] font-mono text-slate-400">{log.number}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">{log.timestamp}</span>
                          <span className="text-[10px] text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-bold inline-block mt-1">
                            সফল ডায়াল
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 space-y-2">
                    <History className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
                    <p className="text-sm">এখনো ডিরেক্টরি থেকে কোনো কল রেকর্ড করা হয়নি।</p>
                    <p className="text-xs text-slate-400">যেকোনো পরিচিতির "কল" আইকনে ক্লিক করলেই এখানে রেকর্ড যোগ হবে।</p>
                  </div>
                )}
              </div>
            ) : (
              /* STANDARD SEARCH & CARD LIST VIEW */
              <div className="space-y-4">
                
                {/* Active Filters Display bar */}
                {(selectedSection !== 'all' || searchQuery || dialValue || activeTab !== 'all') && (
                  <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">সক্রিয় ফিল্টারসমূহ:</span>
                    
                    {activeTab !== 'all' && (
                      <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold rounded-lg flex items-center gap-1">
                        <span>ট্যাব: {activeTab === 'favorites' ? 'প্রিয় তালিকা' : activeTab === 'local' ? 'স্থানীয় কন্টাক্ট' : ''}</span>
                        <button onClick={() => setActiveTab('all')} className="hover:text-rose-500 cursor-pointer"><X className="w-3 h-3" /></button>
                      </span>
                    )}

                    {selectedSection !== 'all' && (
                      <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg flex items-center gap-1">
                        <span>দপ্তর: {selectedSection}</span>
                        <button onClick={() => setSelectedSection('all')} className="hover:text-rose-500 cursor-pointer"><X className="w-3 h-3" /></button>
                      </span>
                    )}

                    {searchQuery && (
                      <span className="px-2.5 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-400 font-bold rounded-lg flex items-center gap-1">
                        <span>সার্চ: "{searchQuery}"</span>
                        <button onClick={() => setSearchQuery('')} className="hover:text-rose-500 cursor-pointer"><X className="w-3 h-3" /></button>
                      </span>
                    )}

                    {dialValue && (
                      <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold rounded-lg flex items-center gap-1">
                        <span>ডায়ালপ্যাড: "{dialValue}"</span>
                        <button onClick={() => setDialValue('')} className="hover:text-rose-500 cursor-pointer"><X className="w-3 h-3" /></button>
                      </span>
                    )}

                    <button
                      onClick={handleResetFilters}
                      className="ml-auto text-rose-500 hover:underline font-bold"
                    >
                      সব সাফ করুন
                    </button>
                  </div>
                )}

                {/* Main Results Count */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    খুঁজে পাওয়া গেছে: <strong className="text-slate-700 dark:text-slate-200">{engToBng(filteredContacts.length.toString())}</strong> জন কর্মকর্তা
                  </span>
                  {filteredContacts.length > 0 && (
                    <span>
                      {engToBng(Math.ceil(filteredContacts.length / (viewType === 'grid' ? 1 : 1)).toString())}টি আইটেম প্রদর্শিত
                    </span>
                  )}
                </div>

                {/* Contacts grid / list panel */}
                {filteredContacts.length > 0 ? (
                  <div className={viewType === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden'}>
                    {filteredContacts.map((contact) => (
                      <ContactCard
                        key={contact.id}
                        contact={contact}
                        viewType={viewType}
                        isStarred={starredIds.includes(contact.id)}
                        onToggleStar={(e) => {
                          e.stopPropagation();
                          handleToggleStar(contact.id);
                        }}
                        onViewDetails={() => setActiveContact(contact)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-2xs">
                    <ShieldAlert className="w-14 h-14 mx-auto text-amber-500/80" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">কোনো ফলাফল পাওয়া যায়নি!</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">আপনার সার্চ কুয়েরি অথবা সিলেক্ট করা পরিদপ্তরের সাথে সামঞ্জস্যপূর্ণ কোনো কর্মকর্তা পাওয়া যায়নি। ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                    >
                      ফিল্টারগুলো রিসেট করুন
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </main>

      {/* Floating Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 dark:bg-emerald-900/90 backdrop-blur-xs text-white px-5 py-3 rounded-2xl border border-emerald-500/20 flex items-center gap-2.5 shadow-xl animate-slideUp font-sans">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Add Contact Modal Form */}
      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newContact) => {
            setLocalContacts(prev => [newContact, ...prev]);
            showToast('নতুন কন্টাক্ট সফলভাবে যুক্ত করা হয়েছে');
          }}
          existingSections={uniqueSections}
        />
      )}

      {/* Contact Details Viewer Modal */}
      {activeContact && (
        <ContactDetailModal
          contact={activeContact}
          onClose={() => setActiveContact(null)}
          isStarred={starredIds.includes(activeContact.id)}
          onToggleStar={() => handleToggleStar(activeContact.id)}
          onDeleteLocal={activeContact.isLocal ? handleDeleteLocalContact : undefined}
          onLogCall={handleLogCall}
        />
      )}

    </div>
  );
}

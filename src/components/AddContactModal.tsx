import React, { useState } from 'react';
import { X, Plus, UserPlus, Save, CheckCircle } from 'lucide-react';
import { Contact } from '../data/contacts';

interface AddContactModalProps {
  onClose: () => void;
  onAdd: (contact: Contact) => void;
  existingSections: string[];
}

export default function AddContactModal({
  onClose,
  onAdd,
  existingSections
}: AddContactModalProps) {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [selectedSection, setSelectedSection] = useState(existingSections[0] || '');
  const [customSection, setCustomSection] = useState('');
  const [isCustomSection, setIsCustomSection] = useState(false);
  const [office, setOffice] = useState('');
  const [mobile, setMobile] = useState('');
  const [phoneOffice, setPhoneOffice] = useState('');
  const [intercom, setIntercom] = useState('');
  const [email, setEmail] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [fax, setFax] = useState('');
  
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!name.trim()) {
      setError('নাম অবশ্যই দিতে হবে।');
      return;
    }
    if (!designation.trim()) {
      setError('পদবী অবশ্যই দিতে হবে।');
      return;
    }
    if (!office.trim()) {
      setError('দপ্তর/ঠিকানা অবশ্যই দিতে হবে।');
      return;
    }
    if (!mobile.trim()) {
      setError('মোবাইল নম্বর অবশ্যই দিতে হবে।');
      return;
    }

    const section = isCustomSection ? customSection.trim() : selectedSection;
    if (!section) {
      setError('দপ্তর/শাখা নির্বাচন অথবা টাইপ করুন।');
      return;
    }

    const newContact: Contact = {
      id: Date.now(), // Generate unique ID
      name: name.trim(),
      designation: designation.trim(),
      section: section,
      office: office.trim(),
      mobile: mobile.trim(),
      phone_office: phoneOffice.trim(),
      intercom: intercom.trim(),
      email: email.trim(),
      room_no: roomNo.trim(),
      fax: fax.trim(),
      isLocal: true // Identifies locally added contact
    };

    onAdd(newContact);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-zoomIn">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold">নতুন পরিচিতি যুক্ত করুন (স্থানীয়)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 p-3 rounded-xl text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              কর্মকর্তার নাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: মোঃ আবদুর রহমান"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Designation Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              পদবী <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: উপ-পরিচালক"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Section Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                দপ্তর/শাখা <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomSection(!isCustomSection)}
                className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
              >
                {isCustomSection ? "বিদ্যমান তালিকা থেকে বেছে নিন" : "নতুন শাখা টাইপ করুন"}
              </button>
            </div>

            {isCustomSection ? (
              <input
                type="text"
                placeholder="দপ্তর/শাখা নাম টাইপ করুন (যেমন: অডিট সেল)"
                value={customSection}
                onChange={(e) => setCustomSection(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
              />
            ) : (
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
              >
                {existingSections.map((sect, i) => (
                  <option key={i} value={sect}>
                    {sect}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Office/Office Location Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              দপ্তর ভবন ও অবস্থান <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: সদর দপ্তর ভবন (৩য় তলা), বাপবিবো, ঢাকা।"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Contact Details Fields Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                মোবাইল নম্বর <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: ০১৭০০০০০০০০"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ইন্টারকম নম্বর (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: ১০০"
                value={intercom}
                onChange={(e) => setIntercom(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ফোন অফিস (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: ৮৯০০০০০"
                value={phoneOffice}
                onChange={(e) => setPhoneOffice(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                রুম নং (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: ৩০২"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ইমেইল ঠিকানা (ঐচ্ছিক)
              </label>
              <input
                type="email"
                placeholder="যেমন: exam@reb.gov.bd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 font-semibold text-xs text-center cursor-pointer transition-all"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              সংরক্ষণ করুন
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  X, Phone, Mail, Building, MapPin, Printer, Star, Download, QrCode,
  Check, Trash2, Smartphone, Landmark, Info
} from 'lucide-react';
import { Contact } from '../data/contacts';
import { engToBng, downloadVCard, bngToEng } from '../utils/bengali';

interface ContactDetailModalProps {
  contact: Contact;
  onClose: () => void;
  isStarred: boolean;
  onToggleStar: () => void;
  onDeleteLocal?: (id: number) => void;
  onLogCall?: (contactName: string, number: string) => void;
}

export default function ContactDetailModal({
  contact,
  onClose,
  isStarred,
  onToggleStar,
  onDeleteLocal,
  onLogCall
}: ContactDetailModalProps) {
  const [copiedText, setCopiedText] = useState('');
  const [showQr, setShowQr] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleCallClick = (phoneType: string, number: string) => {
    if (onLogCall) {
      onLogCall(contact.name, `${phoneType}: ${number}`);
    }
    // Standard phone dialing is triggered naturally by tel: links
  };

  // Build vCard text to generate QR code URL
  const cleanMobile = bngToEng(contact.mobile).replace(/\s+/g, '');
  const cleanPhone = bngToEng(contact.phone_office).replace(/\s+/g, '');
  const vCardText = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${contact.name}`,
    `TITLE:${contact.designation}`,
    `ORG:BREB;${contact.section}`,
    cleanMobile ? `TEL;TYPE=CELL:${cleanMobile}` : '',
    cleanPhone ? `TEL;TYPE=WORK:${cleanPhone}` : '',
    contact.email ? `EMAIL:${contact.email}` : '',
    'END:VCARD'
  ].filter(Boolean).join('\n');

  // Generate QR Server API url
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=065f46&data=${encodeURIComponent(vCardText)}`;

  const handlePrint = () => {
    const printContent = document.getElementById('printable-contact-card');
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>বাপবিবো পরিচিতি কার্ড - ${contact.name}</title>
            <style>
              body {
                font-family: 'Hind Siliguri', sans-serif, Arial;
                padding: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #f3f4f6;
              }
              .card {
                background: white;
                border: 3px solid #065f46;
                border-radius: 16px;
                padding: 24px;
                width: 400px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                position: relative;
              }
              .header {
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 12px;
                margin-bottom: 16px;
              }
              .title {
                color: #065f46;
                font-size: 20px;
                font-weight: bold;
                margin: 0;
              }
              .subtitle {
                color: #4b5563;
                font-size: 14px;
                margin: 4px 0 0 0;
              }
              .info-row {
                font-size: 13px;
                margin-bottom: 8px;
                color: #1f2937;
              }
              .label {
                font-weight: bold;
                color: #374151;
              }
              .footer {
                margin-top: 16px;
                font-size: 10px;
                color: #9ca3af;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <div class="title">${contact.name}</div>
                <div class="subtitle">${contact.designation}</div>
              </div>
              <div class="info-row"><span class="label">শাখা/দপ্তর:</span> ${contact.section}</div>
              ${contact.office ? `<div class="info-row"><span class="label">ভবন ও অবস্থান:</span> ${contact.office}</div>` : ''}
              ${contact.mobile ? `<div class="info-row"><span class="label">মোবাইল:</span> ${contact.mobile}</div>` : ''}
              ${contact.intercom ? `<div class="info-row"><span class="label">ইন্টারকম:</span> ${contact.intercom}</div>` : ''}
              ${contact.phone_office ? `<div class="info-row"><span class="label">অফিস ফোন:</span> ${contact.phone_office}</div>` : ''}
              ${contact.email ? `<div class="info-row"><span class="label">ইমেইল:</span> ${contact.email}</div>` : ''}
              ${contact.room_no ? `<div class="info-row"><span class="label">রুম নম্বর:</span> ${contact.room_no}</div>` : ''}
              <div class="footer">বাংলাদেশ পল্লী বিদ্যুতায়ন বোর্ড (বাপবিবো) পরিচিতি নির্দেশিকা</div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-zoomIn">
        
        {/* Dynamic Colorful Banner */}
        <div className="relative bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 pb-20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Quick Favorite Star */}
          <button
            onClick={onToggleStar}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            title={isStarred ? "প্রিয় তালিকা থেকে বাদ দিন" : "প্রিয় তালিকায় যোগ করুন"}
          >
            <Star className={`w-5 h-5 ${isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
          </button>

          <div className="flex flex-col items-center text-center mt-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-3xl font-bold border-4 border-white/20 shadow-md">
              {contact.name.charAt(0)}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-3 leading-tight">{contact.name}</h2>
            <p className="text-xs sm:text-sm text-emerald-200 dark:text-emerald-300 font-medium mt-1">
              {contact.designation}
            </p>
            <span className="mt-2.5 px-3 py-1 bg-white/10 dark:bg-emerald-950/40 rounded-full text-[11px] font-semibold tracking-wider text-emerald-100 border border-white/5">
              {contact.section}
            </span>
          </div>
        </div>

        {/* Info Area (Floating card style overlapping banner) */}
        <div className="px-6 -mt-14 relative pb-6">
          <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-5 space-y-4">
            
            {/* Office/Building */}
            {contact.office && (
              <div className="flex items-start gap-3.5 text-sm">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">ভবন ও অবস্থান</p>
                  <p className="text-slate-700 dark:text-slate-200 mt-0.5 font-medium leading-relaxed">{contact.office}</p>
                </div>
              </div>
            )}

            {/* Mobile */}
            {contact.mobile && (
              <div className="flex items-start justify-between gap-3 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">মোবাইল নম্বর</p>
                    <a
                      href={`tel:${bngToEng(contact.mobile)}`}
                      onClick={() => handleCallClick('মোবাইল', contact.mobile)}
                      className="text-slate-800 dark:text-slate-100 font-mono text-base font-bold hover:underline block mt-0.5"
                    >
                      {contact.mobile}
                    </a>
                  </div>
                </div>
                <div className="flex gap-1.5 self-center">
                  <button
                    onClick={() => copyToClipboard(contact.mobile, 'মোবাইল')}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 cursor-pointer font-medium"
                  >
                    {copiedText === 'মোবাইল' ? <Check className="w-3.5 h-3.5 text-emerald-500 inline mr-1" /> : ''}
                    {copiedText === 'মোবাইল' ? 'কপি হয়েছে' : 'কপি'}
                  </button>
                  <a
                    href={`tel:${bngToEng(contact.mobile)}`}
                    onClick={() => handleCallClick('মোবাইল', contact.mobile)}
                    className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer"
                    title="কল করুন"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Intercom */}
            {contact.intercom && (
              <div className="flex items-start justify-between gap-3 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex-shrink-0">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">ইন্টারকম নম্বর</p>
                    <p className="text-slate-800 dark:text-slate-100 font-mono text-base font-bold mt-0.5">
                      {contact.intercom}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5 self-center">
                  <button
                    onClick={() => copyToClipboard(contact.intercom, 'ইন্টারকম')}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 cursor-pointer font-medium"
                  >
                    {copiedText === 'ইন্টারকম' ? <Check className="w-3.5 h-3.5 text-emerald-500 inline mr-1" /> : ''}
                    {copiedText === 'ইন্টারকম' ? 'কপি হয়েছে' : 'কপি'}
                  </button>
                </div>
              </div>
            )}

            {/* Office Phone */}
            {contact.phone_office && (
              <div className="flex items-start justify-between gap-3 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">অফিস টেলিফোন</p>
                    <a
                      href={`tel:${bngToEng(contact.phone_office)}`}
                      onClick={() => handleCallClick('অফিস', contact.phone_office)}
                      className="text-slate-800 dark:text-slate-100 font-mono text-sm font-semibold hover:underline block mt-0.5"
                    >
                      {contact.phone_office}
                    </a>
                  </div>
                </div>
                <div className="flex gap-1.5 self-center">
                  <button
                    onClick={() => copyToClipboard(contact.phone_office, 'অফিস')}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 cursor-pointer font-medium"
                  >
                    {copiedText === 'অফিস' ? <Check className="w-3.5 h-3.5 text-emerald-500 inline mr-1" /> : ''}
                    {copiedText === 'অফিস' ? 'কপি হয়েছে' : 'কপি'}
                  </button>
                  <a
                    href={`tel:${bngToEng(contact.phone_office)}`}
                    onClick={() => handleCallClick('অফিস', contact.phone_office)}
                    className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Email */}
            {contact.email && (
              <div className="flex items-start justify-between gap-3 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-sky-500 font-bold uppercase tracking-wider">ইমেইল ঠিকানা</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-slate-700 dark:text-slate-200 text-sm font-medium hover:underline block mt-0.5 break-all"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
                <div className="flex gap-1.5 self-center">
                  <button
                    onClick={() => copyToClipboard(contact.email, 'ইমেইল')}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 cursor-pointer font-medium"
                  >
                    {copiedText === 'ইমেইল' ? <Check className="w-3.5 h-3.5 text-emerald-500 inline mr-1" /> : ''}
                    {copiedText === 'ইমেইল' ? 'কপি হয়েছে' : 'কপি'}
                  </button>
                  <a
                    href={`mailto:${contact.email}`}
                    className="p-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-xs cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Room No & Fax */}
            {(contact.room_no || contact.fax) && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {contact.room_no && (
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block">রুম নম্বর</span>
                    <span className="text-slate-700 dark:text-slate-200 font-mono text-sm font-semibold mt-0.5 block">{contact.room_no}</span>
                  </div>
                )}
                {contact.fax && (
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block">ফ্যাক্স নম্বর</span>
                    <span className="text-slate-700 dark:text-slate-200 font-mono text-sm font-semibold mt-0.5 block">{contact.fax}</span>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Interactive QR Code toggle */}
          <div className="mt-4">
            <button
              onClick={() => setShowQr(!showQr)}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-950/40 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{showQr ? "QR কোড লুকান" : "ক্যামেরা দিয়ে স্ক্যান করতে QR কোড দেখুন"}</span>
            </button>

            {showQr && (
              <div className="mt-3 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex flex-col items-center text-center gap-2 animate-fadeIn">
                <img
                  src={qrCodeUrl}
                  alt={`${contact.name} QR Code`}
                  className="w-40 h-40 bg-white p-2 rounded-xl shadow-xs border border-emerald-200"
                  referrerPolicy="no-referrer"
                />
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed max-w-xs">
                  মোবাইল ক্যামেরার স্ক্যানার দিয়ে স্ক্যান করলেই ভিকার্ড (vCard) ফাইল হিসেবে সরাসরি কন্টাক্ট লিস্টে সেভ হবে।
                </p>
              </div>
            )}
          </div>

          {/* Action Tools Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <button
              onClick={() => downloadVCard(contact)}
              className="py-3 px-4 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>মোবাইলে সেভ করুন</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট কার্ড</span>
            </button>
          </div>

          {/* Local Contact deletion option */}
          {contact.isLocal && onDeleteLocal && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`আপনি কি নিশ্চিতভাবে "${contact.name}" কন্টাক্টটি মুছে ফেলতে চান?`)) {
                  onDeleteLocal(contact.id);
                  onClose();
                }
              }}
              className="w-full mt-3 py-3 px-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/20 dark:bg-red-950/10 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>এই কন্টাক্টটি মুছে ফেলুন (ডিলেট)</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

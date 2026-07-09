import React from 'react';
import { Delete, Phone, ShieldClose, RefreshCw, Smartphone } from 'lucide-react';
import { engToBng } from '../utils/bengali';

interface DialerProps {
  dialValue: string;
  setDialValue: (val: string) => void;
  dialIntercomOnly: boolean;
  setDialIntercomOnly: (val: boolean) => void;
}

export default function Dialer({
  dialValue,
  setDialValue,
  dialIntercomOnly,
  setDialIntercomOnly
}: DialerProps) {
  
  const handleDigitClick = (digit: string) => {
    if (dialValue.length < 15) {
      setDialValue(dialValue + digit);
    }
  };

  const handleBackspace = () => {
    setDialValue(dialValue.slice(0, -1));
  };

  const handleClear = () => {
    setDialValue('');
  };

  const keypadDigits = [
    { num: '1', letters: ' ' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '*', letters: '' },
    { num: '0', letters: '+' },
    { num: '#', letters: '' }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-500" />
          <span>স্মার্ট ডায়ালপ্যাড ফিল্টার</span>
        </h3>
        {dialValue && (
          <button
            onClick={handleClear}
            className="text-xs text-red-500 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            মুছে ফেলুন
          </button>
        )}
      </div>

      {/* Screen */}
      <div className="bg-slate-900 dark:bg-black rounded-xl p-3 border-2 border-slate-700 dark:border-slate-900 shadow-inner flex flex-col justify-center min-h-[64px] text-center">
        {dialValue ? (
          <div className="animate-pulse">
            <p className="text-2xl font-mono font-bold tracking-widest text-emerald-400">
              {engToBng(dialValue)}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">
              {dialIntercomOnly ? "শুধুমাত্র ইন্টারকম খোঁজা হচ্ছে" : "মোবাইল/ফোন নম্বর খোঁজা হচ্ছে"}
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-sans italic">
            খুঁজতে ডায়ালপ্যাডে নম্বর চাপুন...
          </p>
        )}
      </div>

      {/* Selector mode */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => setDialIntercomOnly(false)}
          className={`py-1.5 px-2 rounded-lg border transition-all text-center font-medium cursor-pointer ${
            !dialIntercomOnly
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          সব নম্বর
        </button>
        <button
          onClick={() => setDialIntercomOnly(true)}
          className={`py-1.5 px-2 rounded-lg border transition-all text-center font-medium cursor-pointer ${
            dialIntercomOnly
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ইন্টারকম
        </button>
      </div>

      {/* Keys Grid */}
      <div className="grid grid-cols-3 gap-2">
        {keypadDigits.map((item, index) => (
          <button
            key={index}
            onClick={() => handleDigitClick(item.num)}
            className="h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-900 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer shadow-2xs"
          >
            <span className="text-base font-bold font-mono leading-none">{engToBng(item.num)}</span>
            {item.letters && (
              <span className="text-[8px] text-slate-400 font-sans tracking-widest uppercase leading-none mt-1">
                {item.letters}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Backspace utility */}
      <div className="flex gap-2">
        <button
          onClick={handleBackspace}
          disabled={!dialValue}
          className="w-full h-11 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 disabled:opacity-40 disabled:hover:bg-transparent flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer transition-all active:scale-95"
        >
          <Delete className="w-4 h-4" />
          <span>নম্বর মুছুন</span>
        </button>
      </div>
    </div>
  );
}

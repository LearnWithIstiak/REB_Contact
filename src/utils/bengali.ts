const BENGALI_TO_ENGLISH: { [key: string]: string } = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

const ENGLISH_TO_BENGALI: { [key: string]: string } = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

/**
 * Converts Bengali digits to English digits
 */
export function bngToEng(str: string): string {
  return str.replace(/[০-৯]/g, (char) => BENGALI_TO_ENGLISH[char] || char);
}

/**
 * Converts English digits to Bengali digits
 */
export function engToBng(str: string): string {
  return str.replace(/[0-9]/g, (char) => ENGLISH_TO_BENGALI[char] || char);
}

/**
 * Checks if search text matches target text by normalizing both
 * (converts to lowercase, strips extra spaces, and maps Bengali/English numbers)
 */
export function textMatches(target: string, search: string): boolean {
  if (!target) return false;
  if (!search) return true;

  const targetLower = target.toLowerCase();
  const searchLower = search.toLowerCase();

  if (targetLower.includes(searchLower)) return true;

  // Try digit translation to match English inputs against Bengali numbers
  const targetEngNum = bngToEng(targetLower);
  const searchEngNum = bngToEng(searchLower);

  if (targetEngNum.includes(searchEngNum)) return true;

  // Try Bengali translation
  const targetBngNum = engToBng(targetLower);
  const searchBngNum = engToBng(searchLower);

  if (targetBngNum.includes(searchBngNum)) return true;

  return false;
}

/**
 * Dynamic Bengali date formatter
 */
export function getBengaliDate(date: Date): string {
  const day = date.getDate().toString();
  const year = date.getFullYear().toString();
  
  const monthsBng = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  const month = monthsBng[date.getMonth()];
  
  const daysBng = [
    "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
  ];
  const weekday = daysBng[date.getDay()];

  return `${engToBng(weekday)}, ${engToBng(day)} ${month}, ${engToBng(year)}`;
}

/**
 * Dynamic Bengali time formatter
 */
export function getBengaliTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  return `${ampm} ${engToBng(hours.toString())}:${engToBng(minutes)}:${engToBng(seconds)}`;
}

/**
 * Helper to download vCard as a file
 */
export function downloadVCard(contact: {
  name: string;
  designation: string;
  section: string;
  office: string;
  mobile: string;
  phone_office: string;
  intercom: string;
  email: string;
}) {
  const cleanMobile = bngToEng(contact.mobile).replace(/\s+/g, '');
  const cleanPhone = bngToEng(contact.phone_office).replace(/\s+/g, '');
  const cleanIntercom = bngToEng(contact.intercom).replace(/\s+/g, '');

  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:;${contact.name};;;`,
    `FN:${contact.name}`,
    `TITLE:${contact.designation}`,
    `ORG:Bangladesh Rural Electrification Board (REB);${contact.section}`,
    `NOTE:Office: ${contact.office} | Intercom: ${contact.intercom}`,
    cleanMobile ? `TEL;TYPE=CELL,VOICE:${cleanMobile}` : '',
    cleanPhone ? `TEL;TYPE=WORK,VOICE:${cleanPhone}` : '',
    cleanIntercom ? `TEL;TYPE=INTERNAL,VOICE:${cleanIntercom}` : '',
    contact.email ? `EMAIL;TYPE=PREF,INTERNET:${contact.email}` : '',
    'END:VCARD'
  ].filter(Boolean).join('\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${contact.name.replace(/[\s,]+/g, '_')}_contact.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

import { useState, useRef } from 'react';
import { MdCameraAlt, MdClose } from 'react-icons/md';
import Tesseract from 'tesseract.js';
import { CATEGORIES } from './ExpenseForm';

const KEYWORD_MAP = {
  'food': ['restaurant', 'cafe', 'burger', 'pizza', 'deli', 'bakery', 'coffee', 'swiggy', 'zomato'],
  'transport': ['uber', 'ola', 'taxi', 'fuel', 'petrol', 'toll', 'parking', 'transit', 'railway'],
  'health': ['pharmacy', 'clinic', 'hospital', 'medical', 'dental', 'apollo'],
  'shopping': ['supermarket', 'mart', 'mall', 'store', 'amazon', 'flipkart', 'retail'],
  'utilities': ['electric', 'water', 'internet', 'bill', 'telecom', 'recharge']
};

export default function ReceiptScanner({ onScanComplete }) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    setProgress('Initializing scanner...');

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(`Scanning: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      const text = result.data.text;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      let parsedTitle = 'Scanned Receipt';
      let parsedAmount = '';
      let parsedCategory = 'Other';

      // 1. Extract Merchant/Title (usually first significant line)
      for (let line of lines) {
        if (line.length > 3 && !line.toLowerCase().includes('total') && !line.toLowerCase().includes('date')) {
          parsedTitle = line.substring(0, 30);
          break;
        }
      }

      // 2. Extract Total Amount
      // Look for "Total", "Amount", "Net" followed by a number
      const amountRegex = /(?:total|amount|net|sum|pay|due|rupees|rs)\s*[:=\-]?\s*(?:rs\.?|₹)?\s*(\d+(?:\.\d{1,2})?)/i;
      
      for (let i = lines.length - 1; i >= 0; i--) { // Read bottom up for totals
        const match = lines[i].match(amountRegex);
        if (match && match[1]) {
          parsedAmount = match[1];
          break;
        }
      }
      
      // Fallback: Just find the largest number on the receipt with a decimal
      if (!parsedAmount) {
        let maxVal = 0;
        const allNums = text.match(/\b\d+\.\d{2}\b/g) || [];
        allNums.forEach(n => {
          const val = parseFloat(n);
          if (val > maxVal && val < 100000) maxVal = val;
        });
        if (maxVal > 0) parsedAmount = maxVal.toString();
      }

      // 3. Auto-Categorize based on keywords in the entire text
      const lowerText = text.toLowerCase();
      for (const [catKey, keywords] of Object.entries(KEYWORD_MAP)) {
        if (keywords.some(kw => lowerText.includes(kw))) {
          const match = CATEGORIES.find(c => c.toLowerCase() === catKey);
          if (match) {
            parsedCategory = match;
            break;
          }
        }
      }

      onScanComplete({
        title: parsedTitle,
        amount: parsedAmount,
        category: parsedCategory
      });

    } catch (err) {
      console.error("OCR Error:", err);
      alert("Failed to scan receipt. Please enter manually.");
    } finally {
      setIsScanning(false);
      setProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        capture="environment" // Suggests rear camera on mobile
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isScanning}
        className="glass-button bg-slate-900/50 border border-primary/30 text-primary hover:bg-primary hover:text-slate-950 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 w-full shadow-[0_0_10px_rgba(16,185,129,0.1)]"
      >
        <MdCameraAlt className="text-xl" />
        {isScanning ? progress : 'Scan Bill (OCR)'}
      </button>

      {isScanning && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-primary/30 p-3 rounded-xl z-20 shadow-xl flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <span className="text-xs text-primary font-medium tracking-wide animate-pulse">
            {progress}
          </span>
        </div>
      )}
    </div>
  );
}

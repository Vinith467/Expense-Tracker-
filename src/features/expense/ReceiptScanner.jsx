import { useState, useRef, useEffect } from 'react';
import { MdCameraAlt, MdClose, MdVpnKey, MdCheckCircle } from 'react-icons/md';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIES } from './ExpenseForm';

export default function ReceiptScanner({ onScanComplete }) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const saveApiKey = (key) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setShowKeyInput(false);
  };

  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!apiKey) {
      setShowKeyInput(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsScanning(true);
    setProgress('Uploading secure image...');

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      setProgress('AI analyzing receipt...');
      const imagePart = await fileToGenerativePart(file);

      const prompt = `
        Analyze this receipt. Extract the following information and return ONLY a valid JSON object.
        
        Required JSON structure:
        {
          "title": "Merchant or Store Name (max 30 chars)",
          "amount": "The FINAL total amount as a number string (e.g. '25.00' or '25')",
          "category": "Must be exactly one of these: ${CATEGORIES.join(', ')}. Guess the best fit."
        }
        
        Rules:
        - If you cannot find a merchant name, use "Unknown Merchant".
        - If you cannot find a total amount, use "0.00".
        - Ensure category perfectly matches the spelling/casing of the list provided.
      `;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      let text = response.text().trim();
      
      const parsedData = JSON.parse(text);

      onScanComplete({
        title: parsedData.title || 'Scanned Receipt',
        amount: parsedData.amount || '0',
        category: CATEGORIES.includes(parsedData.category) ? parsedData.category : 'Other'
      });

    } catch (err) {
      console.error("Gemini AI Error:", err);
      const errMsg = err.message ? err.message.toLowerCase() : String(err).toLowerCase();
      
      if (errMsg.includes('api key') || errMsg.includes('key not valid') || errMsg.includes('unauthorized')) {
        alert("Invalid API Key. Please check your Gemini API key.");
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        setShowKeyInput(true);
      } else {
        alert(`AI Error: ${err.message || 'Unknown error'}. Try taking a clearer photo.`);
      }
    } finally {
      setIsScanning(false);
      setProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (showKeyInput) {
    return (
      <div className="bg-slate-900/80 border border-primary/30 p-4 rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-primary font-bold flex items-center gap-2">
            <MdVpnKey /> Setup AI Scanner
          </h3>
          <button onClick={() => setShowKeyInput(false)} className="text-slate-400 hover:text-white">
            <MdClose />
          </button>
        </div>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          To achieve 100% accuracy on crumpled or faded receipts, we use Google's Gemini AI. It's completely free!
          Get your free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Google AI Studio</a>.
        </p>
        <div className="flex gap-2">
          <input 
            type="password" 
            placeholder="Paste Gemini API Key here"
            className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
            id="gemini-key-input"
          />
          <button 
            type="button"
            onClick={() => {
              const val = document.getElementById('gemini-key-input').value.trim();
              if (val) saveApiKey(val);
            }}
            className="bg-primary text-slate-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-400 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
          className="glass-button flex-1 bg-slate-900/50 border border-primary/30 text-primary hover:bg-primary hover:text-slate-950 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
        >
          <MdCameraAlt className="text-xl" />
          {isScanning ? progress : 'Scan Bill (AI Vision)'}
        </button>
        
        {apiKey && (
          <button 
            type="button"
            onClick={() => setShowKeyInput(true)}
            className="p-3 bg-slate-900/50 border border-white/10 text-slate-400 hover:text-white rounded-xl transition-colors"
            title="Update API Key"
          >
            <MdVpnKey className="text-lg" />
          </button>
        )}
      </div>

      {isScanning && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-primary/30 p-3 rounded-xl z-20 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span className="text-xs text-primary font-medium tracking-wide animate-pulse">
              {progress}
            </span>
          </div>
          <span className="text-[10px] text-primary/50 uppercase tracking-widest font-black">Gemini 1.5</span>
        </div>
      )}
    </div>
  );
}

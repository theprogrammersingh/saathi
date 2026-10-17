import React, { useState } from 'react';
import { X, Key, CheckCircle, Sparkles, ExternalLink } from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (hasKey: boolean) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved
}) => {
  const [apiKey, setApiKey] = useState(GeminiService.getApiKey() || '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      GeminiService.setApiKey(apiKey.trim());
      setStatusMessage('Gemini API Key successfully saved!');
      onKeySaved(true);
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1000);
    } else {
      GeminiService.clearApiKey();
      setStatusMessage('Switched to Smart Local Demo Mode');
      onKeySaved(false);
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1000);
    }
  };

  const handleUseDemo = () => {
    setApiKey('');
    GeminiService.clearApiKey();
    setStatusMessage('Instant Demo Mode Activated');
    onKeySaved(false);
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-amber-400" />
            <h2 id="api-modal-title" className="font-bold text-base">
              Gemini AI Engine Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs sm:text-sm text-slate-700">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900 text-xs space-y-1">
            <div className="font-bold flex items-center space-x-1.5 text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Full Offline / Demo Mode Included!</span>
            </div>
            <p>
              Saathi works out-of-the-box with preloaded realistic Indian gig economy datasets (Zomato ₹500 delay, Swiggy ₹350 cancellation, Uber ₹280 route clawback). No API key required for evaluating the hackathon flow!
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="gemini-key-input" className="font-semibold text-slate-800 block text-xs">
              Google Gemini API Key (Optional for live multimodal extraction):
            </label>
            <input
              id="gemini-key-input"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-saathi-waLight font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500">
              Key is stored safely in your browser localStorage only. Never shared or sent to any external server other than Google's official Gemini endpoint.
            </p>
          </div>

          {statusMessage && (
            <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-saathi-waLight hover:underline flex items-center space-x-1"
            >
              <span>Get a free Gemini API Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleUseDemo}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear / Use Demo Mode
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-saathi-waLight hover:bg-saathi-waDark text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition-colors"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

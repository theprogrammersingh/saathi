import React, { useState, useRef, useEffect } from 'react';
import { Shield, AlertTriangle, Key, RotateCcw, Volume2, Globe, MoreVertical, Check } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface HeaderProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenApiKeyModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenWelfareDrawer: () => void;
  onResetChat: () => void;
  hasApiKey: boolean;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

const LANGUAGE_LABELS: Record<SupportedLanguage, { label: string; short: string }> = {
  hinglish: { label: 'Hinglish', short: 'Hinglish' },
  hi: { label: 'हिन्दी (Hindi)', short: 'हिन्दी' },
  en: { label: 'English', short: 'ENG' },
  ta: { label: 'தமிழ் (Tamil)', short: 'தமிழ்' },
  te: { label: 'తెలుగు (Telugu)', short: 'తెలుగు' },
  kn: { label: 'ಕನ್ನಡ (Kannada)', short: 'ಕನ್ನಡ' },
};

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenApiKeyModal,
  onOpenEmergencyModal,
  onOpenWelfareDrawer,
  onResetChat,
  hasApiKey,
  isSpeaking,
  onStopSpeaking
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-saathi-waDark text-white px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-md z-30 sticky top-0">
      {/* Brand & Companion Info */}
      <div className="flex items-center space-x-2.5 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center text-lg sm:text-xl shadow-inner font-bold text-white select-none">
            सा
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-saathi-waDark rounded-full"></span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5">
            <h1 className="font-bold text-base sm:text-lg tracking-wide leading-tight truncate">
              Saathi <span className="font-normal opacity-90 text-sm sm:text-base">(साथी)</span>
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-emerald-200 flex items-center space-x-1 truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Online • साथी AI</span>
          </p>
        </div>
      </div>

      {/* Action Controls & Utilities (Clean & Uncrowded) */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
        {/* Active Audio Speaking Indicator */}
        {isSpeaking && (
          <button
            onClick={onStopSpeaking}
            aria-label="Stop audio speech"
            className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold px-2 py-1 rounded-full animate-bounce transition-all shadow"
            title="Click to stop voice playback"
          >
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[10px]">रुकें</span>
          </button>
        )}

        {/* Emergency SOS Button (Always directly accessible for safety) */}
        <button
          onClick={onOpenEmergencyModal}
          className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center space-x-1 shadow-sm transition-transform border border-red-500"
          title="Emergency Road & Police Helpline (112, 108)"
          aria-label="Emergency SOS Helpline"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-white" />
          <span className="font-bold tracking-wider">SOS</span>
        </button>

        {/* Compact Language Selector Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => {
              setIsLangOpen(!isLangOpen);
              setIsMenuOpen(false);
            }}
            className="bg-emerald-900/80 hover:bg-emerald-800 text-white text-xs px-2.5 py-1.5 rounded-lg border border-emerald-700 flex items-center space-x-1 transition-colors"
            title="Switch Language"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-medium text-[11px] sm:text-xs">{LANGUAGE_LABELS[language]?.short || 'Lang'}</span>
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 text-slate-800 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                भाषा (Language)
              </div>
              {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((langKey) => (
                <button
                  key={langKey}
                  onClick={() => {
                    onLanguageChange(langKey);
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                    language === langKey ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>{LANGUAGE_LABELS[langKey].label}</span>
                  {language === langKey && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3-Dots Menu (Consolidates Welfare, Settings & Reset into a sleek popover) */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsLangOpen(false);
            }}
            className="text-emerald-200 hover:text-white p-1.5 hover:bg-emerald-800/80 rounded-lg transition-colors"
            title="More Options"
            aria-label="More Options Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-slate-800 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Welfare Schemes & Rights */}
              <button
                onClick={() => {
                  onOpenWelfareDrawer();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 flex items-center space-x-2.5 hover:bg-slate-50 transition-colors"
              >
                <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">योजनाएं &amp; Rights</div>
                  <div className="text-[10px] text-slate-500">e-Shram, Bima &amp; Safety rules</div>
                </div>
              </button>

              {/* Gemini API Key Setting */}
              <button
                onClick={() => {
                  onOpenApiKeyModal();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 flex items-center space-x-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
              >
                <Key className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 flex items-center justify-between">
                    <span>AI Engine Settings</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      hasApiKey ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {hasApiKey ? 'Gemini 2.5' : 'Demo'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">API Key &amp; Offline mode</div>
                </div>
              </button>

              {/* Reset Conversation */}
              <button
                onClick={() => {
                  onResetChat();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 flex items-center space-x-2.5 hover:bg-red-50 text-slate-700 hover:text-red-700 transition-colors border-t border-slate-100"
              >
                <RotateCcw className="w-4 h-4 text-slate-400 hover:text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">Reset Conversation</div>
                  <div className="text-[10px] text-slate-400">Restart Golden Path demo</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

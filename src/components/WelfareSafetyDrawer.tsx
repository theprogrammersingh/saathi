import React from 'react';
import { X, Shield, ExternalLink, HeartPulse, CheckSquare, Clock, Volume2 } from 'lucide-react';
import { WELFARE_SCHEMES } from '../data/mockPresets';
import { WelfareScheme } from '../types';
import { SpeechService } from '../services/speechService';

interface WelfareSafetyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScheme?: (scheme: WelfareScheme) => void;
}

export const WelfareSafetyDrawer: React.FC<WelfareSafetyDrawerProps> = ({
  isOpen,
  onClose,
  onSelectScheme
}) => {
  if (!isOpen) return null;

  const handleSpeakScheme = (s: WelfareScheme) => {
    SpeechService.speak(`${s.hindiName}: ${s.coverage}. Patrata: ${s.eligibility}. Aavedan: ${s.howToApply}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welfare-drawer-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end"
    >
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="bg-saathi-waDark text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-300" />
            <div>
              <h2 id="welfare-drawer-title" className="font-bold text-base">
                Welfare Schemes &amp; Safety Advisor
              </h2>
              <p className="text-xs text-emerald-200">
                Sarkari Yojanaayein &amp; Gig Worker Rights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="text-emerald-200 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety & Fatigue Advice Banner */}
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-amber-800">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Night Shift &amp; Road Safety Rules</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900">
            🛵 <strong>15-Minute Rest Rule:</strong> Har 2 ghante driving ke baad ruk kar paani piyein aur aankhon ko aaram dein. Rain &amp; night shift me platform timer ki wajah se overspeeding na karein!
          </p>
        </div>

        {/* Schemes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Available Welfare Schemes For Gig Workers
          </div>

          {WELFARE_SCHEMES.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-slate-50 hover:bg-slate-100/80 rounded-xl p-3.5 border border-slate-200 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{scheme.hindiName}</h3>
                  <div className="text-xs text-slate-500">{scheme.name}</div>
                </div>
                <button
                  onClick={() => handleSpeakScheme(scheme)}
                  className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-md transition-colors"
                  title="Listen in Hindi"
                  aria-label={`Listen to details of ${scheme.hindiName}`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Coverage Highlight */}
              <div className="bg-emerald-50 text-emerald-900 p-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-emerald-200">
                <HeartPulse className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{scheme.coverage}</span>
              </div>

              {/* Eligibility & Documents */}
              <div className="space-y-1 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">Kaun apply kar sakta hai:</span> {scheme.eligibility}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Kaise apply karein:</span> {scheme.howToApply}
                </div>
              </div>

              {/* Required Documents */}
              <div className="pt-1">
                <div className="text-[11px] font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <CheckSquare className="w-3 h-3 text-slate-500" />
                  <span>Zaroori Dastavez (Documents):</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {scheme.documentsNeeded.map((doc, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex items-center justify-between">
                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-saathi-waLight hover:text-saathi-waDark font-semibold flex items-center space-x-1"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                {onSelectScheme && (
                  <button
                    onClick={() => {
                      onSelectScheme(scheme);
                      onClose();
                    }}
                    className="bg-saathi-waDark text-white text-xs px-2.5 py-1 rounded-lg font-medium hover:bg-emerald-900 transition-colors"
                  >
                    Chat me puchein
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500">
          State Labour Welfare Boards &amp; Ministry of Labour &amp; Employment, Govt. of India
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Copy, Check, FileText, ShieldCheck, Volume2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GrievanceDraft } from '../types';
import { formatINR, copyToClipboard } from '../utils/helpers';
import { SpeechService } from '../services/speechService';

interface GrievanceModalProps {
  grievance: GrievanceDraft | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmitted?: () => void;
}

export const GrievanceModal: React.FC<GrievanceModalProps> = ({
  grievance,
  isOpen,
  onClose,
  onConfirmSubmitted
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'letter' | 'hinglish'>('letter');

  if (!isOpen || !grievance) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(grievance.formalText);
    if (success) {
      setCopied(true);
      SpeechService.playChime('success');

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      setTimeout(() => setCopied(false), 3000);
      if (onConfirmSubmitted) {
        onConfirmSubmitted();
      }
    }
  };

  const handleSpeakSummary = () => {
    SpeechService.speak(`Bhai, is appeal me likha hai ki: ${grievance.simplifiedHinglish}. Total claim amount ${grievance.claimAmount} rupaye hai.`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="grievance-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-saathi-waDark text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-800 rounded-lg">
              <FileText className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 id="grievance-modal-title" className="font-bold text-base sm:text-lg">
                1-Click Grievance Appeal Draft
              </h2>
              <p className="text-xs text-emerald-200">
                Ready for {grievance.platform} Partner Support Chat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-emerald-200 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Claim Amount & Policy Banner */}
        <div className="bg-amber-50 px-4 py-3 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-amber-800 font-medium">Refund Claim:</span>
            <span className="text-base font-bold text-red-600">{formatINR(grievance.claimAmount)}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 bg-white px-2.5 py-1 rounded-full border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate max-w-[170px] sm:max-w-[220px]">{grievance.policyReference}</span>
          </div>
        </div>

        {/* Tab Toggle: Formal English Letter vs Worker Hinglish Summary */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('letter')}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition-colors ${
              activeTab === 'letter'
                ? 'border-saathi-waLight text-saathi-waDark bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Formal English Letter (Company Ke Liye)
          </button>
          <button
            onClick={() => setActiveTab('hinglish')}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition-colors flex items-center justify-center space-x-1.5 ${
              activeTab === 'hinglish'
                ? 'border-saathi-waLight text-saathi-waDark bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Hinglish Summary (Aapke Samajhne Ke Liye)</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 overflow-y-auto flex-1 text-slate-800 text-xs sm:text-sm">
          {activeTab === 'letter' ? (
            <div className="space-y-3">
              <div className="font-semibold text-slate-900 bg-slate-100 p-2 rounded-lg border border-slate-200 text-xs">
                {grievance.subject}
              </div>
              <div className="whitespace-pre-line font-mono text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 select-all">
                {grievance.formalText}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <span className="text-xs font-semibold text-emerald-800">
                  Aapke paksh ki aasan bhasha me samjh:
                </span>
                <button
                  onClick={handleSpeakSummary}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2 py-1 rounded-md flex items-center space-x-1 transition-colors"
                  aria-label="Listen to summary"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>सुनो</span>
                </button>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                {grievance.simplifiedHinglish}
              </div>

              {grievance.keyPoints && grievance.keyPoints.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800">Mukhya Saboot (Key Evidences):</div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    {grievance.keyPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Copy karke <strong>{grievance.platform} Partner App</strong> ke Help/Ticket section me paste karein.
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-saathi-waLight hover:bg-saathi-waDark text-white active:scale-95'
              }`}
              aria-label="Copy Formal Letter"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied! (Paste In Partner Chat)</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>1-Click Copy Appeal Letter</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2.5 text-xs text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 font-medium transition-colors"
            >
              Band Karein
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { AlertCircle, CheckCircle2, FileText, ArrowRight, Volume2 } from 'lucide-react';
import { PayoutAnalysis } from '../types';
import { formatINR } from '../utils/helpers';
import { SpeechService } from '../services/speechService';

interface PayoutCardProps {
  analysis: PayoutAnalysis;
  onDraftGrievance: () => void;
}

export const PayoutCard: React.FC<PayoutCardProps> = ({
  analysis,
  onDraftGrievance
}) => {
  const hasUnfairDeductions = analysis.deductions.some(d => d.isUnfair);

  const handleSpeakSummary = () => {
    const speechText = `Bhai, aapka gross earnings ${analysis.grossEarnings} rupaye tha, aur net payout ${analysis.netPayout} rupaye hai. ${
      hasUnfairDeductions ? `Isme se ${analysis.unfairTotal} rupaye ki penalty galat tarike se kaati gayi hai. Kya dispute appeal draft karein?` : ''
    }`;
    SpeechService.speak(speechText);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden my-2 max-w-sm sm:max-w-md">
      {/* Platform & Header */}
      <div className="bg-slate-900 text-white px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm tracking-wide">{analysis.platform} Daily Payout</span>
          {analysis.workerName && (
            <span className="text-[11px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
              {analysis.workerName}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleSpeakSummary}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 p-1 rounded-md transition-colors flex items-center space-x-1"
            title="Listen to breakdown in voice"
            aria-label="Listen to breakdown"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">सुनो</span>
          </button>
          <span className="text-xs text-slate-400">{analysis.date}</span>
        </div>
      </div>

      {/* Earnings Overview Grid */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-2">
        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Gross Earnings</div>
          <div className="text-lg font-bold text-slate-800">{formatINR(analysis.grossEarnings)}</div>
        </div>
        <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
          <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Net Bank Payout</div>
          <div className="text-lg font-bold text-emerald-700">{formatINR(analysis.netPayout)}</div>
        </div>
      </div>

      {/* Deductions Breakdown */}
      <div className="p-3.5 space-y-2">
        <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
          <span>Deductions & Penalties Applied</span>
          {hasUnfairDeductions && (
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Unfair Penalty Found</span>
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {analysis.deductions.map((ded) => (
            <div
              key={ded.id}
              className={`p-2.5 rounded-lg border text-xs flex items-start justify-between ${
                ded.isUnfair
                  ? 'bg-red-50/80 border-red-200 text-red-900'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <div className="space-y-0.5 max-w-[75%]">
                <div className="font-semibold flex items-center space-x-1.5">
                  <span>{ded.reason}</span>
                  {ded.isUnfair && (
                    <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                      DISPUTABLE
                    </span>
                  )}
                </div>
                {ded.orderId && (
                  <div className="text-[11px] text-slate-500">Order #{ded.orderId}</div>
                )}
                <div className="text-[10px] text-slate-500 italic">{ded.suggestedRemedy}</div>
              </div>
              <div className="font-bold text-sm text-right text-red-600">
                - {formatINR(ded.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unfair Penalty Action Callout */}
      {hasUnfairDeductions ? (
        <div className="p-3 bg-amber-50 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-xs text-amber-900">
            <span className="font-bold text-red-600">{formatINR(analysis.unfairTotal)}</span> refund claimable under weather & merchant wait guidelines.
          </div>
          <button
            onClick={onDraftGrievance}
            className="w-full sm:w-auto bg-saathi-waLight hover:bg-saathi-waDark text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center justify-center space-x-1.5 shadow transition-all active:scale-95"
            aria-label="Draft Grievance Dispute"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1-Click Dispute Draft</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-2.5 bg-emerald-50 border-t border-emerald-200 text-emerald-800 text-xs flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>All deductions appear to match standard statutory rates. No dispute needed.</span>
        </div>
      )}
    </div>
  );
};

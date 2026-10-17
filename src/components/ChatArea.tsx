import React, { useRef, useEffect } from 'react';
import { Volume2, VolumeX, Shield, FileText, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { ChatMessage, GrievanceDraft, PayoutAnalysis } from '../types';
import { PayoutCard } from './PayoutCard';
import { FormattedMessage } from './FormattedMessage';
import { formatTime } from '../utils/helpers';

interface ChatAreaProps {
  messages: ChatMessage[];
  onDraftGrievance: (payout: PayoutAnalysis) => void;
  onOpenGrievanceModal: (grievance: GrievanceDraft) => void;
  onQuickAction: (action: string, payload?: any) => void;
  onOpenWelfareDrawer: () => void;
  isSpeaking: boolean;
  speakingMessageId: string | null;
  onSpeakMessage: (id: string, text: string) => void;
  onStopSpeaking: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onDraftGrievance,
  onOpenGrievanceModal,
  onQuickAction,
  onOpenWelfareDrawer,
  isSpeaking,
  speakingMessageId,
  onSpeakMessage,
  onStopSpeaking
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      role="log"
      aria-label="Conversation with Saathi"
      aria-live="polite"
      className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 chat-bg-pattern min-h-0"
    >
      {/* Welcome Banner if fresh conversation */}
      {messages.length === 0 && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm max-w-lg mx-auto text-center space-y-3 my-6 animate-in fade-in duration-300">
          <div className="w-12 h-12 bg-saathi-waLight text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-md">
            सा
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              नमस्ते साथी! (Welcome to Saathi)
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Main Zomato, Swiggy, Uber, Blinkit gig workers ka AI dost hoon. Screenshot bhejo ya bol kar pucho — main penalties check karunga aur company ke liye refund appeal draft kar dunga!
            </p>
          </div>

          {/* Golden Path 3-Step Walkthrough */}
          <div className="grid grid-cols-3 gap-2 text-left pt-2 text-[11px]">
            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-800 block text-xs">1. Payout Scan</span>
              <span className="text-slate-600">Screenshot bhejo, unfair deduction pehchanein.</span>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span className="font-bold text-amber-800 block text-xs">2. Dispute Letter</span>
              <span className="text-slate-600">Company support ke liye 1-click appeal.</span>
            </div>
            <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
              <span className="font-bold text-blue-800 block text-xs">3. Safety &amp; Rights</span>
              <span className="text-slate-600">e-Shram card bima aur raat ki safety.</span>
            </div>
          </div>
        </div>
      )}

      {/* Message Bubbles */}
      {messages.map((msg) => {
        const isUser = msg.sender === 'user';
        const isCurrentSpeaking = isSpeaking && speakingMessageId === msg.id;

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} my-1.5`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs sm:text-sm relative break-words ${
                isUser
                  ? 'bg-saathi-waChatBubbleMe text-slate-900 rounded-tr-none border border-emerald-200'
                  : 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
              }`}
            >
              {/* Optional Uploaded Image Preview */}
              {msg.imageUrl && (
                <div className="mb-2 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                  <img
                    src={msg.imageUrl}
                    alt="Payout slip"
                    className="max-h-60 w-full object-contain"
                  />
                </div>
              )}

              {/* Message Text with clean human-readable formatting */}
              <FormattedMessage text={msg.text} />

              {/* Embedded Payout Analysis Card if present */}
              {msg.payoutAnalysis && (
                <PayoutCard
                  analysis={msg.payoutAnalysis}
                  onDraftGrievance={() => onDraftGrievance(msg.payoutAnalysis!)}
                />
              )}

              {/* Embedded Grievance Ready Card if present */}
              {msg.grievanceDraft && (
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 my-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <span>{msg.grievanceDraft.platform} Dispute Letter Ready!</span>
                    </span>
                    <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Refund Claim: ₹{msg.grievanceDraft.claimAmount}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-800">
                    {msg.grievanceDraft.simplifiedHinglish}
                  </p>

                  <button
                    onClick={() => onOpenGrievanceModal(msg.grievanceDraft!)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow transition-all active:scale-95"
                  >
                    <span>View &amp; 1-Click Copy Appeal Letter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Welfare Scheme suggestions pill cards */}
              {msg.welfareSuggestions && msg.welfareSuggestions.length > 0 && (
                <div className="bg-blue-50/80 rounded-xl p-2.5 border border-blue-200 my-2 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="flex items-center space-x-1">
                      <Shield className="w-3.5 h-3.5 text-blue-700" />
                      <span>Sarkari Welfare &amp; Bima Schemes:</span>
                    </span>
                    <button
                      onClick={onOpenWelfareDrawer}
                      className="text-[10px] text-blue-700 hover:underline font-semibold"
                    >
                      Sabhi dekhein →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {msg.welfareSuggestions.slice(0, 2).map((scheme) => (
                      <div
                        key={scheme.id}
                        onClick={onOpenWelfareDrawer}
                        className="bg-white p-2 rounded-lg border border-blue-200 text-left hover:border-blue-400 cursor-pointer transition-colors"
                      >
                        <div className="font-bold text-slate-800 text-[11px]">{scheme.hindiName}</div>
                        <div className="text-[10px] text-slate-500 truncate">{scheme.coverage}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Action Chips attached to message */}
              {msg.quickActions && msg.quickActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                  {msg.quickActions.map((qa, idx) => (
                    <button
                      key={idx}
                      onClick={() => onQuickAction(qa.action, qa.payload)}
                      className="bg-saathi-waLight/10 hover:bg-saathi-waLight/25 text-saathi-waDark font-semibold text-xs px-2.5 py-1 rounded-full border border-saathi-waLight/30 flex items-center space-x-1 transition-all active:scale-95"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>{qa.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Bubble Footer: Timestamp & Audio Speak Button */}
              <div className="flex items-center justify-end space-x-2 mt-1.5 pt-0.5">
                {!isUser && (
                  <button
                    onClick={() =>
                      isCurrentSpeaking
                        ? onStopSpeaking()
                        : onSpeakMessage(msg.id, msg.text)
                    }
                    className={`text-[10px] flex items-center space-x-0.5 px-1.5 py-0.5 rounded transition-colors ${
                      isCurrentSpeaking
                        ? 'bg-amber-100 text-amber-800 font-bold'
                        : 'text-slate-500 hover:text-saathi-waDark hover:bg-slate-100'
                    }`}
                    title={isCurrentSpeaking ? 'Stop listening' : 'Listen in Hindi'}
                    aria-label={isCurrentSpeaking ? 'Stop voice playback' : 'Listen to message in voice'}
                  >
                    {isCurrentSpeaking ? (
                      <>
                        <VolumeX className="w-3 h-3 text-amber-600 animate-pulse" />
                        <span>रुकें</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-emerald-600" />
                        <span>सुनो</span>
                      </>
                    )}
                  </button>
                )}
                <span className="text-[10px] text-slate-400">
                  {formatTime(msg.timestamp)}
                </span>
                {isUser && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 inline ml-0.5" />
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};

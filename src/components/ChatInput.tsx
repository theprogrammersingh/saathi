import React, { useState, useRef } from 'react';
import { Mic, MicOff, Image, Send, Sparkles, Loader2 } from 'lucide-react';
import { SpeechService } from '../services/speechService';

interface ChatInputProps {
  onSendMessage: (text: string, imageBase64?: string) => void;
  onSelectPreset: (presetId: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSelectPreset,
  isLoading
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stopListeningRef = useRef<(() => void) | null>(null);

  // Handle Send Text or Image
  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;
    onSendMessage(inputText.trim(), selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Toggle Voice Input (Speech to Text)
  const toggleRecording = () => {
    if (isRecording) {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setIsRecording(false);
      setRecordingStatus(null);
      SpeechService.stopListening();
    } else {
      setIsRecording(true);
      setRecordingStatus('Bolye bhai... (Listening in Hindi/Hinglish)');
      SpeechService.playChime('pop');

      const stopFn = SpeechService.startListening(
        (transcript) => {
          setInputText(transcript);
        },
        (error) => {
          setRecordingStatus(error);
          setTimeout(() => {
            setIsRecording(false);
            setRecordingStatus(null);
          }, 3000);
        },
        () => {
          setIsRecording(false);
          setRecordingStatus(null);
        },
        'hi-IN'
      );
      stopListeningRef.current = stopFn;
    }
  };

  // Handle Image File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      if (!inputText) {
        setInputText('Mera is payout screenshot ka breakdown check karo aur dekho koi galat penalty lagi hai kya?');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-100 border-t border-slate-300 p-2 sm:p-3 space-y-2 sticky bottom-0 z-20">
      {/* Quick Demo Preset Chips for 1-Click Golden Path testing */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Quick Demo:</span>
        </span>
        <button
          onClick={() => onSelectPreset('golden_path_zomato')}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-2.5 py-1 rounded-full flex-shrink-0 flex items-center space-x-1 transition-colors shadow-sm text-xs"
        >
          <span>⚡ Zomato ₹500 Penalty (Golden Path)</span>
        </button>
        <button
          onClick={() => onSelectPreset('swiggy_cancellation')}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-2.5 py-1 rounded-full flex-shrink-0 flex items-center space-x-1 transition-colors shadow-sm text-xs"
        >
          <span>🛵 Swiggy ₹350 Fine</span>
        </button>
        <button
          onClick={() => onSelectPreset('uber_fare_clawback')}
          className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-2.5 py-1 rounded-full flex-shrink-0 flex items-center space-x-1 transition-colors shadow-sm text-xs"
        >
          <span>🚕 Uber ₹280 Clawback</span>
        </button>
        <button
          onClick={() => onSendMessage('Mujhe e-Shram card aur sarkari welfare schemes ke bare me batao.')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-2.5 py-1 rounded-full flex-shrink-0 flex items-center space-x-1 transition-colors shadow-sm text-xs"
        >
          <span>🇮🇳 e-Shram &amp; Bima</span>
        </button>
      </div>

      {/* Selected Image Preview Pill */}
      {selectedImage && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-lg p-2 text-xs">
          <div className="flex items-center space-x-2">
            <img src={selectedImage} alt="Payout preview" className="w-10 h-10 object-cover rounded border" />
            <span className="font-semibold text-emerald-900">Payout screenshot attached (Ready to scan)</span>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="text-red-500 hover:text-red-700 font-bold px-2 py-1"
            aria-label="Remove attached image"
          >
            ✕
          </button>
        </div>
      )}

      {/* Recording Status Bar */}
      {isRecording && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <span className="font-semibold">{recordingStatus}</span>
        </div>
      )}

      {/* Bottom Bar Input Controls */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="payout-image-upload"
        />

        {/* Upload Image Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-2 sm:p-2.5 text-slate-600 hover:text-saathi-waDark hover:bg-slate-200 rounded-full transition-colors flex-shrink-0"
          title="Upload Daily Payout Screenshot"
          aria-label="Upload Screenshot"
        >
          <Image className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={
              isRecording
                ? 'Bolye, main sun raha hoon...'
                : 'Pucho: "Mera 500 rupaye penalty kyu laga?" ya photo bhejo...'
            }
            className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-saathi-waLight shadow-inner"
            aria-label="Chat input message"
          />
        </div>

        {/* Voice Recording Mic Button */}
        <button
          onClick={toggleRecording}
          disabled={isLoading}
          className={`p-2.5 rounded-full text-white transition-all shadow flex-shrink-0 ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 animate-pulse-ring'
              : 'bg-saathi-waLight hover:bg-saathi-waDark'
          }`}
          title={isRecording ? 'Stop Recording' : 'Hold / Click to speak Hindi/Hinglish'}
          aria-label={isRecording ? 'Stop Voice Recording' : 'Start Voice Recording'}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={(!inputText.trim() && !selectedImage) || isLoading}
          className={`p-2.5 rounded-full text-white transition-colors shadow flex-shrink-0 ${
            (!inputText.trim() && !selectedImage) || isLoading
              ? 'bg-slate-400 cursor-not-allowed opacity-60'
              : 'bg-saathi-waGreen hover:bg-emerald-600 active:scale-95'
          }`}
          title="Send message"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

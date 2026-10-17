import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { GrievanceModal } from './components/GrievanceModal';
import { WelfareSafetyDrawer } from './components/WelfareSafetyDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { EmergencyModal } from './components/EmergencyModal';
import { ChatMessage, SupportedLanguage, GrievanceDraft, PayoutAnalysis } from './types';
import { GeminiService } from './services/geminiService';
import { SpeechService } from './services/speechService';
import { DEMO_PRESETS, SAMPLE_PAYOUT_IMAGES, WELFARE_SCHEMES } from './data/mockPresets';

export const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [language, setLanguage] = useState<SupportedLanguage>('hinglish');
  const [hasApiKey, setHasApiKey] = useState<boolean>(!!GeminiService.getApiKey());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals & Drawers state
  const [isGrievanceModalOpen, setIsGrievanceModalOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceDraft | null>(null);
  const [isWelfareDrawerOpen, setIsWelfareDrawerOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Initialize with initial warm welcome message
  useEffect(() => {
    initDefaultWelcome();
  }, [language]);

  const initDefaultWelcome = () => {
    const welcomeMsg: ChatMessage = {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      text: `Namaste bhai! Main **Saathi (साथी)** hoon — aapka gig worker companion aur advocate. 

Apna daily payout screenshot bhejo ya mic par bolo — main penalties check karunga aur company ke liye **refund dispute letter** draft kar dunga.`,
      quickActions: [
        { label: '⚡ Demo: Zomato ₹500 Penalty Scan', action: 'preset_zomato' },
        { label: '🛵 Demo: Swiggy ₹350 Fine', action: 'preset_swiggy' },
        { label: '🛡️ e-Shram & Sarkari Bima', action: 'check_welfare' }
      ]
    };
    setMessages([welcomeMsg]);
  };

  // Reset conversation to initial state
  const handleResetChat = () => {
    SpeechService.stopSpeaking();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
    initDefaultWelcome();
    SpeechService.playChime('pop');
  };

  // Handle Text-to-Speech speaking of message
  const handleSpeakMessage = (id: string, text: string) => {
    setSpeakingMessageId(id);
    setIsSpeaking(true);
    SpeechService.speak(text, () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    });
  };

  const handleStopSpeaking = () => {
    SpeechService.stopSpeaking();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  };

  // Handle Preset selection (Triggers the Golden Path instantly)
  const handleSelectPreset = async (presetId: string) => {
    const preset = DEMO_PRESETS.find(p => p.id === presetId) || DEMO_PRESETS[0];
    const imageSvg = SAMPLE_PAYOUT_IMAGES[preset.imageKey];

    // 1. Add user message with screenshot & voice prompt
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      text: preset.userPromptText,
      imageUrl: imageSvg
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    SpeechService.playChime('pop');

    // Simulate realistic AI vision processing latency
    setTimeout(async () => {
      const { analysis, explanationText, suggestedGrievance, welfareAdvice } =
        await GeminiService.analyzePayoutScreenshot(imageSvg, preset.userPromptText, language);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        text: explanationText,
        payoutAnalysis: analysis,
        grievanceDraft: suggestedGrievance,
        welfareSuggestions: welfareAdvice,
        quickActions: [
          {
            label: '📝 Haan, Dispute Letter Draft Karo',
            action: 'confirm_draft_grievance',
            payload: analysis
          },
          {
            label: '🛡️ Gig Worker Rights & Welfare',
            action: 'check_welfare'
          }
        ]
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);
      SpeechService.playChime('alert');

      // Auto-speak the summary for accessibility
      handleSpeakMessage(assistantMsg.id, explanationText);
    }, 600);
  };

  // Handle regular chat send (Text + optional uploaded screenshot)
  const handleSendMessage = async (text: string, imageBase64?: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      text,
      imageUrl: imageBase64
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    SpeechService.playChime('pop');

    try {
      if (imageBase64) {
        // If image uploaded, analyze as payout screenshot
        const { analysis, explanationText, suggestedGrievance, welfareAdvice } =
          await GeminiService.analyzePayoutScreenshot(imageBase64, text, language);

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          text: explanationText,
          payoutAnalysis: analysis,
          grievanceDraft: suggestedGrievance,
          welfareSuggestions: welfareAdvice,
          quickActions: [
            {
              label: '📝 Haan, Dispute Appeal Draft Karo',
              action: 'confirm_draft_grievance',
              payload: analysis
            },
            {
              label: '🛡️ Sarkari Welfare Check',
              action: 'check_welfare'
            }
          ]
        };

        setMessages(prev => [...prev, assistantMsg]);
        handleSpeakMessage(assistantMsg.id, explanationText);
      } else {
        // General query processing
        const chatHistory = messages.map(m => ({
          role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          text: m.text
        }));

        const result = await GeminiService.processChatResponse(text, chatHistory, language);

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          text: result.reply,
          grievanceDraft: result.suggestedGrievance,
          welfareSuggestions: result.suggestedWelfare,
          quickActions: result.suggestedGrievance
            ? [
                {
                  label: '📋 View Formal Appeal Letter',
                  action: 'view_grievance',
                  payload: result.suggestedGrievance
                },
                {
                  label: '🛡️ e-Shram Insurance Benefits',
                  action: 'check_welfare'
                }
              ]
            : [
                {
                  label: '⚡ Zomato ₹500 Golden Path',
                  action: 'preset_zomato'
                },
                {
                  label: '🛵 Swiggy ₹350 Fine',
                  action: 'preset_swiggy'
                }
              ]
        };

        setMessages(prev => [...prev, assistantMsg]);
        handleSpeakMessage(assistantMsg.id, result.reply);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        text: `Bhai, kuch dikkat aayi hai: ${err.message || 'Network error'}. Kripya dobara try karein ya Demo preset button dabayein.`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Quick Action Clicks
  const handleQuickAction = (action: string, payload?: any) => {
    SpeechService.playChime('pop');
    if (action === 'preset_zomato') {
      handleSelectPreset('golden_path_zomato');
    } else if (action === 'preset_swiggy') {
      handleSelectPreset('swiggy_cancellation');
    } else if (action === 'check_welfare') {
      setIsWelfareDrawerOpen(true);
    } else if (action === 'view_grievance') {
      if (payload) {
        setSelectedGrievance(payload);
        setIsGrievanceModalOpen(true);
      }
    } else if (action === 'confirm_draft_grievance') {
      // Step 2 & 3 of Golden Path: User confirms -> Draft grievance + Proactive welfare
      const payout = payload as PayoutAnalysis;
      const unfairDed = payout?.deductions?.find(d => d.isUnfair) || payout?.deductions?.[0];
      const claimAmount = payout?.unfairTotal || unfairDed?.amount || 500;

      GeminiService.draftGrievanceLetter({
        platform: payout?.platform || 'Zomato',
        orderId: unfairDed?.orderId || '4920',
        amount: claimAmount,
        reason: unfairDed?.reason || 'Customer delay complaint',
        workerNotes: 'Barish aur kitchen delay ki vajah se hua, rider ki galti nahi thi.',
        lang: language
      }).then(draft => {
        setSelectedGrievance(draft);
        setIsGrievanceModalOpen(true);

        // Add proactive Step 3 message into chat
        const proactiveMsg: ChatMessage = {
          id: `assistant-step3-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          text: `✅ **Bhai, aapka ₹${claimAmount} refund claim letter ready hai!** (Modal khul gaya hai, wahan se 1-Click Copy kar sakte hain).\n\n🛵 **Proactive Safety & Rights Alert:**\nAap late night shifts karte hain. Barish me har 2 ghante par 15-minute ka break lena zaroori hai. Saath hi, kya aapko pata hai ki aap **e-Shram card** ke tehat **₹2 Lakh ke accident insurance** ke haqdaar hain?`,
          grievanceDraft: draft,
          welfareSuggestions: [WELFARE_SCHEMES[0], WELFARE_SCHEMES[2]],
          quickActions: [
            { label: '📋 Open Grievance Letter Again', action: 'view_grievance', payload: draft },
            { label: '🛡️ e-Shram Registration Guidance', action: 'check_welfare' }
          ]
        };
        setMessages(prev => [...prev, proactiveMsg]);
      });
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-slate-900 shadow-2xl relative overflow-hidden">
      {/* App Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenWelfareDrawer={() => setIsWelfareDrawerOpen(true)}
        onResetChat={handleResetChat}
        hasApiKey={hasApiKey}
        isSpeaking={isSpeaking}
        onStopSpeaking={handleStopSpeaking}
      />

      {/* Main WhatsApp-style Chat Area */}
      <ChatArea
        messages={messages}
        onDraftGrievance={(payout) => handleQuickAction('confirm_draft_grievance', payout)}
        onOpenGrievanceModal={(grievance) => {
          setSelectedGrievance(grievance);
          setIsGrievanceModalOpen(true);
        }}
        onQuickAction={handleQuickAction}
        onOpenWelfareDrawer={() => setIsWelfareDrawerOpen(true)}
        isSpeaking={isSpeaking}
        speakingMessageId={speakingMessageId}
        onSpeakMessage={handleSpeakMessage}
        onStopSpeaking={handleStopSpeaking}
      />

      {/* Bottom Bar: Input, Speech, Camera, Quick Chips */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onSelectPreset={handleSelectPreset}
        isLoading={isLoading}
      />

      {/* Grievance Drafting & 1-Click Copy Modal */}
      <GrievanceModal
        isOpen={isGrievanceModalOpen}
        grievance={selectedGrievance}
        onClose={() => setIsGrievanceModalOpen(false)}
      />

      {/* Welfare Schemes & Safety Drawer */}
      <WelfareSafetyDrawer
        isOpen={isWelfareDrawerOpen}
        onClose={() => setIsWelfareDrawerOpen(false)}
        onSelectScheme={(scheme) => {
          handleSendMessage(`Mujhe ${scheme.hindiName} (${scheme.name}) ke bare me detail se batao.`);
        }}
      />

      {/* Gemini API Key Setting Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(hasKey) => setHasApiKey(hasKey)}
      />

      {/* Emergency Road Assistance SOS Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
};

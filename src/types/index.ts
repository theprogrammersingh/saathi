export type SupportedLanguage = 'hinglish' | 'hi' | 'en' | 'ta' | 'te' | 'kn';

export type GigPlatform = 
  | 'Zomato' 
  | 'Swiggy' 
  | 'Uber' 
  | 'Ola' 
  | 'Blinkit' 
  | 'Zepto' 
  | 'Porter' 
  | 'Urban Company' 
  | 'General';

export interface DeductionItem {
  id: string;
  type: 'penalty' | 'cancellation' | 'delay' | 'rating' | 'platform_fee' | 'cash_collected' | 'other';
  amount: number;
  reason: string;
  orderId?: string;
  isUnfair: boolean;
  suggestedRemedy: string;
}

export interface PayoutAnalysis {
  platform: GigPlatform;
  date: string;
  workerName?: string;
  totalTrips?: number;
  grossEarnings: number;
  deductions: DeductionItem[];
  netPayout: number;
  summary: string;
  unfairTotal: number;
  recommendedAction: string;
}

export interface GrievanceDraft {
  id: string;
  platform: GigPlatform;
  orderId?: string;
  date: string;
  subject: string;
  formalText: string;
  simplifiedHinglish: string;
  policyReference: string;
  claimAmount: number;
  keyPoints: string[];
  status: 'draft' | 'copied' | 'submitted';
}

export interface WelfareScheme {
  id: string;
  name: string;
  hindiName: string;
  category: 'health' | 'accident' | 'welfare_board' | 'pension';
  coverage: string;
  eligibility: string;
  howToApply: string;
  documentsNeeded: string[];
  officialPortalUrl: string;
}

export interface QuickAction {
  label: string;
  action: 
    | 'draft_grievance' 
    | 'confirm_draft_grievance' 
    | 'view_grievance' 
    | 'check_welfare' 
    | 'explain_deduction' 
    | 'safety_tips' 
    | 'preset_zomato' 
    | 'preset_swiggy' 
    | 'preset_uber' 
    | 'custom'
    | string;
  payload?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string; // ISO string for easy serialization & testing
  text: string;
  audioUrl?: string;
  imageUrl?: string;
  payoutAnalysis?: PayoutAnalysis;
  grievanceDraft?: GrievanceDraft;
  welfareSuggestions?: WelfareScheme[];
  quickActions?: QuickAction[];
}

export interface WorkerProfile {
  name: string;
  primaryPlatform: GigPlatform;
  city: string;
  language: SupportedLanguage;
  nightShiftWorker: boolean;
  hasEShram: boolean;
  hasAyushmanBharat: boolean;
}

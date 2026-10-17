import { PayoutAnalysis, GrievanceDraft, WelfareScheme, GigPlatform } from '../types';

// SVG Data URLs for realistic platform payout screenshots
export const SAMPLE_PAYOUT_IMAGES = {
  zomato: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520" fill="none">
    <rect width="400" height="520" rx="16" fill="%23FFFFFF"/>
    <rect width="400" height="75" fill="%23CB202D"/>
    <text x="20" y="38" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="bold">zomato delivery partner</text>
    <text x="20" y="60" fill="%23FEE2E2" font-family="Arial, sans-serif" font-size="12">Daily Payout Summary • 16 Oct 2024</text>
    <rect x="20" y="95" width="360" height="85" rx="12" fill="%23F9FAFB" stroke="%23E5E7EB"/>
    <text x="36" y="125" fill="%236B7280" font-family="Arial, sans-serif" font-size="12">Gross Trip Earnings (14 Orders)</text>
    <text x="36" y="155" fill="%23111827" font-family="Arial, sans-serif" font-size="22" font-weight="bold">₹ 1,750.00</text>
    <rect x="20" y="195" width="360" height="150" rx="12" fill="%23FEF2F2" stroke="%23FECACA"/>
    <text x="36" y="222" fill="%23991B1B" font-family="Arial, sans-serif" font-size="13" font-weight="bold">Deductions &amp; Penalties Applied</text>
    <text x="36" y="248" fill="%23B91C1C" font-family="Arial, sans-serif" font-size="12">Order #4920 - Unfair Delay Penalty</text>
    <text x="310" y="248" fill="%23B91C1C" font-family="Arial, sans-serif" font-size="13" font-weight="bold">- ₹ 500.00</text>
    <text x="36" y="272" fill="%236B7280" font-family="Arial, sans-serif" font-size="11">Reason: Customer reported food cold / delayed</text>
    <text x="36" y="296" fill="%234B5563" font-family="Arial, sans-serif" font-size="12">Platform Service Fee (TDS &amp; Ops)</text>
    <text x="325" y="296" fill="%234B5563" font-family="Arial, sans-serif" font-size="12">- ₹ 45.00</text>
    <line x1="36" y1="312" x2="364" y2="312" stroke="%23FCA5A5" stroke-dasharray="4 4"/>
    <text x="36" y="332" fill="%23991B1B" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Total Deductions</text>
    <text x="310" y="332" fill="%23991B1B" font-family="Arial, sans-serif" font-size="13" font-weight="bold">- ₹ 545.00</text>
    <rect x="20" y="360" width="360" height="80" rx="12" fill="%23ECFDF5" stroke="%23A7F3D0"/>
    <text x="36" y="390" fill="%23065F46" font-family="Arial, sans-serif" font-size="12">Net Settled to Bank Account</text>
    <text x="36" y="422" fill="%23065F46" font-family="Arial, sans-serif" font-size="24" font-weight="bold">₹ 1,205.00</text>
    <text x="20" y="475" fill="%239CA3AF" font-family="Arial, sans-serif" font-size="11">Partner ID: ZOM-89211 • Rider: Rajesh Kumar</text>
    <text x="20" y="495" fill="%23DC2626" font-family="Arial, sans-serif" font-size="11">⚠️ Note: Heavy rain reported during order #4920</text>
  </svg>`,

  swiggy: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520" fill="none">
    <rect width="400" height="520" rx="16" fill="%23FFFFFF"/>
    <rect width="400" height="75" fill="%23FC8019"/>
    <text x="20" y="38" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="bold">SWIGGY Delivery Partner</text>
    <text x="20" y="60" fill="%23FFF7ED" font-family="Arial, sans-serif" font-size="12">Weekly Settlement Statement • Order #SW-1082</text>
    <rect x="20" y="95" width="360" height="85" rx="12" fill="%23F9FAFB" stroke="%23E5E7EB"/>
    <text x="36" y="125" fill="%236B7280" font-family="Arial, sans-serif" font-size="12">Weekly Total Earnings</text>
    <text x="36" y="155" fill="%23111827" font-family="Arial, sans-serif" font-size="22" font-weight="bold">₹ 4,320.00</text>
    <rect x="20" y="195" width="360" height="150" rx="12" fill="%23FEF2F2" stroke="%23FECACA"/>
    <text x="36" y="222" fill="%23991B1B" font-family="Arial, sans-serif" font-size="13" font-weight="bold">Deductions Applied</text>
    <text x="36" y="248" fill="%23B91C1C" font-family="Arial, sans-serif" font-size="12">Order Cancellation Fine (SW-1082)</text>
    <text x="310" y="248" fill="%23B91C1C" font-family="Arial, sans-serif" font-size="13" font-weight="bold">- ₹ 350.00</text>
    <text x="36" y="272" fill="%236B7280" font-family="Arial, sans-serif" font-size="11">Reason: Partner arrived at restaurant after 25 mins</text>
    <text x="36" y="296" fill="%234B5563" font-family="Arial, sans-serif" font-size="12">Insurance &amp; Platform Charge</text>
    <text x="325" y="296" fill="%234B5563" font-family="Arial, sans-serif" font-size="12">- ₹ 60.00</text>
    <line x1="36" y1="312" x2="364" y2="312" stroke="%23FCA5A5" stroke-dasharray="4 4"/>
    <text x="36" y="332" fill="%23991B1B" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Total Deductions</text>
    <text x="310" y="332" fill="%23991B1B" font-family="Arial, sans-serif" font-size="13" font-weight="bold">- ₹ 410.00</text>
    <rect x="20" y="360" width="360" height="80" rx="12" fill="%23ECFDF5" stroke="%23A7F3D0"/>
    <text x="36" y="390" fill="%23065F46" font-family="Arial, sans-serif" font-size="12">Transferred to Bank Account</text>
    <text x="36" y="422" fill="%23065F46" font-family="Arial, sans-serif" font-size="24" font-weight="bold">₹ 3,910.00</text>
    <text x="20" y="475" fill="%239CA3AF" font-family="Arial, sans-serif" font-size="11">Partner ID: SWG-44120 • Rider: Amit Verma</text>
    <text x="20" y="495" fill="%23EA580C" font-family="Arial, sans-serif" font-size="11">⚠️ GPS log indicates restaurant kitchen preparation delay</text>
  </svg>`,

  uber: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520" fill="none">
    <rect width="400" height="520" rx="16" fill="%23000000"/>
    <text x="20" y="45" fill="white" font-family="Arial, sans-serif" font-size="22" font-weight="bold">Uber Driver Partner</text>
    <text x="20" y="70" fill="%239CA3AF" font-family="Arial, sans-serif" font-size="12">Trip Fare Adjustment Dispute • Trip #UB-8831</text>
    <rect x="20" y="95" width="360" height="85" rx="12" fill="%231F2937" stroke="%23374151"/>
    <text x="36" y="125" fill="%239CA3AF" font-family="Arial, sans-serif" font-size="12">Original Trip Fare</text>
    <text x="36" y="155" fill="%23FFFFFF" font-family="Arial, sans-serif" font-size="22" font-weight="bold">₹ 680.00</text>
    <rect x="20" y="195" width="360" height="150" rx="12" fill="%23450A0A" stroke="%237F1D1D"/>
    <text x="36" y="222" fill="%23FCA5A5" font-family="Arial, sans-serif" font-size="13" font-weight="bold">Fare Clawback / Passenger Refund</text>
    <text x="36" y="248" fill="%23F87171" font-family="Arial, sans-serif" font-size="12">Rider Route Deviation Claim</text>
    <text x="310" y="248" fill="%23F87171" font-family="Arial, sans-serif" font-size="13" font-weight="bold">- ₹ 280.00</text>
    <text x="36" y="272" fill="%23D1D5DB" font-family="Arial, sans-serif" font-size="11">Reason: Rider claimed inefficient route taken</text>
    <text x="36" y="296" fill="%23D1D5DB" font-family="Arial, sans-serif" font-size="12">Platform Service Fee (20%)</text>
    <text x="325" y="296" fill="%23D1D5DB" font-family="Arial, sans-serif" font-size="12">- ₹ 80.00</text>
    <line x1="36" y1="312" x2="364" y2="312" stroke="%23EF4444" stroke-dasharray="4 4"/>
    <text x="36" y="332" fill="%23FCA5A5" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Total Deducted</text>
    <text x="310" y="332" fill="%23FCA5A5" font-family="Arial, sans-serif" font-size="13" font-weight="bold">- ₹ 360.00</text>
    <rect x="20" y="360" width="360" height="80" rx="12" fill="%23064E3B" stroke="%23059669"/>
    <text x="36" y="390" fill="%23A7F3D0" font-family="Arial, sans-serif" font-size="12">Final Driver Share</text>
    <text x="36" y="422" fill="%2334D399" font-family="Arial, sans-serif" font-size="24" font-weight="bold">₹ 320.00</text>
    <text x="20" y="475" fill="%239CA3AF" font-family="Arial, sans-serif" font-size="11">Driver: Gurpreet Singh • Vehicle: DL 1TA 4492</text>
    <text x="20" y="495" fill="%23FBBF24" font-family="Arial, sans-serif" font-size="11">ℹ️ Google Maps showed police barricade diversion on main road</text>
  </svg>`
};

// Preset Welfare Schemes
export const WELFARE_SCHEMES: WelfareScheme[] = [
  {
    id: 'eshram',
    name: 'e-Shram Universal Card',
    hindiName: 'ई-श्रम कार्ड योजना',
    category: 'welfare_board',
    coverage: 'Accident insurance upto ₹2,00,000 & direct DBT benefit access',
    eligibility: 'Any unorganized or gig worker aged 16-59 years not in EPFO/ESIC',
    howToApply: 'Upload Aadhaar and bank details on eshram.gov.in or CSC center',
    documentsNeeded: ['Aadhaar Card linked with Mobile', 'Bank Account passbook', 'Gig App Partner ID'],
    officialPortalUrl: 'https://eshram.gov.in'
  },
  {
    id: 'pmjay',
    name: 'Ayushman Bharat (PM-JAY)',
    hindiName: 'आयुष्मान भारत स्वास्थ्य योजना',
    category: 'health',
    coverage: 'Cashless hospital treatment up to ₹5,00,000 per family per year',
    eligibility: 'Informal workers listed in SECC or state gig worker registers',
    howToApply: 'Check eligibility on mera.pmjay.gov.in with ration card or Aadhaar',
    documentsNeeded: ['Aadhaar Card', 'Ration Card / Income Certificate'],
    officialPortalUrl: 'https://mera.pmjay.gov.in'
  },
  {
    id: 'gig_welfare_fund',
    name: 'State Gig Worker Welfare Board',
    hindiName: 'राज्य गिग श्रमिक कल्याण बोर्ड (राजस्थान / कर्नाटक कानून)',
    category: 'welfare_board',
    coverage: 'Fee cess protection, accident compensation & social security fund',
    eligibility: 'All delivery & cab drivers active on Zomato, Swiggy, Uber, Ola, etc.',
    howToApply: 'Automatic via platform aggregator registration or state labour portal',
    documentsNeeded: ['Aggregator App ID / Payout Statement', 'Aadhaar Card', 'Driving License'],
    officialPortalUrl: 'https://labour.rajasthan.gov.in'
  },
  {
    id: 'pmsym',
    name: 'PM Shram Yogi Maan-dhan (PM-SYM)',
    hindiName: 'प्रधानमंत्री श्रम योगी मानधन पेंशन',
    category: 'pension',
    coverage: 'Guaranteed pension of ₹3,000/month after age 60',
    eligibility: 'Monthly income less than ₹15,000 and age 18-40 years',
    howToApply: 'Visit nearest Common Services Centre (CSC) with bank passbook',
    documentsNeeded: ['Aadhaar Card', 'Savings Bank Account (Jan Dhan)'],
    officialPortalUrl: 'https://maandhan.in'
  }
];

// Presets for instant interactive testing
export interface DemoPreset {
  id: string;
  title: string;
  badge: string;
  platform: GigPlatform;
  userPromptText: string;
  imageKey: keyof typeof SAMPLE_PAYOUT_IMAGES;
  audioSimulationText: string;
  analysis: PayoutAnalysis;
  grievance: GrievanceDraft;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'golden_path_zomato',
    title: 'Zomato ₹500 Unfair Late Penalty (The Golden Path)',
    badge: 'Recommended Demo',
    platform: 'Zomato',
    userPromptText: 'Mera 500 rupaye penalty kyu laga? Barish me bike chala raha tha, order cancel nahi kiya.',
    imageKey: 'zomato',
    audioSimulationText: 'Bhai suno, mera 500 rupaye penalty kyu kata? Kal raat bahut barish thi aur restaurant ne khana late diya.',
    analysis: {
      platform: 'Zomato',
      date: '16 Oct 2024',
      workerName: 'Rajesh Kumar (ID: ZOM-89211)',
      totalTrips: 14,
      grossEarnings: 1750,
      deductions: [
        {
          id: 'ded-1',
          type: 'penalty',
          amount: 500,
          reason: 'Customer complaint - Food Cold / Delayed Delivery (Order #4920)',
          orderId: '4920',
          isUnfair: true,
          suggestedRemedy: 'Dispute via Zomato Partner Support under Adverse Weather & Kitchen Delay Clause'
        },
        {
          id: 'ded-2',
          type: 'platform_fee',
          amount: 45,
          reason: 'Standard Platform Tech & TDS fee',
          isUnfair: false,
          suggestedRemedy: 'Standard non-refundable platform operational fee'
        }
      ],
      netPayout: 1205,
      unfairTotal: 500,
      summary: 'Bhai, aapke total earnings ₹1,750 the, lekin Zomato ne Order #4920 par ₹500 penalty kaat li hai. Kyunki kal raat barish thi aur restaurant preparation me time laga tha, yeh penalty 100% UNFAIR hai aur refund ho sakti hai!',
      recommendedAction: 'Dispute appeal draft karke Zomato Partner Support me bhejo.'
    },
    grievance: {
      id: 'grievance-zom-4920',
      platform: 'Zomato',
      orderId: '4920',
      date: '16 Oct 2024',
      claimAmount: 500,
      subject: 'Formal Dispute: Unfair ₹500 Delay Penalty Deduction for Order #4920 (Adverse Weather & Kitchen Delay)',
      formalText: `To: Zomato Partner Escalations / Rider Support Team
From: Rajesh Kumar (Partner ID: ZOM-89211)
Date: 16 October 2024
Subject: Dispute & Full Refund Request for Unfair ₹500 Penalty on Order #4920

Respected Support Team,

I am writing to formally dispute the penalty of INR 500 deducted from my payout dated 16-10-2024 regarding Order #4920.

The delivery delay was caused strictly by circumstances beyond my control:
1. Kitchen Wait Time: I arrived at the restaurant promptly at 21:14 hrs, but the merchant handed over the package 18 minutes late due to order surge.
2. Adverse Weather Conditions: Severe rainfall and waterlogging occurred along the designated route. Riding safely was imperative under Motor Vehicles safety regulations.
3. Customer Communication: The customer was informed via in-app chat regarding waterlogging delays.

As per Zomato Partner Terms and fair compensation guidelines under the Gig Workers Protection framework, delivery partners are not liable for merchant delays or extreme weather disruptions.

I kindly request:
1. Complete reversal and refund of the INR 500 deduction into my registered bank account.
2. Removal of the negative score from my partner performance rating.

Thank you for your prompt attention and support.

Sincerely,
Rajesh Kumar
Partner ID: ZOM-89211
Phone: +91 98765 43210`,
      simplifiedHinglish: `Support team ko bataya gaya hai ki:
1. Restaurant ne khana 18 minute late pack kiya.
2. Bahar tezz barish aur paani bhara hua tha.
3. Aapne customer ko phone karke pehle hi inform kiya tha.
Isliye ₹500 ka pura refund aapke bank account me wapas aana chahiye.`,
      policyReference: 'Zomato Adverse Weather Policy & Fair Partner Protection Norms 2024',
      keyPoints: [
        'Merchant kitchen preparation delay of 18 mins',
        'Severe rainfall and road waterlogging documented',
        'Direct violation of fair penalty norms'
      ],
      status: 'draft'
    }
  },
  {
    id: 'swiggy_cancellation',
    title: 'Swiggy ₹350 Kitchen Wait Cancellation Fine',
    badge: 'Restaurant Delay',
    platform: 'Swiggy',
    userPromptText: 'Swiggy ne order cancel hone par ₹350 kaat liye. Restaurant wale ne 30 minute khana nahi banaya!',
    imageKey: 'swiggy',
    audioSimulationText: 'Bhai Swiggy ne 350 rupaye kaat liye jabki restaurant wale ne aadha ghanta khada rakha tha.',
    analysis: {
      platform: 'Swiggy',
      date: '15 Oct 2024',
      workerName: 'Amit Verma (ID: SWG-44120)',
      totalTrips: 28,
      grossEarnings: 4320,
      deductions: [
        {
          id: 'ded-sw-1',
          type: 'cancellation',
          amount: 350,
          reason: 'Order SW-1082 Cancelled after wait',
          orderId: 'SW-1082',
          isUnfair: true,
          suggestedRemedy: 'Appeal citing in-store GPS timestamp log exceeding standard 15-min SLA'
        },
        {
          id: 'ded-sw-2',
          type: 'platform_fee',
          amount: 60,
          reason: 'Insurance & partner platform fee',
          isUnfair: false,
          suggestedRemedy: 'Standard deduction'
        }
      ],
      netPayout: 3910,
      unfairTotal: 350,
      summary: 'Aapke weekly payout se ₹350 "Delivery Partner Cancellation" ke naam par kate hain. GPS log dikhata hai ki aap 25 minute restaurant pe wait kar rahe the. Yeh deduction 100% dispute karne layak hai!',
      recommendedAction: 'GPS timestamp verify karwa ke refund appeal file karo.'
    },
    grievance: {
      id: 'grievance-sw-1082',
      platform: 'Swiggy',
      orderId: 'SW-1082',
      date: '15 Oct 2024',
      claimAmount: 350,
      subject: 'Appeal against ₹350 Cancellation Deduction - Order #SW-1082 (Merchant Delay Proof)',
      formalText: `To: Swiggy Partner Helpdesk
From: Amit Verma (Partner ID: SWG-44120)
Subject: Immediate Refund for Erroneous ₹350 Cancellation Deduction (Order #SW-1082)

Dear Swiggy Support,

I am raising this grievance against the ₹350 deduction on Order #SW-1082.

Key Facts:
- I reached the restaurant within 6 minutes of order acceptance (verified by GPS).
- The merchant delayed order preparation by over 25 minutes.
- When reported via the partner app chat, automated cancellation was triggered instead of merchant reallocation.

Penalizing the delivery executive for merchant-side turnaround delay contradicts Swiggy Partner Code of Conduct. Please credit ₹350 back to my floating balance within 24 hours.

Regards,
Amit Verma (SWG-44120)`,
      simplifiedHinglish: 'GPS proof ke sath claim kiya hai ki aap time pe restaurant pahuch gaye the, galti dukan wale ki thi. ₹350 wapas milna chahiye.',
      policyReference: 'Swiggy Merchant SLA & Wait Time Compensation Guidelines',
      keyPoints: ['Reached merchant on time', 'Wait time exceeded 25 mins', 'Merchant delayed handover'],
      status: 'draft'
    }
  },
  {
    id: 'uber_fare_clawback',
    title: 'Uber Driver ₹280 Inefficient Route Dispute',
    badge: 'Cab / Auto Driver',
    platform: 'Uber',
    userPromptText: 'Uber ne ₹280 fare adjustment kaat liya bolke ki lamba route liya, jabki main road police ne band ki thi!',
    imageKey: 'uber',
    audioSimulationText: 'Bhai Uber ne 280 rupaye kaat liye. Sawari bol rahi hai lamba rasta liya, jabki aage VIP movement aur police barricade tha!',
    analysis: {
      platform: 'Uber',
      date: '16 Oct 2024',
      workerName: 'Gurpreet Singh (DL 1TA 4492)',
      totalTrips: 1,
      grossEarnings: 680,
      deductions: [
        {
          id: 'ded-ub-1',
          type: 'rating',
          amount: 280,
          reason: 'Rider Fare Adjustment - Route Inefficiency Claim (Trip #UB-8831)',
          orderId: 'UB-8831',
          isUnfair: true,
          suggestedRemedy: 'Contest route adjustment with traffic advisory / road closure citation'
        },
        {
          id: 'ded-ub-2',
          type: 'platform_fee',
          amount: 80,
          reason: 'Uber platform fee (20%)',
          isUnfair: false,
          suggestedRemedy: 'Platform commission'
        }
      ],
      netPayout: 320,
      unfairTotal: 280,
      summary: 'Passenger ne galat complaint ki ki aapne lambe raste se gaadi chalaayi. Par aage police barricading thi. Is wajah se aapka ₹280 fare kaat liya gaya.',
      recommendedAction: 'Uber Greenlight hub / in-app dispute me barricade diversion ka appeal bhejo.'
    },
    grievance: {
      id: 'grievance-ub-8831',
      platform: 'Uber',
      orderId: 'UB-8831',
      date: '16 Oct 2024',
      claimAmount: 280,
      subject: 'Dispute Fare Review Clawback of ₹280 on Trip #UB-8831 - Traffic Police Diversion',
      formalText: `To: Uber Driver Operations & Dispute Cell
From: Gurpreet Singh (Vehicle: DL 1TA 4492)
Date: 16 Oct 2024
Subject: Contest of ₹280 Fare Adjustment Clawback - Trip #UB-8831

Dear Uber Operations,

I write to contest the INR 280 fare reduction applied retroactively to Trip #UB-8831.

The detour was necessitated by Delhi Traffic Police official road closure and VIP security barricading on Ring Road. The alternate route taken was the fastest legally permissible bypass indicated on live GPS. The rider was verbally appraised before taking the flyover.

Penalizing drivers for following lawful police traffic diversions is contrary to safety guidelines. Kindly reverse the ₹280 deduction immediately.

Best regards,
Gurpreet Singh`,
      simplifiedHinglish: 'Traffic police ki barricading ki vajah se rasta badalna pada tha. Passenger ki complaint galat hai, ₹280 ka clawback refund hona chahiye.',
      policyReference: 'Motor Vehicles Traffic Regulation & Uber Driver Fairness Policy',
      keyPoints: ['Police diversion barricades on primary route', 'Safety first compliance', 'Rider verbally informed'],
      status: 'draft'
    }
  }
];

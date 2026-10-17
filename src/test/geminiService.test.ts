import { describe, it, expect, beforeEach } from 'vitest';
import { GeminiService } from '../services/geminiService';
import { SAMPLE_PAYOUT_IMAGES } from '../data/mockPresets';

describe('GeminiService & Golden Path Workflow', () => {
  beforeEach(() => {
    GeminiService.clearApiKey();
  });

  it('correctly analyzes Zomato payout screenshot and flags ₹500 unfair penalty', async () => {
    const result = await GeminiService.analyzePayoutScreenshot(
      SAMPLE_PAYOUT_IMAGES.zomato,
      'Mera 500 rupaye penalty kyu laga? Barish me bike chala raha tha.'
    );

    expect(result.analysis.platform).toBe('Zomato');
    expect(result.analysis.grossEarnings).toBe(1750);
    expect(result.analysis.netPayout).toBe(1205);
    expect(result.analysis.unfairTotal).toBe(500);

    // Verify unfair penalty was flagged in deductions
    const unfairDed = result.analysis.deductions.find(d => d.isUnfair);
    expect(unfairDed).toBeDefined();
    expect(unfairDed?.amount).toBe(500);
    expect(unfairDed?.orderId).toBe('4920');

    // Verify suggested grievance draft is generated
    expect(result.suggestedGrievance).toBeDefined();
    expect(result.suggestedGrievance?.claimAmount).toBe(500);
    expect(result.suggestedGrievance?.formalText).toContain('INR 500');
  });

  it('correctly drafts formal grievance appeal letter citing partner policies', async () => {
    const draft = await GeminiService.draftGrievanceLetter({
      platform: 'Zomato',
      orderId: '4920',
      amount: 500,
      reason: 'Customer delay complaint',
      workerNotes: 'Kitchen wait was 18 mins and road was waterlogged'
    });

    expect(draft.platform).toBe('Zomato');
    expect(draft.claimAmount).toBe(500);
    expect(draft.subject).toContain('₹500');
    expect(draft.formalText).toContain('Zomato');
    expect(draft.simplifiedHinglish).toBeDefined();
    expect(draft.status).toBe('draft');
  });

  it('transitions to welfare & safety advice when user confirms dispute draft', async () => {
    const result = await GeminiService.processChatResponse(
      'Haan bhai, dispute draft kar do',
      []
    );

    expect(result.reply).toContain('dispute letter');
    expect(result.reply).toContain('e-Shram');
    expect(result.suggestedGrievance).toBeDefined();
    expect(result.suggestedWelfare).toBeDefined();
    expect(result.suggestedWelfare?.length).toBeGreaterThan(0);
  });

  it('provides welfare schemes when user asks about e-Shram or insurance', async () => {
    const result = await GeminiService.processChatResponse(
      'Mujhe e-shram card ke fayde batao',
      []
    );

    expect(result.reply).toContain('e-Shram');
    expect(result.reply).toContain('2,00,000');
    expect(result.suggestedWelfare).toBeDefined();
  });
});

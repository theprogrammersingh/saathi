import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PayoutCard } from '../components/PayoutCard';
import { GrievanceModal } from '../components/GrievanceModal';
import { DEMO_PRESETS } from '../data/mockPresets';

describe('UI Components', () => {
  it('renders PayoutCard with gross earnings, net payout, and unfair penalty alert', () => {
    const preset = DEMO_PRESETS[0];
    const onDraft = vi.fn();

    render(<PayoutCard analysis={preset.analysis} onDraftGrievance={onDraft} />);

    expect(screen.getByText('Zomato Daily Payout')).toBeInTheDocument();
    expect(screen.getByText('Unfair Penalty Found')).toBeInTheDocument();
    expect(screen.getByText('Order #4920')).toBeInTheDocument();
    expect(screen.getByText('1-Click Dispute Draft')).toBeInTheDocument();

    // Click draft button
    fireEvent.click(screen.getByText('1-Click Dispute Draft'));
    expect(onDraft).toHaveBeenCalledTimes(1);
  });

  it('renders GrievanceModal with formal letter and copy button', () => {
    const preset = DEMO_PRESETS[0];
    const onClose = vi.fn();

    render(
      <GrievanceModal
        isOpen={true}
        grievance={preset.grievance}
        onClose={onClose}
      />
    );

    expect(screen.getByText('1-Click Grievance Appeal Draft')).toBeInTheDocument();
    expect(screen.getByText('1-Click Copy Appeal Letter')).toBeInTheDocument();
    expect(screen.getByText('Hinglish Summary (Aapke Samajhne Ke Liye)')).toBeInTheDocument();

    // Switch to Hinglish summary tab
    fireEvent.click(screen.getByText('Hinglish Summary (Aapke Samajhne Ke Liye)'));
    expect(screen.getByText(/Support team ko bataya gaya hai ki/i)).toBeInTheDocument();
  });
});

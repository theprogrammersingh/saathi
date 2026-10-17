import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormattedMessage } from '../components/FormattedMessage';

describe('FormattedMessage Component', () => {
  it('renders bold text and currency highlights without raw markdown asterisks', () => {
    const rawText = 'Aapka payout **₹1,750** tha aur net amount **₹1,205** hai.';
    render(<FormattedMessage text={rawText} />);

    // Bold text should be rendered properly
    expect(screen.getByText('₹1,750')).toBeInTheDocument();
    expect(screen.getByText('₹1,205')).toBeInTheDocument();
    // Raw asterisks should NOT be present in rendered text
    expect(screen.queryByText(/\*\*₹1,750\*\*/)).not.toBeInTheDocument();
  });

  it('renders styled penalty callout for penalty lines', () => {
    const rawText = '❌ **Bada Jhatka (Penalty):** Zomato ne ₹500 kaat liye hain.';
    render(<FormattedMessage text={rawText} />);

    expect(screen.getByText(/Zomato ne/i)).toBeInTheDocument();
    expect(screen.queryByText(/❌/)).toBeInTheDocument();
  });

  it('renders structured bullet points cleanly', () => {
    const rawText = 'Top schemes:\n• e-Shram Card bima\n• PM-JAY Ayushman Bharat';
    render(<FormattedMessage text={rawText} />);

    expect(screen.getByText(/e-Shram Card bima/i)).toBeInTheDocument();
    expect(screen.getByText(/PM-JAY Ayushman Bharat/i)).toBeInTheDocument();
  });
});

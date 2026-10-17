import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../components/Header';

describe('Header Component', () => {
  it('renders uncrowded header with brand, SOS button, language pill, and 3-dots menu', () => {
    const onLang = vi.fn();
    const onEmergency = vi.fn();
    const onWelfare = vi.fn();
    const onApi = vi.fn();
    const onReset = vi.fn();
    const onStopSpeak = vi.fn();

    render(
      <Header
        language="hinglish"
        onLanguageChange={onLang}
        onOpenApiKeyModal={onApi}
        onOpenEmergencyModal={onEmergency}
        onOpenWelfareDrawer={onWelfare}
        onResetChat={onReset}
        hasApiKey={false}
        isSpeaking={false}
        onStopSpeaking={onStopSpeak}
      />
    );

    // Title and emergency SOS must be visible
    expect(screen.getByText('Saathi')).toBeInTheDocument();
    expect(screen.getByText('SOS')).toBeInTheDocument();

    // Click SOS
    fireEvent.click(screen.getByText('SOS'));
    expect(onEmergency).toHaveBeenCalledTimes(1);

    // 3-dots menu opens options
    const moreBtn = screen.getByLabelText('More Options Menu');
    fireEvent.click(moreBtn);

    expect(screen.getByText('योजनाएं & Rights')).toBeInTheDocument();
    expect(screen.getByText('AI Engine Settings')).toBeInTheDocument();
    expect(screen.getByText('Reset Conversation')).toBeInTheDocument();

    // Click Welfare in menu
    fireEvent.click(screen.getByText('योजनाएं & Rights'));
    expect(onWelfare).toHaveBeenCalledTimes(1);
  });
});

import { describe, it, expect } from 'vitest';
import { formatINR, maskSensitiveData, sanitizeText } from '../utils/helpers';

describe('Helper Utilities', () => {
  it('formats INR currency correctly', () => {
    const formatted = formatINR(1750);
    expect(formatted).toContain('1,750');
    expect(formatted).toContain('₹');
  });

  it('masks Aadhaar 12-digit number for worker privacy', () => {
    const input = 'My Aadhaar is 1234 5678 9012 and phone is 9876543210';
    const masked = maskSensitiveData(input);
    expect(masked).toContain('XXXX-XXXX-9012');
    expect(masked).toContain('98765XXXXX');
  });

  it('sanitizes malicious script tags to prevent XSS attacks', () => {
    const malicious = '<script>alert("hacked")</script>';
    const sanitized = sanitizeText(malicious);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('&lt;script&gt;');
  });
});

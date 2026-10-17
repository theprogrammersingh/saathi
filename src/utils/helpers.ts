/**
 * Format a number into Indian Rupee currency format (e.g., ₹1,500.00)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Format timestamp into conversational time (e.g. 10:45 AM)
 */
export function formatTime(isoStringOrDate: string | Date): string {
  try {
    const d = typeof isoStringOrDate === 'string' ? new Date(isoStringOrDate) : isoStringOrDate;
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (_) {
    return 'Just now';
  }
}

/**
 * Mask PII (Personal Identifiable Information) such as Aadhaar and Phone numbers
 * To ensure safe practices and worker data privacy
 */
export function maskSensitiveData(input: string): string {
  if (!input) return '';
  // Mask 12 digit Aadhaar numbers: 1234 5678 9012 -> XXXX XXXX 9012
  let sanitized = input.replace(/\b(\d{4})[\s-](\d{4})[\s-](\d{4})\b/g, 'XXXX-XXXX-$3');
  // Mask 10-digit mobile numbers: 9876543210 -> 98765XXXXX
  sanitized = sanitized.replace(/\b(\d{5})(\d{5})\b/g, '$1XXXXX');
  return sanitized;
}

/**
 * Sanitize text to avoid common vulnerabilities (XSS safe text normalization)
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Copy text safely to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

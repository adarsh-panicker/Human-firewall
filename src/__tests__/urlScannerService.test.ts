import { describe, it, expect } from 'vitest';
import { scanUrl } from '../services/urlScannerService';

describe('Website & Link Trust Scanner', () => {
  it('identifies authentic verified brand domains as safe', async () => {
    const res = await scanUrl('https://www.chase.com');
    expect(res.verdict).toBe('safe');
    expect(res.trustScore).toBeGreaterThanOrEqual(90);
    expect(res.isAuthenticBrandDomain).toBe(true);
    expect(res.detectedBrand).toBe('Chase Bank');
    expect(res.rootDomain).toBe('chase.com');
  });

  it('detects deceptive subdomain prepending attacks', async () => {
    const res = await scanUrl('https://chase.com.security-alert-verify.net/auth/login');
    expect(res.verdict).toBe('critical');
    expect(res.trustScore).toBeLessThan(50);
    expect(res.isAuthenticBrandDomain).toBe(false);
    expect(res.rootDomain).toBe('security-alert-verify.net');
    expect(res.redFlags.some(f => f.includes('Brand Impersonation'))).toBe(true);
  });

  it('detects typosquatting and character substitution tricks', async () => {
    const res = await scanUrl('https://tikt0k-trending-clip.co/watch?id=499');
    expect(res.verdict).toBe('critical');
    expect(res.redFlags.some(f => f.includes('Typosquatting'))).toBe(true);
    expect(res.detectedBrand).toBe('TikTok');
  });

  it('flags unencrypted plaintext HTTP and high-risk TLDs', async () => {
    const res = await scanUrl('http://netflix-billing-update.cc/account/verify');
    expect(res.protocol).toBe('http');
    expect(res.verdict).toBe('critical');
    expect(res.redFlags.some(f => f.includes('Unencrypted connection'))).toBe(true);
    expect(res.redFlags.some(f => f.includes('.cc'))).toBe(true);
  });

  it('flags raw IP address hosts', async () => {
    const res = await scanUrl('http://185.220.101.44:8080/auth/login');
    expect(res.verdict).toBe('critical');
    expect(res.redFlags.some(f => f.includes('raw numerical IP address'))).toBe(true);
  });

  it('handles malformed inputs gracefully without throwing', async () => {
    const res = await scanUrl('not-a-valid:url:::');
    expect(res).toBeDefined();
    expect(res.verdict).toBe('critical');
    expect(res.safetyAdvice.length).toBeGreaterThan(0);
  });
});

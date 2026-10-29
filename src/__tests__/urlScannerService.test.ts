import { describe, it, expect } from 'vitest';
import { scanUrl } from '../services/urlScannerService';

describe('Website & Link Trust Scanner', () => {
  it('identifies authentic verified brand domains as safe and returns real portal links', () => {
    const res = scanUrl('https://www.chase.com');
    expect(res.verdict).toBe('safe');
    expect(res.trustScore).toBeGreaterThanOrEqual(90);
    expect(res.isAuthenticBrandDomain).toBe(true);
    expect(res.detectedBrand).toBe('Chase Bank');
    expect(res.rootDomain).toBe('chase.com');
    expect(res.authenticAlternativeUrls?.length).toBeGreaterThan(0);
  });

  it('identifies official USPS tracking link as safe', () => {
    const res = scanUrl('https://tools.usps.com/go/TrackConfirmAction_input');
    expect(res.verdict).toBe('safe');
    expect(res.trustScore).toBeGreaterThanOrEqual(95);
    expect(res.detectedBrand).toBe('USPS (US Postal Service)');
  });

  it('detects deceptive subdomain prepending and suggests real Chase link', () => {
    const res = scanUrl('https://chase.com.security-alert-verify.net/auth/login');
    expect(res.verdict).toBe('critical');
    expect(res.trustScore).toBeLessThan(50);
    expect(res.isAuthenticBrandDomain).toBe(false);
    expect(res.rootDomain).toBe('security-alert-verify.net');
    expect(res.redFlags.some(f => f.includes('Brand Impersonation'))).toBe(true);
    // Provides safe authentic alternative links
    expect(res.authenticAlternativeUrls?.length).toBeGreaterThan(0);
    expect(res.authenticAlternativeUrls?.[0].url).toContain('chase.com');
  });

  it('detects typosquatting and character substitution tricks', () => {
    const res = scanUrl('https://tikt0k-trending-clip.co/watch?id=499');
    expect(res.verdict).toBe('critical');
    expect(res.redFlags.some(f => f.includes('Typosquatting'))).toBe(true);
    expect(res.detectedBrand).toBe('TikTok');
  });

  it('flags unencrypted plaintext HTTP and high-risk TLDs', () => {
    const res = scanUrl('http://netflix-billing-update.cc/account/verify');
    expect(res.protocol).toBe('http');
    expect(res.verdict).toBe('critical');
    expect(res.redFlags.some(f => f.includes('Unencrypted connection'))).toBe(true);
    expect(res.redFlags.some(f => f.includes('.cc'))).toBe(true);
    expect(res.authenticAlternativeUrls?.[0].url).toContain('netflix.com');
  });

  it('flags raw IP address hosts', () => {
    const res = scanUrl('http://185.220.101.44:8080/auth/login');
    expect(res.verdict).toBe('critical');
    expect(res.redFlags.some(f => f.includes('raw numerical IP address'))).toBe(true);
  });

  it('handles malformed inputs gracefully without throwing', () => {
    const res = scanUrl('not-a-valid:url:::');
    expect(res).toBeDefined();
    expect(res.verdict).toBe('critical');
    expect(res.safetyAdvice.length).toBeGreaterThan(0);
  });
});

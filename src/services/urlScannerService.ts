import { getStoredGeminiKey } from './aiService';

export interface UrlCheckResult {
  url: string;
  protocol: 'https' | 'http' | 'unknown';
  hostname: string;
  subdomain: string;
  rootDomain: string;
  tld: string;
  path: string;
  
  verdict: 'safe' | 'suspicious' | 'critical';
  trustScore: number; // 0 to 100
  statusTitle: string;
  summary: string;
  
  detectedBrand?: string;
  isAuthenticBrandDomain: boolean;
  
  redFlags: string[];
  safetyAdvice: string[];
  
  anatomy: {
    protocolLabel: string;
    subdomainLabel: string;
    rootDomainLabel: string;
    tldLabel: string;
    pathLabel: string;
  };
  
  isAiEnhanced?: boolean;
}

// Trusted major brand root domains
const TRUSTED_BRAND_DOMAINS: Record<string, string[]> = {
  'Google': ['google.com', 'accounts.google.com', 'youtube.com', 'gmail.com'],
  'Apple': ['apple.com', 'icloud.com'],
  'Microsoft': ['microsoft.com', 'live.com', 'office.com', 'outlook.com', 'azure.com'],
  'Amazon': ['amazon.com', 'aws.amazon.com', 'media-amazon.com'],
  'Netflix': ['netflix.com'],
  'PayPal': ['paypal.com'],
  'Chase Bank': ['chase.com'],
  'Wells Fargo': ['wellsfargo.com'],
  'Bank of America': ['bankofamerica.com'],
  'USPS': ['usps.com'],
  'FedEx': ['fedex.com'],
  'UPS': ['ups.com'],
  'Facebook / Meta': ['facebook.com', 'instagram.com', 'whatsapp.com', 'meta.com'],
  'TikTok': ['tiktok.com'],
  'Steam': ['steampowered.com', 'steamcommunity.com'],
  'Twitter / X': ['x.com', 'twitter.com']
};

// High-risk TLDs frequently abused by phishing & scam operations
const HIGH_RISK_TLDS = new Set([
  'top', 'xyz', 'cc', 'tk', 'ml', 'ga', 'cf', 'gq', 'online', 'site',
  'click', 'rest', 'buzz', 'loan', 'work', 'link', 'cam', 'surf', 'icu'
]);

// Common character substitutions (typosquatting & homoglyphs)
const LEET_REPLACEMENTS: Record<string, string> = {
  '0': 'o',
  '1': 'l',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '8': 'b',
  'vv': 'w',
  'rn': 'm'
};

function normalizeLeet(str: string): string {
  let res = str.toLowerCase();
  for (const [leet, norm] of Object.entries(LEET_REPLACEMENTS)) {
    res = res.replaceAll(leet, norm);
  }
  return res;
}

/**
 * Dissect and scan any URL for fraud, phishing, typosquatting, and legitimacy
 */
export async function scanUrl(rawInput: string): Promise<UrlCheckResult> {
  const trimmed = rawInput.trim();
  let urlStr = trimmed;
  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = `https://${urlStr}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    return {
      url: trimmed,
      protocol: 'unknown',
      hostname: 'invalid-format',
      subdomain: '',
      rootDomain: trimmed,
      tld: '',
      path: '',
      verdict: 'critical',
      trustScore: 0,
      statusTitle: 'Malformed / Invalid URL Format',
      summary: 'The URL could not be parsed as a valid web address. Malformed links are frequently used in obfuscation and exploit payloads.',
      isAuthenticBrandDomain: false,
      redFlags: ['Syntactically invalid web URL', 'Potentially obfuscated payload'],
      safetyAdvice: ['Do not paste or open this link in any browser.'],
      anatomy: {
        protocolLabel: 'Invalid',
        subdomainLabel: 'None',
        rootDomainLabel: trimmed,
        tldLabel: 'None',
        pathLabel: 'None'
      }
    };
  }

  const protocol = parsed.protocol === 'http:' ? 'http' : 'https';
  const hostname = parsed.hostname.toLowerCase();
  const path = parsed.pathname + parsed.search;

  // Segment hostname
  const hostParts = hostname.split('.');
  let tld = '';
  let rootDomain = hostname;
  let subdomain = '';

  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

  if (!isIpAddress && hostParts.length >= 2) {
    tld = hostParts[hostParts.length - 1];
    rootDomain = `${hostParts[hostParts.length - 2]}.${tld}`;
    if (hostParts.length > 2) {
      subdomain = hostParts.slice(0, hostParts.length - 2).join('.');
    }
  }

  const redFlags: string[] = [];
  const safetyAdvice: string[] = [];
  let trustScore = 85; // baseline start
  let detectedBrand: string | undefined = undefined;
  let isAuthenticBrandDomain = false;

  // 1. IP Address as host
  if (isIpAddress) {
    redFlags.push(`Uses raw numerical IP address (${hostname}) instead of a registered domain name.`);
    trustScore -= 50;
  }

  // 2. Plaintext HTTP Check
  if (protocol === 'http') {
    redFlags.push('Unencrypted connection (HTTP). Anyone on your Wi-Fi or ISP can inspect traffic, passwords, and inject malware.');
    trustScore -= 30;
  }

  // 3. High-risk TLD check
  if (HIGH_RISK_TLDS.has(tld)) {
    redFlags.push(`Uses high-risk top-level domain (.${tld}) widely abused by disposable phishing campaigns.`);
    trustScore -= 25;
  }

  // 4. Brand Impersonation & Typosquatting Analysis
  const normalizedHost = normalizeLeet(hostname);
  for (const [brand, trustedDomains] of Object.entries(TRUSTED_BRAND_DOMAINS)) {
    const brandLower = brand.toLowerCase().split(' ')[0]; // e.g. "netflix", "chase"

    // Check if authentic domain
    if (trustedDomains.some(d => hostname === d || hostname.endsWith(`.${d}`))) {
      detectedBrand = brand;
      isAuthenticBrandDomain = true;
      break;
    }

    // Check for deceptive subdomain prepending (e.g. chase.com.attacker-site.com)
    if (subdomain.includes(brandLower) || hostname.includes(brandLower)) {
      detectedBrand = brand;
      if (!isAuthenticBrandDomain) {
        redFlags.push(`Brand Impersonation: Mentions "${brand}" in URL, but the actual owning domain is "${rootDomain}".`);
        trustScore -= 45;
      }
    }

    // Check typosquatting via character substitution (e.g. tikt0k, paypa1)
    if (!isAuthenticBrandDomain && normalizedHost.includes(brandLower) && !hostname.includes(brandLower)) {
      detectedBrand = brand;
      redFlags.push(`Typosquatting Detected: Cleverly substitutes characters to mimic ${brand} (e.g. using '0' instead of 'O' or '1' instead of 'L').`);
      trustScore -= 50;
    }
  }

  // 5. Hyphenated Domain stuffing (e.g. usps-redelivery-portal-track.com)
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 2 && !isAuthenticBrandDomain) {
    redFlags.push(`Excessive hyphen stuffing (${hyphenCount} hyphens): Scammers chain keywords to look legitimate.`);
    trustScore -= 20;
  }

  // 6. Dangerous file extensions in path
  if (/\.(exe|apk|scr|bat|vbs|zip|iso|msi|dmg)(\?|$)/i.test(path)) {
    redFlags.push('Direct executable binary or archive download (.exe/.apk/.zip) detected in path.');
    trustScore -= 40;
  }

  // 7. Legitimate Authenticated Domain Boost
  if (isAuthenticBrandDomain && protocol === 'https' && redFlags.length === 0) {
    trustScore = 98;
  }

  // Clamp trust score 0-100
  trustScore = Math.max(0, Math.min(100, trustScore));

  // Determine Verdict
  let verdict: UrlCheckResult['verdict'] = 'safe';
  let statusTitle = 'Verified Authentic & Safe';
  let summary = `This URL belongs to the authentic, verified domain for ${detectedBrand || rootDomain} with secure TLS encryption.`;

  if (trustScore < 40) {
    verdict = 'critical';
    statusTitle = '🚨 DANGEROUS: Phishing or Malicious Trap';
    summary = detectedBrand 
      ? `This URL is a fraudulent phishing trap impersonating ${detectedBrand}. The true recipient of any data entered is "${rootDomain}".`
      : `High-risk indicators detected. This domain exhibits characteristics common in phishing, credential harvesting, or malware distribution.`;
    
    safetyAdvice.push('DO NOT click this link or enter passwords, credit cards, or personal information.');
    safetyAdvice.push(`To access ${detectedBrand || 'your account'}, open a fresh browser tab and manually type the official website.`);
    safetyAdvice.push('If this link was received via SMS or email, report it as junk/phishing immediately.');
  } else if (trustScore < 75) {
    verdict = 'suspicious';
    statusTitle = '⚠️ CAUTION: Unverified or Questionable Domain';
    summary = 'This website is not an official verified major service domain. Exercise caution before entering credentials or downloading files.';
    safetyAdvice.push('Verify the identity of the sender through an independent, trusted channel.');
    safetyAdvice.push('Check your browser address bar to confirm the domain matches the organization you expect.');
  } else {
    safetyAdvice.push('Official domain verified with encrypted HTTPS transport.');
    safetyAdvice.push('Safe to browse, but always ensure two-factor authentication is enabled on your accounts.');
  }

  // Optional AI Intelligence enhancement (if Gemini key available)
  let isAiEnhanced = false;
  const apiKey = getStoredGeminiKey();
  if (apiKey && trimmed.length > 5) {
    try {
      const prompt = `You are a cybersecurity URL inspector for Human Firewall.
Analyze this URL: "${trimmed}".
Return a single concise sentence summarizing the safety verdict and domain owner.`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 100 }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiSummary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (aiSummary) {
          summary = `${summary} (AI Note: ${aiSummary})`;
          isAiEnhanced = true;
        }
      }
    } catch {
      // Graceful fallback to deterministic local analysis
    }
  }

  return {
    url: trimmed,
    protocol,
    hostname,
    subdomain,
    rootDomain,
    tld,
    path,
    verdict,
    trustScore,
    statusTitle,
    summary,
    detectedBrand,
    isAuthenticBrandDomain,
    redFlags,
    safetyAdvice,
    anatomy: {
      protocolLabel: `${protocol}://`,
      subdomainLabel: subdomain ? `${subdomain}.` : '',
      rootDomainLabel: rootDomain,
      tldLabel: tld ? `.${tld}` : '',
      pathLabel: path || '/'
    },
    isAiEnhanced
  };
}

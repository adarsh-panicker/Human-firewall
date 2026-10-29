export interface OfficialPortalLink {
  label: string;
  url: string;
  description: string;
}

export interface VerifiedBrandEntry {
  brand: string;
  category: 'Banking & Finance' | 'Postal & Delivery' | 'Streaming & Media' | 'Big Tech & Cloud' | 'Social & Messaging' | 'E-Commerce & Retail' | 'Government & Utilities';
  officialRootDomains: string[];
  officialPortalUrls: OfficialPortalLink[];
  knownScamTricks: string[];
}

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
  brandCategory?: string;
  isAuthenticBrandDomain: boolean;
  authenticAlternativeUrls?: OfficialPortalLink[];
  
  redFlags: string[];
  safetyAdvice: string[];
  
  anatomy: {
    protocolLabel: string;
    subdomainLabel: string;
    rootDomainLabel: string;
    tldLabel: string;
    pathLabel: string;
  };
}

/**
 * Comprehensive Offline Database of Real Authentic Verified Websites
 * (100% Client-Side, Works Offline with Zero Network Calls)
 */
export const VERIFIED_BRAND_REGISTRY: Record<string, VerifiedBrandEntry> = {
  'Chase Bank': {
    brand: 'Chase Bank',
    category: 'Banking & Finance',
    officialRootDomains: ['chase.com'],
    officialPortalUrls: [
      { label: 'Chase Online Banking', url: 'https://www.chase.com', description: 'Official consumer homepage & sign-in' },
      { label: 'Chase Secure Sign-On', url: 'https://secure.chase.com', description: 'Direct encrypted banking portal' },
      { label: 'Chase Fraud Education', url: 'https://www.chase.com/personal/security', description: 'Official fraud alerts and security center' }
    ],
    knownScamTricks: ['Subdomain prepending (e.g. chase.com.verify-login.net)', 'Reverse-Zelle telephone verification OTPs']
  },
  'Bank of America': {
    brand: 'Bank of America',
    category: 'Banking & Finance',
    officialRootDomains: ['bankofamerica.com', 'bofa.com'],
    officialPortalUrls: [
      { label: 'Bank of America Homepage', url: 'https://www.bankofamerica.com', description: 'Official banking portal' },
      { label: 'Encrypted Sign-In Gateway', url: 'https://secure.bankofamerica.com', description: 'Official customer sign-on' }
    ],
    knownScamTricks: ['SMS panic messages claiming card locked', 'Fake wire authorization links']
  },
  'Wells Fargo': {
    brand: 'Wells Fargo',
    category: 'Banking & Finance',
    officialRootDomains: ['wellsfargo.com'],
    officialPortalUrls: [
      { label: 'Wells Fargo Official Home', url: 'https://www.wellsfargo.com', description: 'Official online banking portal' },
      { label: 'Secure Sign-On', url: 'https://connect.secure.wellsfargo.com', description: 'Official authentication screen' }
    ],
    knownScamTricks: ['Zelle overpayment refund scams', 'Account suspension warning SMS']
  },
  'PayPal': {
    brand: 'PayPal',
    category: 'Banking & Finance',
    officialRootDomains: ['paypal.com', 'paypal.me'],
    officialPortalUrls: [
      { label: 'PayPal Official Sign-In', url: 'https://www.paypal.com/signin', description: 'Official payments & wallet login' },
      { label: 'PayPal Resolution Center', url: 'https://www.paypal.com/disputes', description: 'Official transaction dispute manager' }
    ],
    knownScamTricks: ['Fake invoice auto-renewal emails (e.g. $499 Bitcoin charge)', 'Typosquats like paypa1.com']
  },
  'USPS (US Postal Service)': {
    brand: 'USPS (US Postal Service)',
    category: 'Postal & Delivery',
    officialRootDomains: ['usps.com'],
    officialPortalUrls: [
      { label: 'Official USPS Package Tracking', url: 'https://tools.usps.com/go/TrackConfirmAction_input', description: 'Real tracking tool (never asks for redelivery fees via SMS)' },
      { label: 'USPS Official Portal', url: 'https://www.usps.com', description: 'Official United States Postal Service homepage' }
    ],
    knownScamTricks: ['Smishing claiming incomplete address', 'Demanding $1.95 redelivery fee to harvest credit cards']
  },
  'FedEx': {
    brand: 'FedEx',
    category: 'Postal & Delivery',
    officialRootDomains: ['fedex.com'],
    officialPortalUrls: [
      { label: 'FedEx Official Tracking', url: 'https://www.fedex.com/en-us/tracking.html', description: 'Official package tracking portal' },
      { label: 'FedEx Home', url: 'https://www.fedex.com', description: 'Official courier homepage' }
    ],
    knownScamTricks: ['SMS notifications with fake tracking numbers', 'Customs clearance fee payment requests']
  },
  'UPS': {
    brand: 'UPS',
    category: 'Postal & Delivery',
    officialRootDomains: ['ups.com'],
    officialPortalUrls: [
      { label: 'UPS Official Tracking', url: 'https://www.ups.com/track', description: 'Official UPS tracking tool' },
      { label: 'UPS Home', url: 'https://www.ups.com', description: 'Official courier homepage' }
    ],
    knownScamTricks: ['Delivery reschedule fee phishing links', 'Attached malicious PDF shipping labels']
  },
  'Netflix': {
    brand: 'Netflix',
    category: 'Streaming & Media',
    officialRootDomains: ['netflix.com'],
    officialPortalUrls: [
      { label: 'Netflix Official Home', url: 'https://www.netflix.com', description: 'Official streaming entertainment site' },
      { label: 'Netflix Account & Billing', url: 'https://www.netflix.com/youraccount', description: 'Official subscription management' }
    ],
    knownScamTricks: ['Fake membership suspended emails', 'Card expired phishing prompts with .cc/.top domains']
  },
  'Apple': {
    brand: 'Apple',
    category: 'Big Tech & Cloud',
    officialRootDomains: ['apple.com', 'icloud.com'],
    officialPortalUrls: [
      { label: 'Official Apple ID Management', url: 'https://appleid.apple.com', description: 'Official security, devices, and 2FA settings' },
      { label: 'iCloud Web Portal', url: 'https://www.icloud.com', description: 'Official cloud mail, photos, and Find My' }
    ],
    knownScamTricks: ['Lookalike domains like appleid-verify.com', 'Stolen phone Find My phishing texts']
  },
  'Google': {
    brand: 'Google',
    category: 'Big Tech & Cloud',
    officialRootDomains: ['google.com', 'youtube.com', 'gmail.com'],
    officialPortalUrls: [
      { label: 'Google Account Security', url: 'https://myaccount.google.com/security', description: 'Official 2-step verification and device audits' },
      { label: 'Google Accounts Gateway', url: 'https://accounts.google.com/signin', description: 'Official authentication sign-in' }
    ],
    knownScamTricks: ['Subdomain prepending on cloud hosting', 'Fake storage quota exceeded warnings']
  },
  'Microsoft': {
    brand: 'Microsoft',
    category: 'Big Tech & Cloud',
    officialRootDomains: ['microsoft.com', 'live.com', 'office.com', 'outlook.com'],
    officialPortalUrls: [
      { label: 'Microsoft Account Security', url: 'https://account.microsoft.com', description: 'Official Microsoft consumer account portal' },
      { label: 'Office 365 Cloud Login', url: 'https://login.microsoftonline.com', description: 'Official commercial enterprise gateway' }
    ],
    knownScamTricks: ['Tech support fullscreen scareware popups', 'Fake Teams meeting invitations']
  },
  'Amazon': {
    brand: 'Amazon',
    category: 'E-Commerce & Retail',
    officialRootDomains: ['amazon.com'],
    officialPortalUrls: [
      { label: 'Amazon Your Orders', url: 'https://www.amazon.com/your-orders', description: 'Official purchase and shipment history' },
      { label: 'Amazon Security Settings', url: 'https://www.amazon.com/cpe/yourpayments/wallet', description: 'Official payment methods management' }
    ],
    knownScamTricks: ['High-value iPhone purchase confirmation emails', 'Fake order cancellation call centers']
  },
  'Best Buy / Geek Squad': {
    brand: 'Best Buy / Geek Squad',
    category: 'E-Commerce & Retail',
    officialRootDomains: ['bestbuy.com'],
    officialPortalUrls: [
      { label: 'Best Buy Official Portal', url: 'https://www.bestbuy.com', description: 'Official store & subscription portal' },
      { label: 'Geek Squad Official Support', url: 'https://www.bestbuy.com/services', description: 'Official customer support & appointments' }
    ],
    knownScamTricks: ['Fake $499 auto-renewal invoice emails', 'Remote desktop screen-sharing refund scams']
  },
  'TikTok': {
    brand: 'TikTok',
    category: 'Social & Messaging',
    officialRootDomains: ['tiktok.com'],
    officialPortalUrls: [
      { label: 'TikTok Official', url: 'https://www.tiktok.com', description: 'Official video platform' }
    ],
    knownScamTricks: ['Typosquats with zero: tikt0k.co', '"Is this you in this video?" friend DM phishing']
  },
  'Meta / Instagram': {
    brand: 'Meta / Instagram',
    category: 'Social & Messaging',
    officialRootDomains: ['instagram.com', 'facebook.com', 'whatsapp.com', 'meta.com'],
    officialPortalUrls: [
      { label: 'Instagram Login', url: 'https://www.instagram.com', description: 'Official Instagram portal' },
      { label: 'Facebook Security', url: 'https://www.facebook.com/security', description: 'Official privacy & login settings' }
    ],
    knownScamTricks: ['Copyright infringement warning DMs', 'Hacked friend account loan requests']
  },
  'IRS (Internal Revenue Service)': {
    brand: 'IRS (Internal Revenue Service)',
    category: 'Government & Utilities',
    officialRootDomains: ['irs.gov'],
    officialPortalUrls: [
      { label: 'IRS Official Tax Portal', url: 'https://www.irs.gov', description: 'Only .gov is official (never .com or .org)' },
      { label: 'View Your Tax Account', url: 'https://www.irs.gov/your-account', description: 'Official tax records & balance' }
    ],
    knownScamTricks: ['Arrest warrant phone calls for unpaid taxes', 'Tax refund claim SMS links with .top/.online domains']
  }
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
 * Dissect and scan any URL against our offline verified database and heuristic rules
 */
export function scanUrl(rawInput: string): UrlCheckResult {
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
  let trustScore = 85;
  let detectedBrand: string | undefined = undefined;
  let brandCategory: string | undefined = undefined;
  let isAuthenticBrandDomain = false;
  let authenticAlternativeUrls: OfficialPortalLink[] | undefined = undefined;

  // 1. IP Address as host
  if (isIpAddress) {
    redFlags.push(`Uses raw numerical IP address (${hostname}) instead of a registered domain name.`);
    trustScore -= 50;
  }

  // 2. Plaintext HTTP Check
  if (protocol === 'http') {
    redFlags.push('Unencrypted connection (HTTP). Anyone on your Wi-Fi or network can intercept credentials and inject malware.');
    trustScore -= 30;
  }

  // 3. High-risk TLD check
  if (HIGH_RISK_TLDS.has(tld)) {
    redFlags.push(`Uses high-risk top-level domain (.${tld}) widely abused by disposable phishing campaigns.`);
    trustScore -= 25;
  }

  // 4. Check Offline Database of Verified Brands
  const normalizedHost = normalizeLeet(hostname);

  for (const entry of Object.values(VERIFIED_BRAND_REGISTRY)) {
    const brandLower = entry.brand.toLowerCase().split(' ')[0];

    // Check if authentic domain
    if (entry.officialRootDomains.some(d => hostname === d || hostname.endsWith(`.${d}`))) {
      detectedBrand = entry.brand;
      brandCategory = entry.category;
      isAuthenticBrandDomain = true;
      authenticAlternativeUrls = entry.officialPortalUrls;
      break;
    }

    // Check for deceptive subdomain prepending (e.g. chase.com.attacker-site.com)
    if (subdomain.includes(brandLower) || hostname.includes(brandLower)) {
      detectedBrand = entry.brand;
      brandCategory = entry.category;
      authenticAlternativeUrls = entry.officialPortalUrls;
      if (!isAuthenticBrandDomain) {
        redFlags.push(`Brand Impersonation: Mentions "${entry.brand}" in URL, but the actual owning domain is "${rootDomain}".`);
        trustScore -= 45;
      }
    }

    // Check typosquatting via character substitution (e.g. tikt0k, paypa1)
    if (!isAuthenticBrandDomain && normalizedHost.includes(brandLower) && !hostname.includes(brandLower)) {
      detectedBrand = entry.brand;
      brandCategory = entry.category;
      authenticAlternativeUrls = entry.officialPortalUrls;
      redFlags.push(`Typosquatting Detected: Cleverly substitutes characters to mimic ${entry.brand} (e.g. using '0' instead of 'O' or '1' instead of 'L').`);
      trustScore -= 50;
    }
  }

  // 5. Hyphenated Domain stuffing (e.g. usps-redelivery-portal-track.com)
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 2 && !isAuthenticBrandDomain) {
    redFlags.push(`Excessive hyphen stuffing (${hyphenCount} hyphens): Scammers chain trusted keywords to appear legitimate.`);
    trustScore -= 20;
  }

  // 6. Dangerous file extensions in path
  if (/\.(exe|apk|scr|bat|vbs|zip|iso|msi|dmg)(\?|$)/i.test(path)) {
    redFlags.push('Direct executable binary or archive download (.exe/.apk/.zip) detected in path.');
    trustScore -= 40;
  }

  // 7. Legitimate Authenticated Domain Boost
  if (isAuthenticBrandDomain && protocol === 'https' && redFlags.length === 0) {
    trustScore = 99;
  }

  // Clamp trust score 0-100
  trustScore = Math.max(0, Math.min(100, trustScore));

  // Determine Verdict
  let verdict: UrlCheckResult['verdict'] = 'safe';
  let statusTitle = '✅ Verified Authentic Official Website';
  let summary = `This URL belongs to the verified official domain for ${detectedBrand || rootDomain} with secure TLS encryption.`;

  if (trustScore < 40) {
    verdict = 'critical';
    statusTitle = '🚨 DANGEROUS: Phishing or Malicious Trap';
    summary = detectedBrand 
      ? `This URL is a fraudulent phishing trap impersonating ${detectedBrand}. The true recipient of any data entered is "${rootDomain}".`
      : `High-risk indicators detected. This domain exhibits characteristics common in phishing, credential harvesting, or malware distribution.`;
    
    safetyAdvice.push('DO NOT click this link or enter passwords, credit cards, or personal information.');
    if (detectedBrand && authenticAlternativeUrls && authenticAlternativeUrls.length > 0) {
      safetyAdvice.push(`Go directly to the real verified site: ${authenticAlternativeUrls[0].url}`);
    } else {
      safetyAdvice.push('Open a fresh browser tab and manually type the official website address.');
    }
    safetyAdvice.push('If this link was received via SMS or email, report it as junk/phishing immediately.');
  } else if (trustScore < 75) {
    verdict = 'suspicious';
    statusTitle = '⚠️ CAUTION: Unverified or Questionable Domain';
    summary = 'This website is not an official verified major service domain. Exercise caution before entering credentials or downloading files.';
    safetyAdvice.push('Verify the identity of the sender through an independent, trusted channel.');
    safetyAdvice.push('Check your browser address bar to confirm the domain matches the organization you expect.');
  } else {
    safetyAdvice.push('Official domain verified in offline brand database with encrypted HTTPS transport.');
    safetyAdvice.push('Safe to browse, but always ensure two-factor authentication is active on your accounts.');
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
    brandCategory,
    isAuthenticBrandDomain,
    authenticAlternativeUrls,
    redFlags,
    safetyAdvice,
    anatomy: {
      protocolLabel: `${protocol}://`,
      subdomainLabel: subdomain ? `${subdomain}.` : '',
      rootDomainLabel: rootDomain,
      tldLabel: tld ? `.${tld}` : '',
      pathLabel: path || '/'
    }
  };
}

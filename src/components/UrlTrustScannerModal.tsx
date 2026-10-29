import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Globe, 
  RefreshCw, 
  ExternalLink,
  ArrowRight,
  Check,
  Copy,
  Building,
  Lock
} from 'lucide-react';
import { scanUrl, UrlCheckResult } from '../services/urlScannerService';
import { soundManager } from '../utils/audio';

interface UrlTrustScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
}

type PresetCategory = 'all' | 'real' | 'fake';

export const UrlTrustScannerModal: React.FC<UrlTrustScannerModalProps> = ({
  isOpen,
  onClose,
  initialUrl = 'https://usps-redelivery-portal.top/track?id=8812'
}) => {
  const [urlInput, setUrlInput] = useState<string>(initialUrl);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [result, setResult] = useState<UrlCheckResult | null>(null);
  const [presetTab, setPresetTab] = useState<PresetCategory>('all');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleScan = (overrideUrl?: string) => {
    const target = (overrideUrl || urlInput).trim();
    if (!target) return;
    soundManager.playClick();
    setIsScanning(true);
    // Instant offline deterministic scan
    setTimeout(() => {
      const res = scanUrl(target);
      setResult(res);
      setIsScanning(false);
    }, 150);
  };

  const handleSelectPreset = (url: string) => {
    setUrlInput(url);
    handleScan(url);
  };

  const handleCopy = (text: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Compile offline preset list from our verified registry + real lookalikes
  const realPresets = [
    { label: 'USPS Official Tracking', url: 'https://tools.usps.com/go/TrackConfirmAction_input', category: 'Postal & Delivery' },
    { label: 'Chase Online Banking', url: 'https://www.chase.com', category: 'Banking' },
    { label: 'Netflix Official Login', url: 'https://www.netflix.com/login', category: 'Streaming' },
    { label: 'Apple ID Security Portal', url: 'https://appleid.apple.com', category: 'Big Tech' },
    { label: 'Google Account Security', url: 'https://myaccount.google.com/security', category: 'Big Tech' },
    { label: 'Bank of America Sign In', url: 'https://www.bankofamerica.com', category: 'Banking' },
    { label: 'PayPal Official Sign-In', url: 'https://www.paypal.com/signin', category: 'Banking' },
    { label: 'Amazon Your Orders', url: 'https://www.amazon.com/your-orders', category: 'Retail' },
    { label: 'IRS Official Tax Portal', url: 'https://www.irs.gov', category: 'Government' },
    { label: 'Best Buy Official Portal', url: 'https://www.bestbuy.com', category: 'Retail' }
  ];

  const fakePresets = [
    { label: 'Fake USPS Redelivery ($1.95 Fee)', url: 'https://usps-redelivery-portal.top/track?id=8812', target: 'USPS' },
    { label: 'Fake Chase Subdomain Trap', url: 'https://chase.com.security-alert-verify.net/auth/login', target: 'Chase Bank' },
    { label: 'Fake Netflix Billing Suspended', url: 'http://netflix-billing-update.cc/account/verify', target: 'Netflix' },
    { label: 'Fake TikTok Video Typosquatting', url: 'https://tikt0k-trending-clip.co/watch?id=499', target: 'TikTok' },
    { label: 'Fake Amazon Gift Card Claim', url: 'http://amazon.com-giftcard-claim.xyz/winner', target: 'Amazon' },
    { label: 'Raw IP Address Login Trap', url: 'http://185.220.101.44:8080/auth/login', target: 'Raw IP' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-navy-900 border border-cyan-500/40 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden text-left">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-navy-800 flex items-center justify-between gap-4 bg-navy-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
              <Globe className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Website & Link Trust Scanner
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  100% Offline Brand Database Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify if a link is real, fake, or spam. Dissect URLs and compare against real official websites with zero network calls.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* URL Search Input */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300">
              Enter or Paste Any Website URL to Verify:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleScan();
                  }}
                  placeholder="e.g. tools.usps.com, chase.com, netflix-update.cc..."
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <button
                onClick={() => handleScan()}
                disabled={isScanning || !urlInput.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Scanning Link...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Scan Link Safety</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Test Links & Offline Database Selector */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400">
                  Offline Database Test Links:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPresetTab('all')}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      presetTab === 'all' ? 'bg-cyan-500 text-navy-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({realPresets.length + fakePresets.length})
                  </button>
                  <button
                    onClick={() => setPresetTab('real')}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      presetTab === 'real' ? 'bg-emerald-500 text-navy-950' : 'text-emerald-400 hover:text-white'
                    }`}
                  >
                    🛡️ Real Official Links ({realPresets.length})
                  </button>
                  <button
                    onClick={() => setPresetTab('fake')}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      presetTab === 'fake' ? 'bg-rose-500 text-white' : 'text-rose-400 hover:text-white'
                    }`}
                  >
                    🚨 Fake & Phishing ({fakePresets.length})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Real Links */}
                {(presetTab === 'all' || presetTab === 'real') && (
                  <div className="bg-navy-950/70 p-3 rounded-xl border border-emerald-500/30">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-2 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Real Authentic Websites (Offline Verified)</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {realPresets.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectPreset(item.url)}
                          className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-emerald-950 text-[11px] text-emerald-300 hover:text-white border border-emerald-800/60 transition-colors"
                          title={item.url}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Phishing Links */}
                {(presetTab === 'all' || presetTab === 'fake') && (
                  <div className="bg-navy-950/70 p-3 rounded-xl border border-rose-500/30">
                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block mb-2 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>Known Deceptive / Phishing Lookalikes</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fakePresets.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectPreset(item.url)}
                          className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-rose-950 text-[11px] text-rose-300 hover:text-white border border-rose-800/60 transition-colors"
                          title={item.url}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SCAN RESULTS DISPLAY */}
          {result && (
            <div className="space-y-5 animate-in fade-in">
              
              {/* Verdict Banner */}
              <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl ${
                result.isAuthenticBrandDomain
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-emerald-500/10'
                  : result.verdict === 'safe'
                    ? 'bg-navy-950/80 border-cyan-500/40 shadow-cyan-500/5'
                    : result.verdict === 'suspicious'
                      ? 'bg-amber-950/40 border-amber-500/50'
                      : 'bg-rose-950/40 border-rose-500/50'
              }`}>
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-2xl shrink-0 ${
                    result.isAuthenticBrandDomain
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : result.verdict === 'safe'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : result.verdict === 'suspicious'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {result.isAuthenticBrandDomain ? (
                      <ShieldCheck className="w-8 h-8" />
                    ) : result.verdict === 'safe' ? (
                      <Globe className="w-8 h-8" />
                    ) : result.verdict === 'suspicious' ? (
                      <AlertTriangle className="w-8 h-8" />
                    ) : (
                      <ShieldAlert className="w-8 h-8" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-lg font-black text-white tracking-tight">
                        {result.statusTitle}
                      </h3>
                      {result.detectedBrand && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          result.isAuthenticBrandDomain 
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                            : 'bg-navy-900 text-cyan-300 border-navy-700'
                        }`}>
                          {result.isAuthenticBrandDomain ? 'Official Verified: ' : 'Target Brand: '}
                          {result.detectedBrand} {result.brandCategory ? `(${result.brandCategory})` : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed max-w-2xl">
                      {result.summary}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-navy-950/90 px-4 py-3 rounded-xl border border-navy-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Trust Score</span>
                  <div className={`text-3xl font-black font-mono ${
                    result.isAuthenticBrandDomain 
                      ? 'text-emerald-400' 
                      : result.verdict === 'safe' 
                        ? 'text-cyan-400' 
                        : result.verdict === 'suspicious' 
                          ? 'text-amber-400' 
                          : 'text-rose-400'
                  }`}>
                    {result.trustScore}
                    <span className="text-xs text-slate-500 font-normal">/100</span>
                  </div>
                  <span className={`text-[10px] font-mono uppercase font-bold block mt-0.5 ${
                    result.isAuthenticBrandDomain ? 'text-emerald-400' : result.verdict === 'safe' ? 'text-cyan-400' : result.verdict === 'suspicious' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {result.isAuthenticBrandDomain ? '★ Official 100/100 ★' : result.verdict === 'safe' ? 'Standard Safe' : result.verdict === 'suspicious' ? 'Questionable' : 'Phishing Trap'}
                  </span>
                </div>
              </div>

              {/* REAL AUTHENTIC ALTERNATIVE SECTION (If Phishing or Fake) */}
              {!result.isAuthenticBrandDomain && result.authenticAlternativeUrls && result.authenticAlternativeUrls.length > 0 && (
                <div className="bg-emerald-950/30 border border-emerald-500/50 p-4 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Real Official Websites for {result.detectedBrand} (Safe Alternatives):</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Offline Verified Link
                    </span>
                  </div>
                  <div className="space-y-2">
                    {result.authenticAlternativeUrls.map((alt, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-navy-950/90 rounded-xl border border-navy-800 text-xs">
                        <div>
                          <strong className="text-white block">{alt.label}</strong>
                          <span className="font-mono text-emerald-300 text-[11px] block">{alt.url}</span>
                          <span className="text-slate-400 text-[10px]">{alt.description}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(alt.url)}
                          className="self-start sm:self-center flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs transition-colors shrink-0"
                        >
                          {copiedLink === alt.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink === alt.url ? 'Copied Real Link!' : 'Copy Real Link'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* REAL AUTHENTIC SITES DIRECTORY (If scanning a real verified site) */}
              {result.isAuthenticBrandDomain && result.authenticAlternativeUrls && result.authenticAlternativeUrls.length > 0 && (
                <div className="bg-navy-950 p-4 rounded-2xl border border-emerald-500/40 space-y-2">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-400" />
                    <span>Official Verified Portals for {result.detectedBrand}:</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.authenticAlternativeUrls.map((alt, idx) => (
                      <div key={idx} className="p-2.5 bg-navy-900 rounded-xl border border-navy-800 text-xs">
                        <strong className="text-white block">{alt.label}</strong>
                        <span className="font-mono text-emerald-300 text-[11px] block break-all">{alt.url}</span>
                        <span className="text-slate-400 text-[10px]">{alt.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* URL Anatomy Dissector */}
              <div className="bg-navy-950 p-5 rounded-2xl border border-navy-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Visual URL Anatomy Dissector (How to Read This Link)</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    Always look at the Second-Level Domain
                  </span>
                </div>

                <div className="p-3.5 bg-navy-900 rounded-xl border border-navy-800 flex items-center gap-1.5 flex-wrap font-mono text-xs">
                  {/* Protocol */}
                  <div className="flex flex-col items-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      result.protocol === 'https' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'
                    }`}>
                      {result.protocol}://
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1">
                      {result.protocol === 'https' ? 'Encrypted' : 'UNENCRYPTED'}
                    </span>
                  </div>

                  {/* Subdomain */}
                  {result.subdomain && (
                    <div className="flex flex-col items-center">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700">
                        {result.subdomain}.
                      </span>
                      <span className="text-[9px] text-amber-400 mt-1">
                        Subdomain (Spoofable)
                      </span>
                    </div>
                  )}

                  {/* Root Domain */}
                  <div className="flex flex-col items-center">
                    <span className={`px-3 py-1 rounded text-xs font-black shadow-md ${
                      result.isAuthenticBrandDomain 
                        ? 'bg-emerald-500 text-navy-950 shadow-emerald-500/20' 
                        : 'bg-cyan-500 text-navy-950 shadow-cyan-500/20'
                    }`}>
                      {result.rootDomain}
                    </span>
                    <span className="text-[9px] text-cyan-300 font-bold mt-1 uppercase tracking-wider">
                      ★ True Owner Domain ★
                    </span>
                  </div>

                  {/* Path */}
                  {result.path && (
                    <div className="flex flex-col items-center">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-navy-800 text-slate-400 border border-navy-700">
                        {result.path.length > 25 ? `${result.path.slice(0, 25)}...` : result.path}
                      </span>
                      <span className="text-[9px] text-slate-500 mt-1">
                        Path & Parameters
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Golden Rule:</strong> In modern web browsers, the <strong>true destination</strong> is always the domain immediately before the final dot and extension (highlighted in cyan/emerald). Scammers often place trusted names like <code className="text-amber-300">chase.com</code> or <code className="text-amber-300">apple.com</code> in the <em>subdomain</em> to trick you.
                </p>
              </div>

              {/* Red Flags & Advice Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Red Flags */}
                <div className="bg-navy-950/80 p-4 rounded-xl border border-rose-500/30">
                  <h5 className="text-xs font-bold text-rose-300 mb-2.5 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>Identified Risk Factors ({result.redFlags.length})</span>
                  </h5>
                  {result.redFlags.length === 0 ? (
                    <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Zero suspicious patterns detected. Standard authentic domain.</span>
                    </div>
                  ) : (
                    <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                      {result.redFlags.map((flag, idx) => (
                        <li key={idx} className="leading-relaxed">{flag}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Safety Advice */}
                <div className="bg-navy-950/80 p-4 rounded-xl border border-cyan-500/30">
                  <h5 className="text-xs font-bold text-cyan-300 mb-2.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Defensive Recommendations</span>
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {result.safetyAdvice.map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-navy-950 border-t border-navy-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>SafeSpace Hacks 2026 • 100% Client-Side Offline Database</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white font-semibold transition-colors"
          >
            Close Scanner
          </button>
        </div>

      </div>
    </div>
  );
};

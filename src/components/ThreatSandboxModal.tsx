import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Search, 
  ShieldAlert, 
  ShieldCheck
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ThreatSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface URLAnalysis {
  protocol: string;
  subdomain: string;
  rootDomain: string;
  tld: string;
  path: string;
  riskLevel: 'safe' | 'suspicious' | 'critical';
  verdict: string;
  explanation: string;
}

const PRESET_URLS = [
  {
    label: 'Subdomain Prepending Attack',
    url: 'https://login.microsoft.com.account-portal-sync.net/oauth2/v2/authorize',
  },
  {
    label: 'Brand Lookalike / Typosquatting',
    url: 'https://pinnacle-paper-supply.com/invoices/wire-update',
  },
  {
    label: 'Insecure Protocol Downgrade',
    url: 'http://payroll.apexcloud.internal/employees/tax-records',
  },
  {
    label: 'Legitimate Official Domain',
    url: 'https://accounts.google.com/signin/v2/challenge/pwd',
  }
];

function analyzeURL(input: string): URLAnalysis {
  const trimmed = input.trim();
  let protocol = 'https';
  let withoutProtocol = trimmed;

  if (trimmed.startsWith('https://')) {
    protocol = 'https';
    withoutProtocol = trimmed.replace('https://', '');
  } else if (trimmed.startsWith('http://')) {
    protocol = 'http';
    withoutProtocol = trimmed.replace('http://', '');
  }

  const parts = withoutProtocol.split('/');
  const hostPart = parts[0];
  const pathPart = parts.slice(1).join('/');

  const hostSegments = hostPart.split('.');
  let rootDomain = hostPart;
  let subdomain = '';
  let tld = '';

  if (hostSegments.length >= 2) {
    tld = hostSegments[hostSegments.length - 1];
    rootDomain = `${hostSegments[hostSegments.length - 2]}.${tld}`;
    if (hostSegments.length > 2) {
      subdomain = hostSegments.slice(0, hostSegments.length - 2).join('.');
    }
  }

  // Risk heuristics
  if (protocol === 'http') {
    return {
      protocol,
      subdomain,
      rootDomain,
      tld,
      path: pathPart,
      riskLevel: 'critical',
      verdict: 'Plaintext Insecure Connection',
      explanation: 'Traffic is completely unencrypted. Anyone on your local Wi-Fi can capture passwords and session tokens in cleartext.'
    };
  }

  if (subdomain.includes('microsoft') || subdomain.includes('google') || subdomain.includes('paypal') || subdomain.includes('apple')) {
    if (!rootDomain.includes('microsoft.com') && !rootDomain.includes('google.com') && !rootDomain.includes('paypal.com') && !rootDomain.includes('apple.com')) {
      return {
        protocol,
        subdomain,
        rootDomain,
        tld,
        path: pathPart,
        riskLevel: 'critical',
        verdict: 'Subdomain Prepending Phish',
        explanation: `The attacker prepended trusted brand words into the subdomain ("${subdomain}"), but the TRUE destination is the untrusted root domain "${rootDomain}".`
      };
    }
  }

  if (rootDomain.includes('-supply') || rootDomain.includes('-portal') || rootDomain.includes('-sync') || rootDomain.includes('-auth')) {
    return {
      protocol,
      subdomain,
      rootDomain,
      tld,
      path: pathPart,
      riskLevel: 'suspicious',
      verdict: 'Hyphenated Brand Typosquatting',
      explanation: `Attackers frequently register hyphenated domains (e.g. "${rootDomain}") to imitate authentic supplier portals.`
    };
  }

  return {
    protocol,
    subdomain,
    rootDomain,
    tld,
    path: pathPart,
    riskLevel: 'safe',
    verdict: 'Legitimate Domain Structure',
    explanation: `Destination root domain is "${rootDomain}". Hostname and protocol appear consistent with authentic domain registration standards.`
  };
}

export const ThreatSandboxModal: React.FC<ThreatSandboxModalProps> = ({ isOpen, onClose }) => {
  const [inputUrl, setInputUrl] = useState<string>(PRESET_URLS[0].url);
  const analysis = analyzeURL(inputUrl);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-navy-900 border border-navy-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left">
        <button
          onClick={onClose}
          aria-label="Close threat sandbox modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <Terminal className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Threat Sandbox: URL & Domain Inspector
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          Deconstruct hostnames, detect subdomain prepending, and expose lookalike typosquatting tricks.
        </p>

        {/* Input bar */}
        <div className="mb-6">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Target URL or Hostname
          </label>
          <div className="flex items-center gap-2 bg-navy-950 p-2.5 rounded-xl border border-navy-700">
            <Search className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste or type a URL to inspect..."
              className="bg-transparent text-sm font-mono text-cyan-300 w-full focus:outline-none placeholder-slate-600"
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-[11px] text-slate-400 self-center mr-1">Try Examples:</span>
            {PRESET_URLS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setInputUrl(preset.url);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                  inputUrl === preset.url
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-navy-950 text-slate-400 hover:text-white border-navy-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Anatomy Breakdown */}
        <div className="bg-navy-950/80 rounded-2xl p-5 border border-navy-800 mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
            Structural Domain Anatomy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-navy-900 rounded-xl border border-navy-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Protocol</span>
              <span className={analysis.protocol === 'https' ? 'text-teal-400 font-bold' : 'text-rose-400 font-bold'}>
                {analysis.protocol}://
              </span>
            </div>
            <div className="p-3 bg-navy-900 rounded-xl border border-navy-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Subdomain (Mask)</span>
              <span className="text-amber-300 font-bold break-all">
                {analysis.subdomain || '(none)'}
              </span>
            </div>
            <div className="p-3 bg-navy-900 rounded-xl border border-navy-800 sm:col-span-2">
              <span className="text-[10px] text-cyan-400 font-bold block mb-0.5">★ True Root Domain (Where you go)</span>
              <span className="text-cyan-300 font-black text-sm break-all">
                {analysis.rootDomain}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Assessment Box */}
        <div className={`p-5 rounded-2xl border ${
          analysis.riskLevel === 'safe'
            ? 'bg-teal-950/30 border-teal-500/40'
            : analysis.riskLevel === 'suspicious'
            ? 'bg-amber-950/30 border-amber-500/40'
            : 'bg-rose-950/30 border-rose-500/40'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {analysis.riskLevel === 'safe' ? (
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            )}
            <h4 className="text-base font-bold text-white">
              {analysis.verdict}
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
            {analysis.explanation}
          </p>
          <div className="text-[11px] text-slate-400 font-mono bg-navy-950 p-2 rounded-lg border border-navy-800/80">
            <strong>Rule of Thumb:</strong> Look immediately to the left of the first single forward slash (/) to find the true domain. Words before that are subdomains controlled by the owner of the root domain.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs transition-colors"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
};

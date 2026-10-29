import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Search, 
  Play, 
  HelpCircle, 
  AlertTriangle, 
  RefreshCw, 
  Cpu, 
  BrainCircuit, 
  MessageSquare, 
  ShieldCheck,
  Lock
} from 'lucide-react';
import { 
  analyzeThreat, 
  generatePlayableScenario, 
  askSecurityCopilot, 
  ThreatAnalysisResult 
} from '../services/aiService';
import { Scenario, ScenarioAudience } from '../types/game';
import { soundManager } from '../utils/audio';

interface AiSecurityCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayCustomScenario: (scenario: Scenario) => void;
  currentScenarioTitle?: string;
}

type TabType = 'analyzer' | 'generator' | 'mentor';

const SAMPLE_THREATS = [
  {
    label: 'USPS Delivery Smishing',
    text: 'USPS Notice: Your parcel US91823901 could not be delivered due to incomplete street address. Update your delivery details within 24 hours at https://usps-redelivery-portal.top or your package will be returned to sender.'
  },
  {
    label: 'Geek Squad $499 Refund',
    text: 'Best Buy Geek Squad: Auto-renewal order #GS-8812 for $499.99 was successfully processed from your bank account. If you did not authorize this subscription, call our cancellation desk immediately at 1-800-555-0199.'
  },
  {
    label: 'Bank Fraud OTP Vishing',
    text: 'Chase Fraud Alert: Did you authorize a $780.00 Zelle payment to David M? If NO, reply NO or call our urgent dispatch line immediately. A representative will contact you to verify your 6-digit verification code.'
  },
  {
    label: 'AI Grandparent Bail Scam',
    text: 'Uncle, it is Leo! I am crying, I got into a terrible car crash and they arrested me. I need $2,500 bail right now to avoid jail over the weekend. Please do not tell mom! Officer Miller said I can only make this one call.'
  }
];

export const AiSecurityCopilotModal: React.FC<AiSecurityCopilotModalProps> = ({
  isOpen,
  onClose,
  onPlayCustomScenario,
  currentScenarioTitle
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('analyzer');

  // Tab 1: Threat Analyzer state
  const [threatInput, setThreatInput] = useState(SAMPLE_THREATS[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ThreatAnalysisResult | null>(null);

  // Tab 2: Generator state
  const [generatorTopic, setGeneratorTopic] = useState('Fake Utility Company Immediate Shutoff');
  const [generatorAudience, setGeneratorAudience] = useState<ScenarioAudience>('everyday');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenario, setGeneratedScenario] = useState<Scenario | null>(null);

  // Tab 3: Mentor state
  const [mentorQuestion, setMentorQuestion] = useState('How can scammers clone someone\'s voice using AI, and how do I protect my family?');
  const [isAskingMentor, setIsAskingMentor] = useState(false);
  const [mentorAnswer, setMentorAnswer] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunAnalysis = () => {
    if (!threatInput.trim()) return;
    soundManager.playClick();
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeThreat(threatInput);
      setAnalysisResult(res);
      setIsAnalyzing(false);
    }, 200);
  };

  const handleRunGeneration = () => {
    if (!generatorTopic.trim()) return;
    soundManager.playClick();
    setIsGenerating(true);
    setTimeout(() => {
      const scenario = generatePlayableScenario(generatorTopic, generatorAudience);
      setGeneratedScenario(scenario);
      setIsGenerating(false);
    }, 250);
  };

  const handleRunMentor = () => {
    if (!mentorQuestion.trim()) return;
    soundManager.playClick();
    setIsAskingMentor(true);
    setTimeout(() => {
      const ans = askSecurityCopilot(mentorQuestion, currentScenarioTitle);
      setMentorAnswer(ans);
      setIsAskingMentor(false);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-navy-900 border border-cyan-500/40 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden text-left">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-navy-800 flex items-center justify-between gap-4 bg-navy-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
              <BrainCircuit className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Cyber Threat Forensic Lab
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600/70">
                  <Cpu className="w-2.5 h-2.5 text-emerald-400" />
                  <span>100% Offline Heuristics • Zero External API Required</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Deconstruct suspicious communications, synthesize custom scenarios, and consult the offline cyber mentor.
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

        {/* Tab Selector */}
        <div className="flex border-b border-navy-800 bg-navy-950/40 px-5 pt-3 gap-2">
          <button
            onClick={() => { soundManager.playClick(); setActiveTab('analyzer'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'analyzer'
                ? 'border-cyan-400 text-cyan-300 bg-navy-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-navy-900/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Forensic Threat Analyzer</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('generator'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'generator'
                ? 'border-cyan-400 text-cyan-300 bg-navy-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-navy-900/50'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Scenario Synthesizer</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('mentor'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'mentor'
                ? 'border-cyan-400 text-cyan-300 bg-navy-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-navy-900/50'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <span>Ask Cyber Mentor</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* TAB 1: THREAT ANALYZER */}
          {activeTab === 'analyzer' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Paste Any Suspicious Text Message, Email, or Web Notice:
                </label>
                <textarea
                  rows={4}
                  value={threatInput}
                  onChange={(e) => setThreatInput(e.target.value)}
                  placeholder="Paste text message, email snippet, URL, or caller transcript here..."
                  className="w-full bg-navy-950 border border-navy-700 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Sample Quick Buttons */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Quick Samples:</span>
                {SAMPLE_THREATS.map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      soundManager.playClick();
                      setThreatInput(sample.text);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-[11px] text-cyan-300 border border-navy-700 transition-colors"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !threatInput.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deconstructing Threat Vectors...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Run Forensic Threat Deconstruction</span>
                  </>
                )}
              </button>

              {/* Analysis Results Display */}
              {analysisResult && (
                <div className="bg-navy-950/90 border border-cyan-500/40 rounded-2xl p-5 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-navy-800 flex-wrap gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase block">Threat Classification</span>
                      <h4 className="text-base font-bold text-white">{analysisResult.scamType}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                        analysisResult.threatLevel === 'Severe' 
                          ? 'bg-rose-950/90 text-rose-300 border-rose-600'
                          : analysisResult.threatLevel === 'High'
                            ? 'bg-amber-950/90 text-amber-300 border-amber-600'
                            : 'bg-teal-950/90 text-teal-300 border-teal-600'
                      }`}>
                        Level: {analysisResult.threatLevel.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Red Flags & Levers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-navy-900/80 p-3.5 rounded-xl border border-rose-500/20">
                      <h5 className="text-xs font-bold text-rose-300 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Identified Red Flags:</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                        {analysisResult.identifiedRedFlags.map((flag, idx) => (
                          <li key={idx} className="leading-relaxed">{flag}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-navy-900/80 p-3.5 rounded-xl border border-amber-500/20">
                      <h5 className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                        <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
                        <span>Psychological Manipulation Levers:</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                        {analysisResult.psychologicalTriggers.map((trig, idx) => (
                          <li key={idx} className="leading-relaxed">{trig}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Safe Action */}
                  <div className="bg-teal-950/40 border border-teal-500/40 p-4 rounded-xl">
                    <h5 className="text-xs font-bold text-teal-300 mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                      <span>Recommended Defensive Protocol:</span>
                    </h5>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {analysisResult.safeActionRecommendation}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    <strong className="text-slate-300">Technical Assessment:</strong> {analysisResult.technicalExplanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCENARIO SYNTHESIZER */}
          {activeTab === 'generator' && (
            <div className="space-y-4">
              <div className="bg-navy-950/70 p-4 rounded-2xl border border-navy-800">
                <h4 className="text-xs font-bold text-cyan-300 mb-1">
                  Synthesize an Offline Custom Cyber Dilemma
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  Specify any real-world threat topic. Our offline engine generates an interactive scenario with clues, options, and branching educational outcomes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Scenario Theme / Topic:</label>
                    <input
                      type="text"
                      value={generatorTopic}
                      onChange={(e) => setGeneratorTopic(e.target.value)}
                      placeholder="e.g. Flight delay refund scam, Fake doctor invoice, Airbnb midnight call..."
                      className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Audience:</label>
                    <select
                      value={generatorAudience}
                      onChange={(e) => setGeneratorAudience(e.target.value as ScenarioAudience)}
                      className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="everyday">Everyday & Home Life</option>
                      <option value="student">Student & Campus</option>
                      <option value="workplace">Workplace & Enterprise</option>
                    </select>
                  </div>
                </div>

                {/* Preset Suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400 mb-4">
                  <span className="font-semibold text-slate-300">Popular Themes:</span>
                  {[
                    'Smart Thermostat Firmware Update',
                    'Hotel Front Desk Credit Card Re-swipe',
                    'Healthcare Portal Prescription SMS',
                    'LinkedIn Remote Job Scam'
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        soundManager.playClick();
                        setGeneratorTopic(preset);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-[11px] text-cyan-300 border border-navy-700 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleRunGeneration}
                  disabled={isGenerating || !generatorTopic.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Interactive Scenario...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Synthesize Playable Scenario</span>
                    </>
                  )}
                </button>
              </div>

              {/* Generated Scenario Preview & Play Button */}
              {generatedScenario && (
                <div className="bg-navy-950 border border-cyan-500/50 rounded-2xl p-5 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Generated Simulation Ready</span>
                      <h3 className="text-base font-extrabold text-white">{generatedScenario.title}</h3>
                    </div>
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onPlayCustomScenario(generatedScenario);
                        onClose();
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
                    >
                      <Play className="w-4 h-4 fill-navy-950" />
                      <span>Play This Scenario Now</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-navy-900/80 p-3.5 rounded-xl border border-navy-800">
                    {generatedScenario.narrative}
                  </p>

                  <div>
                    <h5 className="text-xs font-bold text-slate-300 mb-2">Available Decision Options:</h5>
                    <div className="space-y-2">
                      {generatedScenario.options.map((opt, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-navy-900 border border-navy-800 text-xs text-slate-300 flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-navy-800 text-cyan-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                            {i + 1}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ASK CYBER MENTOR */}
          {activeTab === 'mentor' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Ask Any Cybersecurity Question or Debrief a Concept:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mentorQuestion}
                    onChange={(e) => setMentorQuestion(e.target.value)}
                    placeholder="e.g. Why can't police reverse a Bitcoin transaction? How does QR phishing work?"
                    className="flex-1 bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={handleRunMentor}
                    disabled={isAskingMentor || !mentorQuestion.trim()}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 text-navy-950 text-xs font-bold hover:bg-cyan-400 transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isAskingMentor ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
                    <span>Consult Mentor</span>
                  </button>
                </div>
              </div>

              {/* Sample Questions */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Suggested Topics:</span>
                {[
                  'Why do scammers demand gift cards & crypto?',
                  'How do AI voice clones work in emergency calls?',
                  'How does package delivery smishing work?',
                  'What is the 3-Second Pause Rule?'
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      soundManager.playClick();
                      setMentorQuestion(q);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-[11px] text-cyan-300 border border-navy-700 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Mentor Answer Output */}
              {mentorAnswer && (
                <div className="bg-navy-950 border border-teal-500/40 rounded-2xl p-5 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 pb-2 border-b border-navy-800">
                    <BrainCircuit className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-teal-300">Cyber Defense Mentor Debrief:</span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {mentorAnswer}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-navy-950 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>SafeSpace Hacks 2026 Compliance:</strong> 100% Client-side offline intelligence. Zero API keys, zero network tracking, and deterministic scoring.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close Lab
          </button>
        </div>

      </div>
    </div>
  );
};

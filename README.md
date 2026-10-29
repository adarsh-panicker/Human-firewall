# Human Firewall — The 60-Second Decision Game

> **Tagline:** Every click is a choice. Every choice teaches you something.  
> **Event:** Submission for SafeSpace Hacks 2026  
> **Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas-Confetti, Web Audio API, PWA Service Worker

---

## 1. Project Overview & Mission

Most cybersecurity training consists of annual slide decks and multiple-choice quizzes that people quickly click through. Real-world social engineering attacks, however, target hurried, distracted humans under high emotional urgency.

**Human Firewall** is a fast-paced, interactive cyber-defense game that places players directly inside authentic, simulated security dilemmas:
- Unexpected Multi-Factor Authentication (MFA) fatigue pushes
- Lookalike vendor invoice modifications (Business Email Compromise)
- Malicious lobby QR codes (Quishing)
- Inbound IT Helpdesk phone vishing calls for one-time passcodes
- Reverse-proxy credential harvesting on shared documents
- Physical "executive bonus" USB drop attacks
- Rogue public Wi-Fi profiles & evil-twin hotspots
- Password reuse cascading breaches
- Advance-fee remote employment scams
- Browser SSL/TLS certificate warnings & MitM interception
- Misdirected emails containing confidential payroll sheets
- Urgent executive CEO WhatsApp gift card requests

Players make a choice, observe the **immediate realistic consequence**, understand the **underlying security principle**, and branch into dynamic investigation or crisis-containment scenarios. At the end of each round, a personalized security-awareness report is generated with practical digital habits.

---

## 2. Key Architecture & Features

### A. The 60-Second Concept
Each scenario features a calm, non-punitive 60-second visual indicator. It simulates real-life time pressure without ever auto-submitting an answer, locking players out, or penalizing slower reading. Players can pause, reflect, or resume at any time.

### B. Branching Narrative Engine
Unlike disconnected quizzes, Human Firewall features a real **branching narrative engine**:
- **Unexpected MFA Push:**
  - *Approve prompt:* Branches to **Scenario 1B: Account Compromise & Emergency Revocation**, requiring session invalidation.
  - *Deny & Report:* Branches to **Scenario 1C: SOC Forensics & Threat Attribution**, auditing password reuse.
  - *Reply in chat:* Branches to **Scenario 1D: Escalated Vishing Call**, testing caller ID spoofing resistance.
- **Urgent Invoice:**
  - *Pay invoice:* Branches to **Scenario 2A: Financial Fraud & Emergency Wire Recall**, testing SWIFT recall protocols.
  - *Out-of-band callback:* Branches to **Scenario 2B: Supply Chain Advisory**, sharing indicators of compromise (IOCs).
- **Browser SSL Warning:**
  - *Bypass warning:* Branches to active credential harvesting remediation.

### C. Six Core Defensive Disciplines
Every decision exercises and calculates mastery across 6 core skills:
1. **Phishing Recognition** (typosquatting, lookalike domains, QR inspection)
2. **Identity Verification** (out-of-band verification, anti-vishing, authority bias)
3. **Authentication Safety** (MFA fatigue prevention, passkeys, credential hygiene)
4. **Privacy & Data Handling** (employment scams, data minimization, exposure containment)
5. **Incident Response** (active containment, emergency revocation, transparent disclosure)
6. **Safe Browsing** (TLS/SSL validation, captive portal defense, encrypted tunnels)

### D. Transparent, Deterministic Scoring (0 to 100)
- Initial base score: 0
- Safest choices award +20 to +25 points
- Risky choices award modest partial credit (+5 to +10)
- Critical security mistakes deduct points (-20 to -25)
- Normalized to an intuitive 0–100 learning score based on scenarios played
- Zero AI hallucinations or opaque black-box scoring algorithms

### E. Adaptive Difficulty Engine
The engine tracks player mistakes in real time. If a player repeatedly misses identity-verification cues, the system injects targeted verification scenarios with contextual reasoning. If a player excels, the engine escalates to nuanced, ambiguous challenges.

### G. Creative Innovations & Stand-Out Features
- **Forensic Clue Inspector ("Inspect Red Flags"):** An active investigation tool on each scenario. Players can toggle forensic hotspots that highlight geolocation anomalies, typosquatted hostnames, Reply-To header redirects, and rogue root certificate payloads before making a choice.
- **6-Axis Cyber Radar Polygon:** A pure SVG visual radar chart that computes the player's hardened vs vulnerable defense vectors in real time across all 6 skills.
- **Threat Sandbox & URL Anatomy Analyzer:** A standalone educational sandbox tool directly accessible from the navigation bar. Players can dissect URLs into Protocol, Subdomain (Mask), True Root Domain, and Path, instantly exposing subdomain prepending and hyphenated typosquatting.
- **Voice Dispatch Narration & Audio Ticker:** Integrates browser Web Speech API voice synthesis to narrate scenario briefings aloud for enhanced accessibility and dispatch immersion, along with a heartbeat countdown ticker.
- **Official Digital Clearance Certificate & Badge:** Generates an official, printable "Human Firewall Defense Clearance" with dynamic rank assignment (e.g. Master Cyber Sentinel), cryptographic verification hash, and seal.
- **Daily Defense Readiness Streak:** Encourages continuous habit formation with a daily streak tracker persisted locally.

### H. Privacy & Zero-Backend Design
- **100% Client-Side:** No external database, no server APIs, and no telemetry tracking.
- **Zero Registration:** Play immediately as an Everyday User, Student, Office Professional, or IT Administrator.
- **Offline Capable:** Full Progressive Web App (PWA) with service worker caching.
- **Local Persistence:** History, stats, achievements, and active sessions persist in `localStorage`.
- **Export & Reset:** One-click JSON data export and complete data reset.

---

## 3. Quick Demo Walkthrough for Judges (Under 3 Minutes)

1. **Launch Human Firewall:** Open the application.
2. **Instant Demo Mode:** Click the amber **"⚡ Try Demo Scenario"** button in the top navigation or welcome banner.
3. **Trigger a Mistake:** On the **Unexpected MFA Push** screen, select Option 1 (*"Tap Approve to avoid getting workstation sync blocked"*).
4. **Observe Branching:** Watch the immediate critical consequence screen explain MFA Push Fatigue. Click **"Continue Along Branch"** to enter the crisis scenario: **Account Compromise & Emergency Revocation**.
5. **Contain the Incident:** Select the safe containment option (*"Sign out of all sessions and call the emergency SOC hotline"*).
6. **Start a Quick Challenge:** From the Dashboard, launch **Quick Play** and select the safer choices.
7. **Inspect the Personalized Report:** View your normalized learning score, skill competency matrix, decision audit trail, and 3 actionable concrete security habits.
8. **Verify Persistence & Print:** Refresh the page to confirm all stats and achievements persist in `localStorage`. Click **"Print / PDF"** to inspect the print-optimized stylesheet.

---

## 4. Installation & Local Development

### Prerequisites
- Node.js 18+ or 20+ (tested on Node v24.19.0)
- npm 9+

### Commands

```bash
# 1. Clone repository & navigate to directory
cd "Human Firewall"

# 2. Install dependencies
npm install

# 3. Run development server with Hot Module Replacement
npm run dev

# 4. Build optimized production bundle
npm run build

# 5. Preview production build locally
npm run preview
```

The app will be available locally at `http://localhost:5173`.

---

## 5. Project Structure

```
├── public/
│   ├── favicon.svg             # Shield and lightning SVG icon
│   ├── manifest.json           # PWA standalone manifest
│   └── sw.js                   # Service Worker offline asset cache
├── src/
│   ├── types/
│   │   └── game.ts             # TypeScript definitions for scenarios, options, sessions, stats
│   ├── data/
│   │   ├── scenarios.ts        # 12 Core scenarios + 5 branching storylines
│   │   └── achievements.ts     # Milestone, skill, and recovery achievements
│   ├── engine/
│   │   ├── scoringEngine.ts    # Deterministic 0-100 score & skill breakdown calculation
│   │   ├── branchingEngine.ts  # Dynamic narrative path resolution & queue manager
│   │   ├── adaptiveEngine.ts   # Weakness analysis & targeted scenario selection
│   │   ├── achievementEngine.ts# Criteria-based achievement unlocks
│   │   ├── storageEngine.ts    # Safe localStorage persistence, JSON export, and reset
│   │   └── reportGenerator.ts  # Personalized report, recommendations, & comparisons
│   ├── utils/
│   │   ├── audio.ts            # Zero-dependency Web Audio API synthesizer
│   │   └── scenarioValidator.ts# Comprehensive data integrity validation suite
│   ├── components/
│   │   ├── Navbar.tsx          # Sticky cyber header with quick demo launcher & audio toggle
│   │   ├── Footer.tsx          # Simulation disclaimer, 100% client-side tag, and data links
│   │   ├── WelcomeScreen.tsx   # Hero landing, 60-sec concept, and 5-sec interactive teaser
│   │   ├── PlayerSetupModal.tsx# Role profiles (Everyday, Student, Office, Admin) & modes
│   │   ├── GameDashboard.tsx   # Radar skill competency matrix, stats, and achievements
│   │   ├── InteractiveScenarioScreen.tsx # 60-sec calm timer, narrative, and keyboard shortcuts
│   │   ├── SimulatedMessage.tsx# MFA, Email, QR, Phone Call, USB, Wi-Fi, and SSL warning UIs
│   │   ├── DecisionOptionCard.tsx  # Keyboard-accessible [1-4] option cards
│   │   ├── OutcomeFeedbackCard.tsx # Immediate feedback, consequence, and security principle
│   │   ├── ResultsReport.tsx   # Score gauge, recommendations, decision audit, and PDF print
│   │   ├── PracticeModePicker.tsx  # Category & difficulty filtering library
│   │   └── HowItWorksModal.tsx # Educational mission & guidelines modal
│   ├── App.tsx                 # Root state controller and view coordinator
│   ├── index.css               # Tailwind CSS, cyber theme tokens, and print stylesheets
│   └── main.tsx                # React DOM entry point
├── tailwind.config.js          # Dark navy palette, cyber accents, and custom animations
├── tsconfig.json               # TypeScript project references
└── package.json
```

---

## 6. Attribution & Credits

- **Framework:** React & Vite
- **Styling:** Tailwind CSS
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Celebration Effects:** [canvas-confetti](https://github.com/catdad/canvas-confetti)
- **Audio:** Custom Web Audio API synthesizer (`src/utils/audio.ts`), requiring zero external audio assets.
- **Scenario Content & Graphics:** Fictional synthetic scenarios, simulated email clients, authenticator prompts, QR scanner viewfinders, and SVG illustrations authored specifically for the SafeSpace Hacks 2026 hackathon.
- **Disclaimer:** All organizations (Apex Cloud, Pinnacle Paper, etc.) and individuals depicted are fictional simulations created for educational purposes.

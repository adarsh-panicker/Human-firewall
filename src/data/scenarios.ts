import { Scenario } from '../types/game';

export const SCENARIOS: Scenario[] = [
  // ==========================================
  // SCENARIO 1: Unexpected MFA Request (Core + Branching Root)
  // ==========================================
  {
    id: 'sc-mfa-1',
    title: 'The Unexpected MFA Push',
    category: 'authentication',
    difficulty: 'beginner',
    estimatedReadingSec: 25,
    narrative: 'You are finishing up an afternoon report when your phone buzzes with an unexpected Multi-Factor Authentication (MFA) push notification for your primary account. Seconds later, an urgent message pops up in your company chat tool from someone named "Devon - IT Helpdesk".',
    simulatedType: 'mfa',
    simulatedData: {
      appName: 'SecureAuth Mobile',
      account: 'alex.taylor@fictional-apexcloud.internal',
      service: 'Apex Cloud Workspace Sign-in',
      location: 'Bucharest, Romania (IP: 185.220.101.44)',
      time: 'Just now',
      chatSender: 'Devon Vance (IT Helpdesk)',
      chatAvatar: 'DV',
      chatMessage: 'Hey Alex! We are rolling out a system migration patch across cluster #4. Please tap "Approve" on your phone prompt so your workstation sync does not get blocked.',
      authCode: '849-210'
    },
    learningObjective: 'Recognize MFA fatigue attacks and never approve an authentication request you did not personally trigger.',
    safetyTakeaway: 'An unexpected MFA prompt means someone has your password. Treat unprompted MFA pushes as unauthorized access attempts.',
    profileFlavor: {
      admin: 'IT Administrator context: Adversaries use MFA push bombing to bypass traditional second factors when credentials have already leaked.',
      office: 'Office context: IT will never ask you in an ad-hoc direct chat to approve an unexpected login prompt.',
      student: 'Student context: Campus portals often get targeted with credential stuffing; unexpected prompts mean someone tried your password.',
      everyday: 'Never tap "Approve" when you were not actively trying to sign in to that account.'
    },
    options: [
      {
        id: 'mfa-opt-approve',
        text: 'Tap "Approve" to avoid getting workstation sync blocked as Devon requested.',
        safety: 'critical',
        score: -20,
        skillImpact: { skill: 'authentication', points: -15 },
        consequence: 'You granted the attacker instant access to your account and corporate files. The chat message was an imposter impersonating IT.',
        securityPrinciple: 'MFA Fatigue & Push Exploitation',
        saferExplanation: 'MFA exists precisely to stop unauthorized logins. Approving an uninitiated prompt hands the intruder your account keys.',
        nextScenarioId: 'sc-mfa-compromise' // Branching: Incident recovery
      },
      {
        id: 'mfa-opt-deny-report',
        text: 'Tap "Deny" immediately, change your password, and report the incident via the official Security Ops channel.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'authentication', points: 20 },
        consequence: 'You stopped the unauthorized intruder dead in their tracks and alerted the security team to revoke compromised session tokens.',
        securityPrinciple: 'Zero Trust & Incident Reporting',
        saferExplanation: 'Denying the prompt protects your account; reporting alerts SecOps that your password was compromised elsewhere.',
        nextScenarioId: 'sc-mfa-investigation' // Branching: Investigation
      },
      {
        id: 'mfa-opt-reply-chat',
        text: 'Reply to the chat asking: "Is this really you Devon? What ticket number is this for?"',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: 'verification', points: 0 },
        consequence: 'You tipped off the attacker who now doubles down with fabricated ticket details and social engineering urgency.',
        securityPrinciple: 'Out-of-Band Verification',
        saferExplanation: 'Never verify identity using the exact same suspicious channel where the requester contacted you. Verify out-of-band.',
        nextScenarioId: 'sc-mfa-social-eng' // Branching: Escalated social engineering
      },
      {
        id: 'mfa-opt-ignore',
        text: 'Swipe the notification away and ignore it; as long as you do not approve it, you are fine.',
        safety: 'partial',
        score: 10,
        skillImpact: { skill: 'incident', points: 5 },
        consequence: 'You avoided approving access, but the attacker still has your valid password and will likely prompt you again until you slip up.',
        securityPrinciple: 'Proactive Credential Hygiene',
        saferExplanation: 'Ignoring an MFA prompt leaves the root cause unaddressed: an adversary holds your valid credentials and requires password revocation.'
      }
    ]
  },

  // BRANCH 1A: MFA Recovery Scenario (Branch from approving MFA)
  {
    id: 'sc-mfa-compromise',
    title: 'Account Compromise & Emergency Revocation',
    category: 'incident',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'Within seconds of hitting "Approve", your screen flickers. You receive an automated SMS: "New login detected from Bucharest, Romania. Recovery email changed to temp-support@mail-proxy-ru.net." What is your immediate containment action?',
    simulatedType: 'sms',
    simulatedData: {
      sender: 'Apex Cloud Security Alert',
      timestamp: '1 min ago',
      message: 'CRITICAL ALERT: Unauthorized login confirmed on Alex Taylor account from IP 185.220.101.44 (Bucharest). Security settings modified.',
      urgentBadge: 'INCIDENT IN PROGRESS'
    },
    learningObjective: 'Execute rapid containment when an account takeover is in progress.',
    safetyTakeaway: 'Time-to-containment is everything in an active breach. Terminate sessions, contact security directly, and isolate.',
    options: [
      {
        id: 'rec-opt-kill-sessions',
        text: 'Use your phone to hit "Sign out of all sessions", initiate emergency password reset, and call the dedicated SOC emergency hotline.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'incident', points: 25 },
        consequence: 'Active adversary sessions are severed and token replay attacks are blocked while SecOps locks down the identity perimeter.',
        securityPrinciple: 'Active Session Invalidation & Containment',
        saferExplanation: 'Revoking active tokens stops the attacker from maintaining persistence even if they already authenticated.'
      },
      {
        id: 'rec-opt-wait-morning',
        text: 'Send an email to general IT support and wait for their response tomorrow morning.',
        safety: 'critical',
        score: -20,
        skillImpact: { skill: 'incident', points: -15 },
        consequence: 'Overnight, the adversary exfiltrates internal confidential customer records and establishes backdoor API keys.',
        securityPrinciple: 'Incident Escalation SLAs',
        saferExplanation: 'Breaches must be escalated via emergency hotlines immediately, not non-urgent general email queues.'
      },
      {
        id: 'rec-opt-restart-laptop',
        text: 'Shut down and restart your laptop to see if the error clears away.',
        safety: 'risky',
        score: 0,
        skillImpact: { skill: 'incident', points: -5 },
        consequence: 'Local reboot has zero effect on cloud identity token compromise and wastes crucial response minutes.',
        securityPrinciple: 'Cloud Identity vs Local Hardware',
        saferExplanation: 'MFA compromises happen at the cloud directory level; rebooting local hardware does not revoke cloud sessions.'
      }
    ]
  },

  // BRANCH 1B: MFA Investigation Scenario (Branch from Deny & Report)
  {
    id: 'sc-mfa-investigation',
    title: 'SOC Investigation & Threat Attribution',
    category: 'incident',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'Because you denied the prompt and alerted Security Operations, the SOC analyst calls your desk. "Great catch on that push bomb! We need to verify how your password was obtained. Which of these logs should we pull first?"',
    simulatedType: 'chat',
    simulatedData: {
      chatSender: 'Marcus - Threat Intel Analyst',
      chatAvatar: 'MA',
      chatMessage: 'We isolated the IP 185.220.101.44 (known VPN exit node). Can you recall where you recently entered that password or used that device?',
      ticketNumber: 'SEC-2026-8819'
    },
    learningObjective: 'Understand root cause analysis for credential exposures.',
    safetyTakeaway: 'Stopping the attack is step one; finding how credentials leaked prevents recurring compromise.',
    options: [
      {
        id: 'inv-opt-audit-reuse',
        text: 'Review password reuse across personal services, browser autofill logs, and recent sign-in links entered this week.',
        safety: 'safer',
        score: 20,
        skillImpact: { skill: 'incident', points: 20 },
        consequence: 'The SOC discovers your old email password was breached on a compromised 2024 forum and matched via credential stuffing.',
        securityPrinciple: 'Credential Stuffing Vulnerability Analysis',
        saferExplanation: 'Auditing password reuse uncovers the source of credential leaks before attackers pivot to other systems.'
      },
      {
        id: 'inv-opt-assume-glitch',
        text: 'Tell Marcus it was probably just a random system glitch and close the ticket.',
        safety: 'risky',
        score: -10,
        skillImpact: { skill: 'incident', points: -10 },
        consequence: 'Leaving the root cause uninvestigated allows the adversary to reuse the same leaked password against other internal portals.',
        securityPrinciple: 'Root Cause Verification',
        saferExplanation: 'MFA triggers only occur when valid username/password credentials were correctly submitted. It is never a random glitch.'
      }
    ]
  },

  // BRANCH 1C: MFA Social Engineering Pressure
  {
    id: 'sc-mfa-social-eng',
    title: 'Escalated Vishing Call',
    category: 'verification',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'After you messaged Devon asking for a ticket, your phone rings immediately. The caller ID displays "APEX IT HELPDESK (+1 800 555-0199)". The caller sounds hurried and irritated: "Alex, I sent you ticket #IT-4921! We have 60 seconds before this batch job fails and locks your department out of billing!"',
    simulatedType: 'call',
    simulatedData: {
      callerId: 'APEX IT HELPDESK (+1 800 555-0199)',
      callerName: 'Devon Vance (Claimed)',
      urgency: 'HIGH PRESSURE',
      duration: '00:18'
    },
    learningObjective: 'Resist caller ID spoofing and artificial emotional urgency in voice phishing (vishing).',
    safetyTakeaway: 'Caller ID can easily be spoofed. Urgency, intimidation, and rushed deadlines are signature social engineering tactics.',
    options: [
      {
        id: 'vis-opt-hangup-callback',
        text: 'Politely hang up, look up the verified IT Helpdesk number in the internal intranet directory, and call them back directly.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'verification', points: 20 },
        consequence: 'The real Helpdesk confirms Devon is on annual leave and that the call was a spoofed vishing attempt.',
        securityPrinciple: 'Independent Out-of-Band Callback',
        saferExplanation: 'Hanging up and dialing a pre-established verified number neutralizes inbound spoofing.'
      },
      {
        id: 'vis-opt-apologize-approve',
        text: 'Apologize for the delay and approve the prompt right away to prevent department billing disruption.',
        safety: 'critical',
        score: -20,
        skillImpact: { skill: 'authentication', points: -15 },
        consequence: 'You succumbed to urgency manipulation. The attacker gains full privileged session access.',
        securityPrinciple: 'Emotional Manipulation Resistance',
        saferExplanation: 'Legitimate IT departments never demand instant MFA approvals under threat of immediate departmental outage.'
      }
    ]
  },

  // ==========================================
  // SCENARIO 2: The Urgent Invoice (Core + Branching Root)
  // ==========================================
  {
    id: 'sc-invoice-1',
    title: 'The Urgent Invoice',
    category: 'phishing',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'You receive an email from your longtime packaging supplier, "Pinnacle Paper & Print". Attached is an overdue invoice for $48,250. The message states their bank account details have changed due to an annual audit and payment must be remitted today to prevent shipment cancellation.',
    simulatedType: 'email',
    simulatedData: {
      senderName: 'Sarah Jenkins - Pinnacle Paper',
      senderEmail: 'sarah.jenkins@pinnacle-paper-supply.com', // Subtle typo domain vs official pinnaclepaper.com
      replyTo: 'accounting-audit@fastmail-routing.net',
      subject: 'URGENT: Outstanding Balance & Updated Payment Wiring Instructions',
      date: 'Today, 9:14 AM',
      attachment: 'Invoice_INV-84920_UpdatedWire.pdf (420 KB)',
      emailBody: 'Hi Team,\n\nPlease see attached invoice for this week\'s manufacturing paper run. Note that our primary depository account with Chase is undergoing scheduled audit maintenance. Please wire all funds to our temporary escrow account at Continental Bank:\n\nRouting: 071000288\nAccount: 4899201882\n\nMust be wired by 2 PM to release order #994.',
      highlightWarning: 'Reply-To address differs from Sender domain.'
    },
    learningObjective: 'Identify Business Email Compromise (BEC) and verify banking changes out-of-band.',
    safetyTakeaway: 'Any change to wire instructions or banking accounts must be validated using an independent, verified phone number on file.',
    profileFlavor: {
      office: 'Finance & Operations context: Supplier account changes are the single largest source of enterprise wire fraud worldwide.',
      admin: 'Look for subtle email header discrepancies like domain typosquatting and mismatched Reply-To headers.',
      everyday: 'Never send money or change payment accounts based only on an email request.'
    },
    options: [
      {
        id: 'inv-opt-verify-callback',
        text: 'Do not pay yet. Call Sarah using the verified telephone number saved in your existing vendor contracts directory.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'phishing', points: 20 },
        consequence: 'Sarah picks up and is shocked—her email was compromised and the attacker intercepted payment threads with altered wire instructions.',
        securityPrinciple: 'Dual-Control & Out-of-Band Vendor Verification',
        saferExplanation: 'Calling a trusted number on file completely bypasses the compromised email channel and halts multi-thousand dollar fraud.',
        nextScenarioId: 'sc-invoice-verified' // Branching: Vendor compromised advisory
      },
      {
        id: 'inv-opt-pay-now',
        text: 'Forward the invoice directly to Accounts Payable with approval to wire the $48,250 immediately to avoid shipment delays.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'phishing', points: -20 },
        consequence: 'The money is wired to an offshore money-mule account. The funds are transferred out within minutes and are unrecoverable.',
        securityPrinciple: 'Business Email Compromise (BEC)',
        saferExplanation: 'Wiring money to new instructions without verification is the classic mechanism of BEC attacks.',
        nextScenarioId: 'sc-invoice-fraud' // Branching: Financial wire recall
      },
      {
        id: 'inv-opt-reply-email',
        text: 'Reply to the email asking Sarah to confirm the banking details with an official signed letterhead.',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: 'verification', points: 0 },
        consequence: 'The attacker controls the email and responds within 5 minutes with a forged letterhead and fake signature.',
        securityPrinciple: 'In-Band Circular Verification',
        saferExplanation: 'Asking the adversary on the compromised channel to verify their own fraud accomplishes nothing.'
      }
    ]
  },

  // BRANCH 2A: Wire Fraud Containment (Branch from Paying Invoice)
  {
    id: 'sc-invoice-fraud',
    title: 'Financial Fraud & Emergency Wire Recall',
    category: 'incident',
    difficulty: 'advanced',
    estimatedReadingSec: 25,
    narrative: 'Two hours after the wire was initiated, Sarah Jenkins calls on the office phone asking why the regular invoice is late. You realize the wire went to a criminal syndicate. What is your immediate crisis action?',
    simulatedType: 'chat',
    simulatedData: {
      chatSender: 'CFO / Legal Counsel',
      chatAvatar: 'CF',
      chatMessage: 'AP just realized the $48k wire went to an unverified routing number. Clock is ticking before settlement window closes!',
      urgentBadge: 'FINANCIAL EMERGENCY'
    },
    learningObjective: 'Understand SWIFT/Fedwire recall procedures and immediate fraud protocols.',
    safetyTakeaway: 'Wire recall notices must be requested within hours to have any chance of clawback through intermediary financial institutions.',
    options: [
      {
        id: 'fraud-opt-recall-fbi',
        text: 'Contact your bank\'s fraud division immediately to request a SWIFT/Fedwire Fraud Recall and file an IC3/law enforcement complaint.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'incident', points: 25 },
        consequence: 'Your originating bank sends an urgent freeze request to the receiving institution before the funds can be completely laundered.',
        securityPrinciple: 'Rapid Fraud Interception Protocol',
        saferExplanation: 'Initiating immediate wire recalls within the transaction settlement window maximizes asset recovery probabilities.'
      },
      {
        id: 'fraud-opt-wait-statement',
        text: 'Wait for the monthly bank reconciliation statement to see if the funds bounce back automatically.',
        safety: 'critical',
        score: -20,
        skillImpact: { skill: 'incident', points: -15 },
        consequence: 'The money is completely dissipated through cryptocurrency mixing services and lost forever.',
        securityPrinciple: 'Time-Sensitivity in Financial Crime',
        saferExplanation: 'Wires do not bounce back automatically if the recipient account is active. Inaction guarantees total loss.'
      }
    ]
  },

  // BRANCH 2B: Vendor Security Advisory (Branch from Verifying Invoice)
  {
    id: 'sc-invoice-verified',
    title: 'Vendor Breach Notification & Supply Chain Defense',
    category: 'incident',
    difficulty: 'intermediate',
    estimatedReadingSec: 20,
    narrative: 'Because you called Sarah and blocked the $48k wire, your company prevented a major financial loss. Sarah asks how your team knew the email was fake so they can notify other clients.',
    simulatedType: 'email',
    simulatedData: {
      senderName: 'Sarah Jenkins (Verified Phone Callback)',
      senderEmail: 'sarah.jenkins@pinnaclepaper.com',
      subject: 'Thank you - We are notifying our banking partners',
      date: 'Today, 10:02 AM',
      emailBody: 'Alex, you saved us! Our IT found an unauthorized inbox forwarding rule on my account that diverted accounting emails. Which header details did you spot?'
    },
    learningObjective: 'Educate supply chain partners on typosquatting and inbox exfiltration rules.',
    safetyTakeaway: 'Sharing threat indicators strengthens the collective security posture of your business ecosystem.',
    options: [
      {
        id: 'ven-opt-share-indicators',
        text: 'Provide the lookalike domain (`pinnacle-paper-supply.com`) and suspicious Reply-To header to help them issue an urgent vendor advisory.',
        safety: 'safer',
        score: 20,
        skillImpact: { skill: 'incident', points: 20 },
        consequence: 'Pinnacle Paper notifies all their customers and registers a domain takedown request, protecting dozens of other companies.',
        securityPrinciple: 'Threat Intelligence Sharing',
        saferExplanation: 'Sharing actionable indicators of compromise (IOCs) helps neutralize attacks across the entire supply chain.'
      },
      {
        id: 'ven-opt-ignore-advisory',
        text: 'Tell them it is their problem to figure out and discard the malicious headers.',
        safety: 'partial',
        score: 5,
        skillImpact: { skill: 'incident', points: 5 },
        consequence: 'Other suppliers fall victim to the exact same lookalike domain the next morning.',
        securityPrinciple: 'Collaborative Defense',
        saferExplanation: 'Supplying IOCs takes minutes and prevents shared industry risk.'
      }
    ]
  },

  // ==========================================
  // SCENARIO 3: The QR Code (Quishing)
  // ==========================================
  {
    id: 'sc-qr-1',
    title: 'The Lobby Coffee Poster QR Code',
    category: 'phishing',
    difficulty: 'beginner',
    estimatedReadingSec: 20,
    narrative: 'While waiting in the building lobby for a seminar, you see a glossy printed poster next to the café: "Free Tech Expo Pass + $15 Café Voucher! Scan QR code to claim your digital ticket." You point your camera at the code.',
    simulatedType: 'qr',
    simulatedData: {
      posterHeadline: 'SCAN FOR FREE $15 CAFÉ VOUCHER & TECH EXPO PASS',
      decodedUrl: 'https://login-auth-techsummit2026.cloud-redirect.net/sso/claim?id=4991',
      qrImageText: 'Scan to register with your corporate email',
      warningLabel: 'Third-party shortened redirect detected'
    },
    learningObjective: 'Identify QR code phishing ("Quishing") and inspect destination URLs before entering credentials.',
    safetyTakeaway: 'QR codes obscure the destination URL. Always preview the full link, check the domain, and never enter credentials on random scanned pages.',
    profileFlavor: {
      student: 'Campus noticeboards are prime targets for malicious QR codes offering fake discounts or event passes.',
      office: 'Physical workplace spaces can easily have malicious stickers placed over legitimate building signage.',
      everyday: 'Think twice before scanning physical QR codes in public places that ask you to log in.'
    },
    options: [
      {
        id: 'qr-opt-inspect-url',
        text: 'Inspect the decoded URL carefully. Notice it points to an obscure `.cloud-redirect.net` domain rather than the official expo site, and close it.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'phishing', points: 20 },
        consequence: 'You avoided a credential-harvesting trap designed to capture corporate logins under the guise of an event voucher.',
        securityPrinciple: 'Destination URL Inspection (Anti-Quishing)',
        saferExplanation: 'Examining the full hostname before interacting with any QR destination prevents credential theft.'
      },
      {
        id: 'qr-opt-fill-login',
        text: 'Follow the link to the landing page and type in your email and password to claim the $15 voucher quickly.',
        safety: 'critical',
        score: -20,
        skillImpact: { skill: 'phishing', points: -20 },
        consequence: 'Your login credentials were saved to a criminal phishing server. A sticker had been pasted over the original lobby sign.',
        securityPrinciple: 'Credential Harvester Exploitation',
        saferExplanation: 'Legitimate vouchers never require your primary corporate or personal passwords on third-party domains.'
      },
      {
        id: 'qr-opt-scan-on-laptop',
        text: 'Take a photo with your phone and email the link to your work laptop so you can open it on a larger screen.',
        safety: 'risky',
        score: -5,
        skillImpact: { skill: 'browsing', points: -10 },
        consequence: 'You brought an unvetted malicious URL from an untrusted physical flyer into your corporate network boundary.',
        securityPrinciple: 'Contamination of Work Environments',
        saferExplanation: 'Transferring unverified mobile links to work machines spreads risk across devices.'
      }
    ]
  },

  // ==========================================
  // SCENARIO 4: The IT Support Call (Vishing & Remote Code)
  // ==========================================
  {
    id: 'sc-it-call-1',
    title: 'The IT Support Call',
    category: 'verification',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'Your desk phone rings. The caller says: "Hi, this is Patrick from Central Infrastructure. We noticed your machine is transmitting corrupted network packets that are degrading the local subnet. I just sent a 6-digit confirmation PIN to your mobile phone—read it back to me so I can apply the hotfix."',
    simulatedType: 'call',
    simulatedData: {
      callerId: 'Patrick Miller - Central Infrastructure',
      callerNumber: 'Extension #4102',
      smsReceived: 'YOUR PASSCODE: 729-104. DO NOT SHARE THIS WITH ANYONE. Apex Cloud will never ask for this code.',
      callStatus: 'Ongoing - 00:34'
    },
    learningObjective: 'Never disclose one-time passwords (OTP) or authentication codes to anyone, including purported IT support.',
    safetyTakeaway: 'One-time passcodes verify YOU to the system. Legitimate support agents have administrative tools and never require your personal OTP.',
    profileFlavor: {
      admin: 'System administrators manage directory roles directly; requesting end-user OTPs violates internal security baselines.',
      office: 'No genuine IT staff member needs your MFA or verification code to patch your device.',
      everyday: 'Verification codes stating "Do not share with anyone" mean literally no one—not even the bank or support.'
    },
    options: [
      {
        id: 'call-opt-refuse-report',
        text: 'Refuse to share the code. Inform the caller that security policy prohibits sharing verification codes, hang up, and report to security.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'verification', points: 25 },
        consequence: 'You successfully defended against an account takeover. The attacker had your password and needed that OTP to bypass the lock.',
        securityPrinciple: 'OTP Confidentiality Principle',
        saferExplanation: 'OTPs are cryptographic proofs of possession. Disclosing them invalidates all second-factor security.'
      },
      {
        id: 'call-opt-give-code',
        text: 'Read out the 6-digit PIN so Patrick can fix the network degradation before other coworkers complain.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'verification', points: -20 },
        consequence: 'The attacker immediately enters the code, logs into your workstation identity, and registers their own device as primary.',
        securityPrinciple: 'Vishing & Token Interception',
        saferExplanation: 'Attackers manufacture crisis narratives specifically to get victims to override clear warning text.'
      },
      {
        id: 'call-opt-ask-manager',
        text: 'Put Patrick on hold and ask your teammate across the room if Patrick is a real person in infrastructure.',
        safety: 'partial',
        score: 10,
        skillImpact: { skill: 'verification', points: 5 },
        consequence: 'Your teammate does not know, but while you are asking, the attacker stays on the line applying pressure.',
        securityPrinciple: 'Direct Policy Enforcement',
        saferExplanation: 'Even if Patrick were a real employee, sharing an OTP violates protocol. Refusal should be immediate based on policy.'
      }
    ]
  },

  // ==========================================
  // SCENARIO 5: The Shared Document
  // ==========================================
  {
    id: 'sc-shared-doc-1',
    title: 'The Shared Document Login',
    category: 'phishing',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'You receive a notification that looks like Microsoft SharePoint or Google Drive: "Project Manager Elena Rostova shared Q4_Salary_Adjustments_CONFIDENTIAL.xlsx with you." You click the link, and a page appears displaying the familiar login screen with a URL bar showing `https://onedrive-secure-viewer.portal-sync8.com/login`.',
    simulatedType: 'browser',
    simulatedData: {
      browserUrl: 'https://onedrive-secure-viewer.portal-sync8.com/login?doc=Q4_Salary',
      sslStatus: 'Secure (SSL Active)',
      loginTitle: 'Sign in with your Organization Credentials',
      mockFormUser: 'alex.taylor@company.com',
      documentPreview: 'Blurred spreadsheet with column header "2026 Executive Compensation"'
    },
    learningObjective: 'Inspect domains on file-sharing portals and recognize reverse-proxy credential harvesting pages.',
    safetyTakeaway: 'Having an SSL padlock (HTTPS) only means the connection is encrypted—it does not mean the website owner is legitimate or safe.',
    options: [
      {
        id: 'doc-opt-check-domain-abort',
        text: 'Notice the domain is `portal-sync8.com` rather than the official domain, close the tab, and verify directly with Elena via direct chat.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'browsing', points: 20 },
        consequence: 'Elena confirms she never sent any spreadsheet. You spotted an adversary-in-the-middle phishing site targeting curious employees.',
        securityPrinciple: 'Domain Attribution & Social Curiosity Traps',
        saferExplanation: 'Attackers use provocative file names ("Salary", "Layoffs") to trigger curiosity so victims ignore the fake URL domain.'
      },
      {
        id: 'doc-opt-sign-in',
        text: 'Enter your corporate password into the login box so you can read the salary spreadsheet.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'phishing', points: -20 },
        consequence: 'Your credentials were immediately harvested and forwarded to an automated credential-replay bot.',
        securityPrinciple: 'Phishing Reverse Proxies',
        saferExplanation: 'Checking the root domain before entering credentials is the fundamental rule of authentication hygiene.'
      },
      {
        id: 'doc-opt-enter-fake-pass',
        text: 'Type in a deliberately fake password like `Testing123!` to see if the system rejects it.',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: 'browsing', points: 0 },
        consequence: 'The phishing page records your username and IP address, and redirects you anyway, confirming your active email to spam syndicates.',
        securityPrinciple: 'Do Not Interact With Hostile Forms',
        saferExplanation: 'Interacting with malicious portals validates your active presence and exposes metadata. Simply exit.'
      }
    ]
  },

  // ==========================================
  // SCENARIO 6: The Suspicious USB Drive
  // ==========================================
  {
    id: 'sc-usb-drive-1',
    title: 'The "Executive Bonus" USB Drive',
    category: 'incident',
    difficulty: 'beginner',
    estimatedReadingSec: 20,
    narrative: 'While walking through the shared breakroom, you spot a sleek metal USB flash drive lying on the coffee counter. Written on masking tape on the casing is: "Q1 Exec Bonus Structure - Confidential". What do you do with it?',
    simulatedType: 'usb',
    simulatedData: {
      usbLabel: 'Q1 Exec Bonus Structure - Confidential',
      capacity: '64 GB High-Speed USB 3.2',
      locationFound: 'Breakroom Table 4',
      riskFactor: 'Unknown Removable Media / USB Drop Attack'
    },
    learningObjective: 'Prevent BadUSB and dropped media malware attacks by adhering to hardware isolation protocols.',
    safetyTakeaway: 'Never plug unknown USB devices into any computer. Malicious flash drives can emulate keyboards to execute instant payloads.',
    profileFlavor: {
      office: 'Curiosity drops are a classic physical penetration testing and cyber espionage tactic.',
      admin: 'USB devices can execute Rubber Ducky keyboard injection attacks in milliseconds without relying on autorun.',
      everyday: 'An untrusted flash drive can destroy hardware with high-voltage discharge or install stealth spyware.'
    },
    options: [
      {
        id: 'usb-opt-hand-to-security',
        text: 'Do not plug it in. Pick it up and hand it directly to the physical security desk or IT Security team for investigation.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'incident', points: 25 },
        consequence: 'Security checks the drive in an air-gapped forensic lab and discovers it was an automated BadUSB attack device.',
        securityPrinciple: 'Removable Media Defense & Physical Security',
        saferExplanation: 'Reporting unvetted media protects workstations from firmware-level keystroke injection payloads.'
      },
      {
        id: 'usb-opt-plug-in-check',
        text: 'Plug it into your computer just for a few seconds to see who owns the files so you can return it to them.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'incident', points: -20 },
        consequence: 'Within 250 milliseconds of insertion, the microcontroller emulated a fast HID keyboard and spawned a hidden reverse shell.',
        securityPrinciple: 'Hardware Keystroke Injection Vulnerability',
        saferExplanation: 'Operating systems trust USB keyboards implicitly; "just looking" is all a malicious USB device needs to compromise a machine.'
      },
      {
        id: 'usb-opt-plug-personal',
        text: 'Take it home and plug it into your personal old computer that does not have work data on it.',
        safety: 'risky',
        score: -15,
        skillImpact: { skill: 'privacy', points: -15 },
        consequence: 'The payload infects your home router and captures your personal banking credentials over the local network.',
        securityPrinciple: 'Personal Device Hygiene',
        saferExplanation: 'Personal machines are often less protected and share networks with other sensitive personal IoT devices.'
      }
    ]
  },

  // ==========================================
  // SCENARIO 7: The Public Wi-Fi Trap
  // ==========================================
  {
    id: 'sc-wifi-trap-1',
    title: 'The Public Wi-Fi Trap',
    category: 'browsing',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'You are waiting at an international airport terminal before boarding. You need to review a sensitive quarterly financial sheet and approve a customer contract. Your Wi-Fi menu displays "Airport_Free_Fast_WiFi" with no lock icon, and an open network called "Terminal_Lounge_5G_VIP".',
    simulatedType: 'wifi',
    simulatedData: {
      networks: [
        { ssid: 'Airport_Free_Fast_WiFi', security: 'Open (Unencrypted)', signal: '95%' },
        { ssid: 'Terminal_Lounge_5G_VIP', security: 'Open (Unencrypted)', signal: '90%' },
        { ssid: 'Airport_Secure_Corporate', security: 'WPA3 Enterprise (Certificate required)', signal: '70%' }
      ],
      captivePortalWarning: 'Captive portal asks to install "WiFi Optimization Security Profile .mobileconfig"'
    },
    learningObjective: 'Safely operate on public networks using corporate VPNs or cellular hotspots without installing untrusted profiles.',
    safetyTakeaway: 'Never install configuration profiles or certificates to connect to public Wi-Fi. Always tunnel sensitive work via trusted VPN or personal mobile hotspot.',
    options: [
      {
        id: 'wifi-opt-hotspot-vpn',
        text: 'Switch on your mobile phone\'s encrypted cellular hotspot and connect your corporate VPN before opening the financial documents.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'browsing', points: 25 },
        consequence: 'Your traffic is safely routed through isolated cellular spectrum and corporate encrypted tunnels, completely evading local network snoopers.',
        securityPrinciple: 'Cellular Tethering & Encrypted Tunnels',
        saferExplanation: 'Cellular hotspots prevent local evil-twin attacks, rogue DNS poisoning, and captive portal interception.'
      },
      {
        id: 'wifi-opt-install-profile',
        text: 'Connect to "Terminal_Lounge_5G_VIP" and agree to download the requested "WiFi Optimization Security Profile".',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'browsing', points: -25 },
        consequence: 'The profile installs a malicious root Certificate Authority (CA) that enables the attacker to decrypt your HTTPS traffic.',
        securityPrinciple: 'Rogue Root CA Injection',
        saferExplanation: 'Installing network configuration profiles or root certificates allows untrusted actors to break SSL/TLS encryption.'
      },
      {
        id: 'wifi-opt-connect-no-vpn',
        text: 'Connect to Airport_Free_Fast_WiFi without a VPN, assuming HTTPS in your browser is enough to protect everything.',
        safety: 'partial',
        score: 10,
        skillImpact: { skill: 'browsing', points: 5 },
        consequence: 'While HTTPS protects payloads, local DNS queries and unencrypted traffic are exposed to passive network monitoring.',
        securityPrinciple: 'Limitations of Transport Layer Security on Open LANs',
        saferExplanation: 'Open LANs expose device hostnames, DNS lookups, and local peer vulnerabilities unless tunneled.'
      }
    ]
  },

  // ==========================================
  // SCENARIO 8: The Reused Password
  // ==========================================
  {
    id: 'sc-reused-pwd-1',
    title: 'The Compromised Fitness App',
    category: 'authentication',
    difficulty: 'beginner',
    estimatedReadingSec: 20,
    narrative: 'You read news that a popular fitness tracking app you used in 2023 was breached, leaking 15 million user passwords. You remember you used the same favorite password (`CascadeSummer#2024`) on that app as you use on your email and primary online shopping account.',
    simulatedType: 'password',
    simulatedData: {
      breachName: 'FitTrack Global Data Breach',
      exposedFields: 'Email addresses, Salted MD5 Passwords, Dates of birth',
      affectedCount: '15,200,000 accounts',
      reuseRisk: 'HIGH - Identical password identified across multiple personal accounts'
    },
    learningObjective: 'Adopt unique passwords per service, password managers, and passkeys to defeat credential stuffing.',
    safetyTakeaway: 'Password reuse turns a breach on a low-importance website into a direct threat to your most sensitive accounts.',
    options: [
      {
        id: 'pwd-opt-manager-passkeys',
        text: 'Adopt a password manager to generate unique, complex passwords for every account and enable passkeys or app-based 2FA where available.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'authentication', points: 25 },
        consequence: 'Every service now possesses an independent cryptographic key or random password, insulating you completely from future third-party breaches.',
        securityPrinciple: 'Credential Isolation & Zero-Knowledge Password Management',
        saferExplanation: 'Unique passwords guarantee that one compromise never cascades across your digital life.'
      },
      {
        id: 'pwd-opt-minor-tweak',
        text: 'Change your password to `CascadeSummer#2025` across all your services so you can easily remember it.',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: 'authentication', points: -5 },
        consequence: 'Automated brute-force wordlists and rule-based cracking tools guess incremented years within seconds.',
        securityPrinciple: 'Predictable Password Mutation Pitfall',
        saferExplanation: 'Attackers run mutation rules (e.g. changing 2024 to 2025 or adding an exclamation point) during automated stuffing runs.'
      },
      {
        id: 'pwd-opt-do-nothing',
        text: 'Do nothing until you notice suspicious purchases, because the fitness app was breached a month ago.',
        safety: 'critical',
        score: -20,
        skillImpact: { skill: 'authentication', points: -20 },
        consequence: 'Adversaries sell the breached database on underground markets, leading to silent takeovers of your secondary accounts.',
        securityPrinciple: 'Proactive Threat Mitigation',
        saferExplanation: 'Breached credentials circulate for years. Waiting for damage guarantees victimization.'
      }
    ]
  },

  // ==========================================
  // SCENARIO 9: The Fake Job Offer
  // ==========================================
  {
    id: 'sc-fake-job-1',
    title: 'The Dream Remote Job Offer',
    category: 'privacy',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'A talent acquisition recruiter reaches out on professional social media offering you a high-paying remote consulting role with flexible hours. After a brief chat interview over an encrypted messaging app, they send an immediate offer letter and ask for a copy of your passport and a $250 equipment registration fee.',
    simulatedType: 'job',
    simulatedData: {
      recruiter: 'Chloe Bennett - Global Talent Partners',
      role: 'Senior Project Advisor (Remote)',
      salary: '$145,000 / year (Part-time, 15 hrs/wk)',
      requestDetails: 'Please provide high-res scans of Passport + Driver License + $250 background processing check fee via wire/gift card.',
      badge: 'URGENT ACCEPTANCE REQUIRED WITHIN 24 HOURS'
    },
    learningObjective: 'Identify employment scams, protect government identity documents, and recognize payment advance fraud.',
    safetyTakeaway: 'Legitimate employers never conduct entire hiring processes through messaging apps alone, never demand advance payments, and never ask for fees for equipment.',
    options: [
      {
        id: 'job-opt-verify-decline',
        text: 'Recognize the red flags (upfront fee, no video interview, high salary for low hours), decline, and report the account on the platform.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'privacy', points: 25 },
        consequence: 'You avoided identity theft and financial fraud. The profile was an imposter using stolen headshots.',
        securityPrinciple: 'Employment Scam Indicators & Identity Theft Prevention',
        saferExplanation: 'No legitimate organization requires job applicants to pay upfront fees or submit passports over informal chat channels.'
      },
      {
        id: 'job-opt-send-passport-pay',
        text: 'Pay the $250 and send your passport scan so you do not lose this lucrative career opportunity.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'privacy', points: -25 },
        consequence: 'The scammer steals your money and uses your passport to open fraudulent bank accounts and obtain synthetic loans in your name.',
        securityPrinciple: 'Advance-Fee Fraud & Identity Syndication',
        saferExplanation: 'Government identity documents are prized assets for synthetic identity creation.'
      },
      {
        id: 'job-opt-send-passport-only',
        text: 'Refuse to pay the $250 fee, but send your passport scan to prove you are a serious applicant.',
        safety: 'critical',
        score: -20,
        skillImpact: { skill: 'privacy', points: -20 },
        consequence: 'Even without the $250, the attacker gained your high-resolution passport copy, which is worth hundreds of dollars in darknet identity rings.',
        securityPrinciple: 'High-Value Identity Asset Safeguarding',
        saferExplanation: 'Your government ID is infinitely more valuable to identity thieves than a one-time cash fee.'
      }
    ]
  },

  // ==========================================
  // SCENARIO 10: The Browser Warning
  // ==========================================
  {
    id: 'sc-browser-warn-1',
    title: 'The Certificate Security Warning',
    category: 'browsing',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'While trying to access your company\'s employee portal from a hotel network, your browser displays a full-screen red warning: "Your connection is not private. Attackers might be trying to steal your information from payroll.apexcloud.internal (NET::ERR_CERT_COMMON_NAME_INVALID)." There is an option at the bottom that says "Advanced -> Proceed anyway (unsafe)".',
    simulatedType: 'browser',
    simulatedData: {
      warningType: 'NET::ERR_CERT_COMMON_NAME_INVALID',
      urlAttempted: 'https://payroll.apexcloud.internal/portal/tax',
      presentedCertSubject: '*.hotel-guest-gateway.traffic-inspect.com',
      issuer: 'Untrusted Local Gateway Proxy CA',
      browserPrompt: 'Attackers might be trying to steal your passwords or credit cards.'
    },
    learningObjective: 'Respect browser TLS/SSL certificate warnings and never bypass invalid certificate screens on untrusted networks.',
    safetyTakeaway: 'Certificate errors mean the encryption key does not match the true server. Bypassing it exposes all passwords to active interception (MitM).',
    options: [
      {
        id: 'cert-opt-halt-investigate',
        text: 'Do NOT proceed. Disconnect from that network immediately and report the certificate mismatch to the security team.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'browsing', points: 25 },
        consequence: 'You thwarted an active Man-in-the-Middle (MitM) interception where the hotel gateway was attempting to decrypt your SSL sessions.',
        securityPrinciple: 'Transport Layer Security & MitM Defense',
        saferExplanation: 'Browsers show certificate warnings when someone is actively impersonating the destination server or tampering with traffic.',
        nextScenarioId: 'sc-invoice-1' // Continuing to next scheduled challenge
      },
      {
        id: 'cert-opt-proceed-unsafe',
        text: 'Click "Advanced" and then click "Proceed to payroll.apexcloud.internal (unsafe)" to get your work done quickly.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'browsing', points: -25 },
        consequence: 'The proxy gateway intercepted your login submission in plain text, capturing your session token and employee credentials.',
        securityPrinciple: 'Certificate Validation Bypasses',
        saferExplanation: 'Bypassing TLS warnings explicitly disables the core protective mechanism that guarantees server identity.',
        nextScenarioId: 'sc-mfa-compromise' // Branching: Incident recovery
      },
      {
        id: 'cert-opt-try-http',
        text: 'Change the URL in the address bar from `https://` to `http://` so the security warning disappears.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'browsing', points: -25 },
        consequence: 'Now your entire session is transmitted with zero encryption, broadcasting your credentials to anyone on the same Wi-Fi.',
        securityPrinciple: 'Insecure Plaintext Protocol Downgrade',
        saferExplanation: 'Downgrading to HTTP strips all encryption, handing attackers plain-text credentials on a silver platter.'
      }
    ]
  },

  // ==========================================
  // SCENARIO 11: The Accidental Data Share
  // ==========================================
  {
    id: 'sc-accidental-share-1',
    title: 'The Accidental Recipient',
    category: 'privacy',
    difficulty: 'intermediate',
    estimatedReadingSec: 20,
    narrative: 'You just emailed an unencrypted spreadsheet containing employee tax identification numbers and home addresses to an external client. Ten seconds later, you notice your email client autofilled "dave.wilson@competitor-firm.com" instead of your internal colleague "dave.wilson@apexcloud.internal".',
    simulatedType: 'email',
    simulatedData: {
      recipient: 'dave.wilson@competitor-firm.com',
      subject: 'FWD: Employee_Tax_Records_2026_Final.xlsx',
      bodySnippet: 'Attached are the requested records for the HR audit...',
      status: 'Message Sent (Delivered to external mail exchange)'
    },
    learningObjective: 'Follow incident reporting, data breach containment, and prompt disclosure protocols when sensitive data is exposed.',
    safetyTakeaway: 'Accidents happen. The difference between a manageable mistake and a disastrous breach is rapid containment and truthful reporting.',
    profileFlavor: {
      office: 'Data privacy regulations (like GDPR/CCPA) impose strict notification timelines starting the minute an exposure occurs.',
      admin: 'Immediate technical actions (such as mail transport tenant message recall) can only occur if reported instantly.',
      everyday: 'Never try to cover up an accidental send; proactive reporting protects everyone involved.'
    },
    options: [
      {
        id: 'data-opt-contain-report',
        text: 'Immediately attempt an Exchange/tenant message recall, notify your Privacy & Security officer, and document the exact records exposed.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'privacy', points: 25 },
        consequence: 'IT mail administrators trigger an external domain purge request and privacy counsel contacts the recipient firm for legal attestation of deletion.',
        securityPrinciple: 'Rapid Incident Containment & Transparent Disclosure',
        saferExplanation: 'Swift, transparent disclosure minimizes legal liability and enables security teams to enact mitigation.'
      },
      {
        id: 'data-opt-delete-sent',
        text: 'Quickly delete the message from your Sent Items folder and hope Dave at the competitor firm doesn\'t notice or open it.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'incident', points: -25 },
        consequence: 'Deleting local sent items does not stop the email on the recipient server. Weeks later, the leak is uncovered and you face termination for concealment.',
        securityPrinciple: 'Breach Concealment vs Fiduciary Responsibility',
        saferExplanation: 'Hiding a data exposure turns an innocent human error into willful negligence and severe regulatory penalties.'
      },
      {
        id: 'data-opt-beg-delete',
        text: 'Send Dave an urgent follow-up email begging him not to open the previous email and promise not to tell anyone.',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: 'privacy', points: 0 },
        consequence: 'Your frantic email draws Dave\'s immediate attention to the confidential spreadsheet which he otherwise might have skipped.',
        securityPrinciple: 'Coordinated Legal & Compliance Remediation',
        saferExplanation: 'Informal pleas lack legal weight and draw unwanted attention to sensitive data before containment is established.'
      }
    ]
  },

  // ==========================================
  // SCENARIO 12: The Fake CEO Message
  // ==========================================
  {
    id: 'sc-fake-ceo-1',
    title: 'The Executive WhatsApp Directive',
    category: 'verification',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'You receive an SMS and WhatsApp message from an unknown number with the profile photo of your company\'s Chief Executive Officer: "Alex, I am in an urgent closed-door board meeting regarding an unannounced acquisition. I need you to purchase 10 x $100 Apple gift cards for the advisory partners right now. Do not call my line as I cannot speak."',
    simulatedType: 'chat',
    simulatedData: {
      chatSender: 'Victoria Sterling (CEO)',
      senderPhone: '+1 (555) 018-9921',
      profilePic: 'Corporate Headshot (Public LinkedIn)',
      chatMessage: 'Alex, I am relying on your discretion. Purchase the digital gift cards and scratch the backs to send me photos of the redemption codes. Expense it to corporate overhead.',
      urgency: 'HIGH - BOARD MEETING IN PROGRESS'
    },
    learningObjective: 'Recognize executive impersonation (CEO fraud) and gift card procurement scams.',
    safetyTakeaway: 'No executive or legitimate organization asks staff to buy gift cards or bypass financial controls for confidential deals.',
    profileFlavor: {
      office: 'Executive impersonation exploits authority bias and fear of questioning leadership.',
      student: 'Scammers frequently impersonate deans or professors asking students or research assistants for gift card codes.',
      everyday: 'Any request to buy gift cards and send photo codes is ALWAYS 100% a scam.'
    },
    options: [
      {
        id: 'ceo-opt-verify-channel',
        text: 'Do not buy anything. Contact the CEO\'s executive assistant via standard internal corporate channels to verify the request.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'verification', points: 25 },
        consequence: 'The executive assistant confirms the CEO is on vacation with family and that this is a widespread executive impersonation scam.',
        securityPrinciple: 'Authority Bias Resistance & Out-of-Band Validation',
        saferExplanation: 'Scammers deliberately invent secrecy ("closed-door board meeting", "do not call") to prevent victims from verifying with others.'
      },
      {
        id: 'ceo-opt-buy-cards',
        text: 'Rush to the nearest store, buy the gift cards with your credit card, and send the scratched code photos to impress the CEO.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'verification', points: -25 },
        consequence: 'The scammer drains the gift card balances within 90 seconds. Your expense claim is rejected as unauthorized personal spending.',
        securityPrinciple: 'Gift Card Scams & Non-Repudiation',
        saferExplanation: 'Gift cards cannot be tracked, reversed, or refunded once redeemed, making them the favorite currency of cybercriminals.'
      },
      {
        id: 'ceo-opt-reply-phone',
        text: 'Text the unknown number back saying: "Ms. Sterling, please call me when the meeting ends so I can confirm your credit card number."',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: 'verification', points: 0 },
        consequence: 'The scammer continues to pressure you with manufactured anger about missing crucial board deadlines.',
        securityPrinciple: 'Never Negotiate With Untrusted Inbound Numbers',
        saferExplanation: 'Replying keeps you engaged in the scammer\'s psychological funnel. Escalate only via vetted internal channels.'
      }
    ]
  }
];

export const SCENARIO_MAP = new Map<string, Scenario>(
  SCENARIOS.map(s => [s.id, s])
);

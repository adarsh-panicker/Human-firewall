import { Scenario } from '../types/game';

export const SCENARIOS: Scenario[] = [
  // ==========================================
  // EVERYDAY HOME SCENARIOS (For Everyday Users & Home Life)
  // ==========================================

  // EVERYDAY 1: Fake Package Delivery SMS (Smishing)
  {
    id: 'sc-home-delivery-1',
    title: 'The "Undelivered Package" Redirection Text',
    category: 'phishing',
    audience: 'everyday',
    difficulty: 'beginner',
    estimatedReadingSec: 20,
    narrative: 'While cooking dinner at home, your phone buzzes with a text message: "USPS Notification: Your parcel #940011827 cannot be delivered due to an incomplete street address. Please update your address and confirm a $1.45 redelivery fee within 12 hours: https://usps-redelivery-postal-sync.com/track". You recently ordered a pair of shoes online.',
    simulatedType: 'sms',
    simulatedData: {
      senderPhone: '+1 (555) 019-3321',
      sender: 'USPS Postal Service Alert',
      message: 'USPS Notice: Parcel delivery held at local depot. Incomplete street address recorded. Update address & pay $1.45 rescheduling fee: https://usps-redelivery-postal-sync.com/track?id=940011827',
      urgentBadge: 'HOLD AT LOCAL DEPOT'
    },
    learningObjective: 'Recognize package delivery SMS phishing (Smishing) and fake fee traps.',
    safetyTakeaway: 'Postal carriers (USPS, FedEx, UPS) never send texts from random mobile numbers demanding card payments to deliver packages. Always track packages inside official apps.',
    forensicClues: [
      {
        id: 'clue-sms-domain',
        element: 'URL: usps-redelivery-postal-sync.com',
        description: 'Lookalike Domain: Official postal service is usps.com. The hyphenated domain is registered by scammers.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-sms-phone',
        element: 'Sent from normal 10-digit mobile number (+1 555 019-3321)',
        description: 'Random Number: Legitimate courier notifications arrive via verified 5-digit shortcodes, not random personal mobile lines.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-sms-fee',
        element: 'Demand for $1.45 fee',
        description: 'Credit Card Harvester: The $1.45 fee is an excuse to get you to type your credit card and CVV into their fake site.',
        redFlagLevel: 'critical'
      }
    ],
    profileFlavor: {
      everyday: 'This is the #1 most common scam message sent to mobile phones in the world today.'
    },
    options: [
      {
        id: 'del-opt-ignore-official',
        text: 'Do not click the link. Open the official USPS app or website directly and type in your actual order number from your merchant receipt.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'phishing', points: 25 },
        consequence: 'The official tracking confirms your real package is already out for delivery. You avoided handing your credit card to an identity theft ring.',
        securityPrinciple: 'Independent App Verification (Anti-Smishing)',
        saferExplanation: 'Navigating independently to official merchant or courier portals completely neutralizes SMS phishing links.'
      },
      {
        id: 'del-opt-click-pay',
        text: 'Click the link, enter your home address, and type in your debit card number to pay the $1.45 fee so your shoes don\'t get sent back.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'phishing', points: -25 },
        consequence: 'Within minutes, the scammers charge thousands of dollars of unauthorized gift card purchases to your stolen card details.',
        securityPrinciple: 'Credit Card Harvesting Scams',
        saferExplanation: 'Couriers do not charge micro-fees via unsolicited text links to deliver standard parcel shipments.'
      },
      {
        id: 'del-opt-reply-stop',
        text: 'Text back "STOP" or "Who is this?" to remove your number from their list.',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: 'privacy', points: 0 },
        consequence: 'Replying confirms to the automated scam bot that your phone number is active and monitored, triggering a surge of spam calls.',
        securityPrinciple: 'Never Engage With Untrusted Spam Senders',
        saferExplanation: 'Replying to spam validates your line to scammers. Simply delete and block the number.'
      }
    ]
  },

  // EVERYDAY 2: Fake Netflix / Streaming Account Suspended
  {
    id: 'sc-home-netflix-1',
    title: 'The "Streaming Account Suspended" Email',
    category: 'phishing',
    audience: 'everyday',
    difficulty: 'beginner',
    estimatedReadingSec: 20,
    narrative: 'You sit down on Friday evening to watch a movie. An email arrives in your personal inbox from "Netflix Billing": "We were unable to process your monthly membership payment. Your subscription is temporarily on hold. Please update your payment information within 24 hours to keep watching."',
    simulatedType: 'email',
    simulatedData: {
      senderName: 'Netflix Member Services',
      senderEmail: 'billing-update@stream-renewal-portal.net',
      subject: 'Notice: Your membership is suspended - Update billing info',
      date: 'Today, 7:15 PM',
      emailBody: 'Hi Valued Member,\n\nWe had trouble authorizing your payment for the next billing cycle. As a result, streaming access will be paused tonight unless billing info is updated.\n\nPlease click below to re-verify your credit card:\n[ UPDATE PAYMENT NOW ]\n\nThe Netflix Team'
    },
    learningObjective: 'Inspect personal subscription phishing emails and verify billing inside the official mobile or TV app.',
    safetyTakeaway: 'Never click payment update links in personal emails. Check your subscription status directly inside your smart TV or phone app.',
    forensicClues: [
      {
        id: 'clue-net-sender',
        element: 'Sender: billing-update@stream-renewal-portal.net',
        description: 'Fake Domain: Notice the email comes from stream-renewal-portal.net, not the official netflix.com.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-net-urgency',
        element: 'Urgency: "Access paused tonight unless updated within 24 hours"',
        description: 'Urgency Manipulation: Exploits your Friday evening leisure time so you rush to update without thinking.',
        redFlagLevel: 'moderate'
      }
    ],
    options: [
      {
        id: 'net-opt-app-check',
        text: 'Do not click any email link. Open the Netflix app directly on your smart TV or smartphone and check Account Settings > Membership.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'phishing', points: 25 },
        consequence: 'Your TV app streams without issue and shows your next billing date is in 3 weeks. The email was a credential and credit card trap.',
        securityPrinciple: 'In-App Account Verification',
        saferExplanation: 'Checking billing directly inside trusted device applications bypasses deceptive email links entirely.'
      },
      {
        id: 'net-opt-click-update',
        text: 'Click "Update Payment Now" in the email, and enter your credit card number, expiration, and CVV code.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'phishing', points: -25 },
        consequence: 'Your credit card details and Netflix login were sent straight to an account-reselling syndicate on Telegram.',
        securityPrinciple: 'Subscription Phishing Exploitation',
        saferExplanation: 'Phishers harvest credit cards by impersonating popular entertainment subscriptions.'
      },
      {
        id: 'net-opt-reply-email',
        text: 'Reply to the email asking what happened to your auto-pay.',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: 'verification', points: 0 },
        consequence: 'The scammer responds immediately with another link pretending to be customer support.',
        securityPrinciple: 'Avoid In-Band Replies',
        saferExplanation: 'Replying to fake billing emails keeps you interacting with the scammer.'
      }
    ]
  },

  // EVERYDAY 3: Fake Bank Fraud Alert & Zelle Vishing
  {
    id: 'sc-home-bank-sms-1',
    title: 'The Fake Bank Fraud Alert & Zelle Call',
    category: 'verification',
    audience: 'everyday',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'You receive an urgent text: "BANK FRAUD ALERT: Did you authorize a $780.00 Zelle transfer to \'Marcus Vance\'? Reply YES or NO." You reply NO. Seconds later, your phone rings. The caller ID displays your bank\'s name. The caller says: "Hello, this is Fraud Prevention. To block this $780 theft, we just sent a 6-digit confirmation code to your phone. Read it to me to reverse the charge."',
    simulatedType: 'call',
    simulatedData: {
      callerId: 'YOUR BANK FRAUD DEPT (+1 800 555-0199)',
      callerName: 'Fraud Prevention Agent (Claimed)',
      smsReceived: 'CONFIRMATION CODE: 849-110. DO NOT SHARE. Bank agents will never ask for this code. Entering this code authorizes an instant transfer.',
      duration: '00:22'
    },
    learningObjective: 'Defend against the #1 banking scam: Bank Impersonation Zelle Vishing.',
    safetyTakeaway: 'Banks NEVER call you asking for a one-time passcode to reverse a charge. The code they sent is actually AUTHORIZING the theft.',
    forensicClues: [
      {
        id: 'clue-bank-sms-text',
        element: 'SMS Text: "Bank agents will never ask for this code"',
        description: 'Explicit Bank Warning: The bank\'s real system generated this code because the scammer is trying to transfer money OUT of your account.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-bank-spoof',
        element: 'Inbound Caller ID matching your bank',
        description: 'Caller ID Spoofing: Any scammer with internet software can display your bank\'s real phone number on your screen.',
        redFlagLevel: 'critical'
      }
    ],
    options: [
      {
        id: 'bank-opt-hangup-card',
        text: 'Hang up immediately. Take your physical debit/credit card out of your wallet, and dial the exact customer service number printed on the back.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'verification', points: 25 },
        consequence: 'The real bank confirms your account is secure and that no $780 transfer existed. The scammer was trying to get your code to drain your account.',
        securityPrinciple: 'Physical Card Verification Protocol',
        saferExplanation: 'Calling the phone number physically printed on the back of your bank card guarantees you reach the authentic fraud team.'
      },
      {
        id: 'bank-opt-read-code',
        text: 'Read the 6-digit code to the agent so they can reverse the $780 transaction and protect your checking account.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'verification', points: -25 },
        consequence: 'Reading the code allows the scammer to complete the instant transfer. $780 is drained from your checking account within seconds.',
        securityPrinciple: 'Reverse-Authorization Social Engineering',
        saferExplanation: 'Scammers invent fake fraudulent charges to panic victims into giving away the authorization code for real theft.'
      },
      {
        id: 'bank-opt-ask-questions',
        text: 'Stay on the phone and ask the agent to prove they are really from the bank by telling you your last purchase.',
        safety: 'partial',
        score: 10,
        skillImpact: { skill: 'verification', points: 5 },
        consequence: 'The caller uses smooth social engineering to guess recent gas/grocery purchases or applies anger to rush you.',
        securityPrinciple: 'Never Interrogate Callers on Suspicious Inbound Lines',
        saferExplanation: 'Inbound lines are controlled by the scammer. The only safe action is hanging up and calling back.'
      }
    ]
  },

  // EVERYDAY 4: Social Media Friend Account Takeover ("Is this you?")
  {
    id: 'sc-home-friend-hack-1',
    title: 'The "Is This You in This Video?" Friend Message',
    category: 'phishing',
    audience: 'everyday',
    difficulty: 'beginner',
    estimatedReadingSec: 20,
    narrative: 'You receive an Instagram and Facebook direct message from your real high school friend, Maya: "OMG Alex is this video of you circulating on TikTok?? 😱 I hope you\'re okay! Watch it here: https://tikt0k-trending-clip.co/watch?id=499". You know Maya well and she rarely sends links.',
    simulatedType: 'chat',
    simulatedData: {
      chatSender: 'Maya Reynolds (Real Friend Account)',
      profilePic: 'Real Friend Photo',
      chatMessage: 'OMG Alex is this video of you circulating on TikTok?? 😱 I hope you\'re okay! Watch it here before it gets taken down: https://tikt0k-trending-clip.co/watch?id=499',
      urgency: 'FRIEND CONTACT'
    },
    learningObjective: 'Recognize hijacked friend social media accounts and credential harvester links.',
    safetyTakeaway: 'When a friend sends an alarming link ("Is this you?"), their account has been hacked. Never log into third-party video links.',
    forensicClues: [
      {
        id: 'clue-friend-domain',
        element: 'Domain: tikt0k-trending-clip.co (with a zero)',
        description: 'Typosquatting: Notice the number 0 instead of the letter O in tikt0k. It leads to a fake login screen.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-friend-emotion',
        element: 'Panic bait: "OMG is this video of you??"',
        description: 'Emotional Curiosity: Uses social embarrassment panic to override critical thinking.',
        redFlagLevel: 'moderate'
      }
    ],
    options: [
      {
        id: 'friend-opt-phone-text',
        text: 'Do not click the link. Call or text Maya on her real cell phone number to tell her that her social media account was compromised.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'phishing', points: 25 },
        consequence: 'Maya confirms she was locked out of her Instagram 2 hours ago. You saved your own account and helped her start account recovery.',
        securityPrinciple: 'Out-of-Band Friend Verification',
        saferExplanation: 'When friend accounts behave unusually, verify via regular SMS or phone call before clicking links.'
      },
      {
        id: 'friend-opt-click-login',
        text: 'Click the link in panic. When prompted with "Log in with Instagram to view this video", enter your username and password.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'phishing', points: -25 },
        consequence: 'Your Instagram account is instantly hijacked. The bot begins sending the exact same fake video link to all of your followers.',
        securityPrinciple: 'Social Media Account Worms',
        saferExplanation: 'Entering credentials into fake video players spreads account takeovers exponentially across contact lists.'
      },
      {
        id: 'friend-opt-reply-chat',
        text: 'Reply inside the chat: "Maya what are you talking about? What video?"',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: 'verification', points: 0 },
        consequence: 'The automated bot replies with generic urgent messages: "Just click the link and see for yourself!!"',
        securityPrinciple: 'Automated Social Media Bots',
        saferExplanation: 'The chat is controlled by the attacker. Interacting in-band yields nothing.'
      }
    ]
  },

  // EVERYDAY 5: Fullscreen Browser Virus Pop-Up
  {
    id: 'sc-home-techsupport-1',
    title: 'The Fullscreen "VIRUS DETECTED" Browser Pop-Up',
    category: 'browsing',
    audience: 'everyday',
    difficulty: 'beginner',
    estimatedReadingSec: 20,
    narrative: 'While browsing recipes on your home laptop, your screen suddenly freezes with a loud robotic siren sound. A flashing red screen takes over your entire monitor: "CRITICAL MICROSOFT SECURITY ALERT: Your computer is infected with Trojan.Spyware.32. Financial and banking passwords are being stolen. DO NOT RESTART. Call Microsoft Certified Support immediately: 1-800-555-0144."',
    simulatedType: 'browser',
    simulatedData: {
      browserUrl: 'https://security-windows-defense-alert88.live/warning/scan',
      warningType: 'TROJAN VIRUS INFECTION DETECTED',
      browserPrompt: 'Your PC is blocked. Call Microsoft Support: 1-800-555-0144 immediately to unlock.',
      urgentBadge: 'SIREN SOUNDING'
    },
    learningObjective: 'Recognize browser lock tech support scams and safely close rogue webpages without calling fake phone numbers.',
    safetyTakeaway: 'Real antivirus software and operating systems NEVER display phone numbers for you to call. Browser lock pop-ups are harmless web pages trying to trick you into calling a scammer.',
    forensicClues: [
      {
        id: 'clue-pop-url',
        element: 'URL in address bar: security-windows-defense-alert88.live',
        description: 'Webpage Fake: This is just an ordinary webpage running fullscreen browser mode with audio effects.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-pop-phone',
        element: 'Toll-free telephone number: 1-800-555-0144',
        description: 'Tech Support Scam Call Center: Legitimate operating systems (Windows, macOS) never tell users to call a phone number.',
        redFlagLevel: 'critical'
      }
    ],
    options: [
      {
        id: 'pop-opt-force-close',
        text: 'Do not call. Press Escape to exit fullscreen, or open Task Manager (Ctrl+Shift+Esc / Cmd+Q) to force-close the browser tab, and run your normal built-in antivirus scan.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'browsing', points: 25 },
        consequence: 'The noisy webpage closes instantly. Your computer was never infected—it was just an annoying deceptive webpage.',
        securityPrinciple: 'Browser Isolation & Tech Support Scam Neutralization',
        saferExplanation: 'Recognizing that browser screens cannot scan your hard drive prevents falling for call-center remote access scams.'
      },
      {
        id: 'pop-opt-call-support',
        text: 'Call the 1-800 number displayed on the screen and allow the technician to install remote access software (AnyDesk) to clean your PC.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'browsing', points: -25 },
        consequence: 'The scammer installs software that locks your files, inspects your personal documents, and charges you a $499 fake cleanup fee.',
        securityPrinciple: 'Remote Access Tool (RAT) Social Engineering',
        saferExplanation: 'Calling the number connects you to a high-pressure scam boiler room designed to extort money.'
      },
      {
        id: 'pop-opt-click-clean',
        text: 'Click the "Clean Infection Now" button on the webpage.',
        safety: 'risky',
        score: 0,
        skillImpact: { skill: 'browsing', points: -10 },
        consequence: 'Clicking the button triggers a malicious executable file download onto your computer.',
        securityPrinciple: 'Never Click Buttons on Deceptive Webpages',
        saferExplanation: 'Interactive buttons on fake alert pages trigger rogue software downloads. Close the window directly.'
      }
    ]
  },

  // EVERYDAY 6: Online Marketplace Overpayment Scam
  {
    id: 'sc-home-marketplace-1',
    title: 'The Online Marketplace "Venmo Overpayment"',
    category: 'privacy',
    audience: 'everyday',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'You post an old dining table for sale on Facebook Marketplace for $120. A buyer named "David" messages: "I will take it! I sent you $320 by mistake on Venmo because my assistant added the moving courier fee. I\'ve sent you the confirmation receipt. Can you please refund the extra $200 back to my Zelle right away before the mover arrives?" You receive an email that looks like Venmo saying funds are "Pending refund release."',
    simulatedType: 'chat',
    simulatedData: {
      chatSender: 'David Mitchell (Marketplace Buyer)',
      chatMessage: 'I sent $320 instead of $120! Check your email receipt. Please Zelle me back the $200 difference now so the movers can get on the road!',
      urgency: 'OVERPAYMENT REFUND REQUEST'
    },
    learningObjective: 'Identify marketplace overpayment fraud and fake payment confirmation emails.',
    safetyTakeaway: 'Never send refund money for an overpayment. Scammers send fake payment receipts; no real money was ever sent to you.',
    forensicClues: [
      {
        id: 'clue-mkt-overpay',
        element: 'Accidental Overpayment Narrative ($320 for $120 item)',
        description: 'Classic Overpayment Scheme: Scammers deliberately overpay on paper so you refund them real money from your own pocket.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-mkt-receipt',
        element: 'Email saying "Payment Pending Refund Release"',
        description: 'Forged Email: Venmo and Zelle never hold funds hostage pending a return payment.',
        redFlagLevel: 'critical'
      }
    ],
    options: [
      {
        id: 'mkt-opt-verify-balance',
        text: 'Do not send any money. Open your official Venmo app independently to check your actual cleared balance. Report the buyer on Marketplace for payment fraud.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'privacy', points: 25 },
        consequence: 'Your Venmo balance shows $0.00 received. The email was forged by the scammer. You protected your $200 and stopped the fraud.',
        securityPrinciple: 'Independent In-App Balance Verification',
        saferExplanation: 'Always verify cleared funds directly inside your banking app, never by relying on email receipts.'
      },
      {
        id: 'mkt-opt-refund-200',
        text: 'Send the $200 refund from your personal account to David so he can pay his movers on time.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'privacy', points: -25 },
        consequence: 'You sent $200 of your own real money to the scammer. The fake $320 payment never existed.',
        securityPrinciple: 'Fake Check & Overpayment Fraud',
        saferExplanation: 'Refunding money before funds clear is the classic mechanism of peer-to-peer payment fraud.'
      },
      {
        id: 'mkt-opt-tell-cash-only',
        text: 'Tell David you will only give him the $200 refund in physical cash when the mover arrives at your house.',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: 'incident', points: 0 },
        consequence: 'There is no mover. David continues pressuring you online until you block him.',
        securityPrinciple: 'Recognize Fraud Early',
        saferExplanation: 'Negotiating with scammers wastes time; simply block and report them.'
      }
    ]
  },

  // EVERYDAY 7: Smart Home Camera Default Password
  {
    id: 'sc-home-smart-cam-1',
    title: 'The Home Security Camera Setup',
    category: 'authentication',
    audience: 'everyday',
    difficulty: 'beginner',
    estimatedReadingSec: 20,
    narrative: 'You bought a budget smart home Wi-Fi security camera online to watch your living room and front porch. During initial setup, the mobile app shows: "Camera connected to home Wi-Fi! Default device password is `admin/123456`. Cloud remote viewing is enabled. Would you like to keep default settings or customize your credentials now?"',
    simulatedType: 'password',
    simulatedData: {
      breachName: 'Smart Cam Local Device Configuration',
      exposedFields: 'Default Credentials: admin / 123456',
      affectedCount: 'Single Household IoT Device',
      reuseRisk: 'HIGH - Exposed to automated Shodan/Censys botnet scans'
    },
    learningObjective: 'Change factory default credentials on smart home IoT devices to prevent botnet hijacking and voyeurism.',
    safetyTakeaway: 'Automated internet search engines continuously scan home routers for default passwords. Always set unique, strong credentials on home cameras.',
    forensicClues: [
      {
        id: 'clue-cam-default',
        element: 'Default Password: admin / 123456',
        description: 'Well-Known Default: These credentials are published in public manuals and tested by automated scanning scripts every second.',
        redFlagLevel: 'critical'
      }
    ],
    options: [
      {
        id: 'cam-opt-change-pass',
        text: 'Change the camera admin password to a strong, unique 16-character password immediately and turn on two-factor authentication in the app.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'authentication', points: 25 },
        consequence: 'Your home camera feed is secured against automated internet scanners and privacy snoopers.',
        securityPrinciple: 'IoT Default Credential Remediation',
        saferExplanation: 'Changing default credentials on connected smart home devices prevents unauthorized live-stream viewing.'
      },
      {
        id: 'cam-opt-keep-default',
        text: 'Keep the default password `123456` because it is easy to remember and the camera is just inside your private home.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'authentication', points: -25 },
        consequence: 'Within 48 hours, an automated botnet finds the camera online, adds it to a DDoS zombie network, and exposes your living room video feed on public streaming forums.',
        securityPrinciple: 'IoT Default Password Exploitation',
        saferExplanation: 'Connected devices face the entire global internet; weak passwords allow strangers to access your cameras.'
      },
      {
        id: 'cam-opt-later',
        text: 'Skip this step for now and tell yourself you will change the password next weekend.',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: 'authentication', points: 0 },
        consequence: 'Most users forget to return to settings, leaving the camera exposed for months.',
        securityPrinciple: 'Security at Inception',
        saferExplanation: 'Securing hardware during setup takes 30 seconds and prevents long-term neglect.'
      }
    ]
  },

  // ==========================================
  // SCENARIO 1: Unexpected MFA Request (Core + Branching Root)
  // ==========================================
  {
    id: 'sc-mfa-1',
    title: 'The Unexpected Login Push',
    category: 'authentication',
    audience: 'everyday',
    difficulty: 'beginner',
    estimatedReadingSec: 25,
    narrative: 'You are relaxing on the couch in the evening when your phone buzzes with an unexpected Two-Factor / MFA login notification for your primary account. Seconds later, a message pops up from someone named "Devon - Support": "Hey! We are updating server security. Please tap Approve on your phone notification so your account stays active."',
    simulatedType: 'mfa',
    simulatedData: {
      appName: 'Authenticator Push Alert',
      account: 'alex.taylor@my-personal-cloud.net',
      service: 'Account Sign-in Attempt',
      location: 'Bucharest, Romania (IP: 185.220.101.44)',
      time: 'Just now',
      chatSender: 'Devon - Support Message',
      chatAvatar: 'DV',
      chatMessage: 'Hey! We are updating server security. Please tap Approve on your phone notification so your account stays active.',
      authCode: '849-210'
    },
    learningObjective: 'Recognize MFA fatigue attacks and never approve an authentication request you did not personally trigger.',
    safetyTakeaway: 'An unexpected MFA prompt means someone has your password. Treat unprompted MFA pushes as unauthorized access attempts.',
    forensicClues: [
      {
        id: 'clue-mfa-geo',
        element: 'Location: Bucharest, Romania (IP: 185.220.101.44)',
        description: 'Geolocation Anomaly: The authentication request originates from a foreign IP while you are in your home.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-mfa-chat',
        element: 'Devon (Support Message)',
        description: 'Impersonation & Coercion: Real support staff never message you asking to approve unexpected login prompts.',
        redFlagLevel: 'critical'
      }
    ],
    profileFlavor: {
      admin: 'IT Administrator context: Adversaries use MFA push bombing to bypass traditional second factors when credentials have already leaked.',
      office: 'Office context: IT will never ask you in an ad-hoc direct chat to approve an unexpected login prompt.',
      student: 'Student context: Campus portals often get targeted with credential stuffing; unexpected prompts mean someone tried your password.',
      everyday: 'Never tap "Approve" when you were not actively trying to sign in to that account.'
    },
    options: [
      {
        id: 'mfa-opt-approve',
        text: 'Tap "Approve" to avoid getting your account locked as Devon requested.',
        safety: 'critical',
        score: -20,
        skillImpact: { skill: 'authentication', points: -15 },
        consequence: 'You granted the attacker instant access to your account and personal files. The message was an imposter.',
        securityPrinciple: 'MFA Fatigue & Push Exploitation',
        saferExplanation: 'MFA exists precisely to stop unauthorized logins. Approving an uninitiated prompt hands the intruder your account keys.',
        nextScenarioId: 'sc-mfa-compromise'
      },
      {
        id: 'mfa-opt-deny-report',
        text: 'Tap "Deny" immediately, change your password, and report the unauthorized access attempt.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'authentication', points: 20 },
        consequence: 'You stopped the unauthorized intruder dead in their tracks and protected your account.',
        securityPrinciple: 'Zero Trust & Incident Reporting',
        saferExplanation: 'Denying the prompt protects your account; changing your password stops future attempts.',
        nextScenarioId: 'sc-mfa-investigation'
      },
      {
        id: 'mfa-opt-reply-chat',
        text: 'Reply to the message asking: "Is this really support? What is this for?"',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: 'verification', points: 0 },
        consequence: 'You tipped off the attacker who now doubles down with fabricated urgency.',
        securityPrinciple: 'Out-of-Band Verification',
        saferExplanation: 'Never verify identity using the exact same suspicious channel where the requester contacted you.',
        nextScenarioId: 'sc-mfa-social-eng'
      },
      {
        id: 'mfa-opt-ignore',
        text: 'Swipe the notification away and ignore it; as long as you do not approve it, you are fine.',
        safety: 'partial',
        score: 10,
        skillImpact: { skill: 'incident', points: 5 },
        consequence: 'You avoided approving access, but the attacker still has your valid password and will likely prompt you again.',
        securityPrinciple: 'Proactive Credential Hygiene',
        saferExplanation: 'Ignoring an MFA prompt leaves the root cause unaddressed: an adversary holds your valid credentials.'
      }
    ]
  },

  // BRANCH 1A: MFA Recovery Scenario
  {
    id: 'sc-mfa-compromise',
    title: 'Account Compromise & Emergency Sign-Out',
    category: 'incident',
    audience: 'everyday',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'Within seconds of hitting "Approve", you receive an automated alert on your phone: "New sign-in confirmed from Bucharest, Romania. Recovery email changed to temp-support@mail-proxy-ru.net." What is your immediate containment action?',
    simulatedType: 'sms',
    simulatedData: {
      sender: 'Account Security Alert',
      timestamp: '1 min ago',
      message: 'CRITICAL ALERT: Unauthorized login confirmed on your account from IP 185.220.101.44 (Bucharest). Security settings modified.',
      urgentBadge: 'INCIDENT IN PROGRESS'
    },
    learningObjective: 'Execute rapid containment when an account takeover is in progress.',
    safetyTakeaway: 'Time-to-containment is everything in an active breach. Terminate sessions, reset passwords, and revoke access.',
    options: [
      {
        id: 'rec-opt-kill-sessions',
        text: 'Use your phone to hit "Sign out of all other devices/sessions", immediately reset your password, and report unauthorized access.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'incident', points: 25 },
        consequence: 'Active intruder sessions are immediately severed and your password is reset, stopping the attacker from locking you out.',
        securityPrinciple: 'Active Session Invalidation & Containment',
        saferExplanation: 'Signing out of all other devices immediately kicks the intruder off even if they already authenticated.'
      },
      {
        id: 'rec-opt-wait-morning',
        text: 'Send a regular email to customer support and wait for their response tomorrow morning.',
        safety: 'critical',
        score: -20,
        skillImpact: { skill: 'incident', points: -15 },
        consequence: 'Overnight, the attacker changes your recovery email, downloads your private photos/documents, and locks you out forever.',
        securityPrinciple: 'Time-Sensitivity in Account Hijacking',
        saferExplanation: 'Account takeovers must be stopped immediately; waiting overnight guarantees the intruder will lock you out.'
      },
      {
        id: 'rec-opt-restart-laptop',
        text: 'Shut down and restart your device to see if the notification clears away.',
        safety: 'risky',
        score: 0,
        skillImpact: { skill: 'incident', points: -5 },
        consequence: 'Local reboot has zero effect on online account compromise and wastes crucial response minutes.',
        securityPrinciple: 'Cloud Identity vs Local Hardware',
        saferExplanation: 'Account takeovers happen on online cloud servers; rebooting your personal laptop does not log the intruder out.'
      }
    ]
  },

  // BRANCH 1B: MFA Investigation Scenario
  {
    id: 'sc-mfa-investigation',
    title: 'Securing Your Account: Tracing the Leak',
    category: 'incident',
    audience: 'everyday',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'Because you tapped "Deny", the unauthorized sign-in was blocked! An Account Security Checkup alert pops up: "We stopped an intruder in Romania from accessing your account. However, because they entered your correct password, let\'s trace where it leaked so your other personal accounts aren\'t compromised."',
    simulatedType: 'chat',
    simulatedData: {
      chatSender: 'Security Assistant (Account Checkup)',
      chatAvatar: 'SA',
      chatMessage: 'Unauthorized login blocked from Bucharest, Romania (IP 185.220.101.44). The intruder knew your valid password. Where do you think this password might have been exposed?',
      ticketNumber: 'CASE-2026-8819'
    },
    learningObjective: 'Understand how passwords leak through breaches and reuse, and investigate the root cause.',
    safetyTakeaway: 'Stopping the login is step one; finding where your password leaked prevents criminals from breaking into your other accounts.',
    profileFlavor: {
      everyday: 'Everyday context: If someone tries your password on one account, they will immediately try it on your email, banking, and shopping accounts.'
    },
    options: [
      {
        id: 'inv-opt-audit-reuse',
        text: 'Review where you have reused this same password (e.g. older websites, shopping apps) and update any account sharing it immediately.',
        safety: 'safer',
        score: 20,
        skillImpact: { skill: 'incident', points: 20 },
        consequence: 'You uncover that the same password was leaked in an older website data breach, and change it across all your accounts before damage occurs.',
        securityPrinciple: 'Credential Stuffing & Password Isolation',
        saferExplanation: 'Auditing password reuse stops attackers from cascading from one leaked account into your primary email and banking.'
      },
      {
        id: 'inv-opt-assume-glitch',
        text: 'Assume it was just a random system glitch and close the alert without changing your password.',
        safety: 'risky',
        score: -10,
        skillImpact: { skill: 'incident', points: -10 },
        consequence: 'Leaving the leaked password active allows the intruder to try it against your other online accounts.',
        securityPrinciple: 'Root Cause Verification',
        saferExplanation: 'MFA notifications only appear when someone has entered your valid password. It is never a random system glitch.'
      }
    ]
  },

  // BRANCH 1C: MFA Social Engineering Pressure
  {
    id: 'sc-mfa-social-eng',
    title: 'The Fake Tech Support Urgent Call',
    category: 'verification',
    audience: 'workplace',
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

  // SCENARIO 2: The Urgent Invoice
  {
    id: 'sc-invoice-1',
    title: 'The Urgent Supplier Invoice',
    category: 'phishing',
    audience: 'workplace',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'You receive an email from your longtime packaging supplier, "Pinnacle Paper & Print". Attached is an overdue invoice for $48,250. The message states their bank account details have changed due to an annual audit and payment must be remitted today to prevent shipment cancellation.',
    simulatedType: 'email',
    simulatedData: {
      senderName: 'Sarah Jenkins - Pinnacle Paper',
      senderEmail: 'sarah.jenkins@pinnacle-paper-supply.com',
      replyTo: 'accounting-audit@fastmail-routing.net',
      subject: 'URGENT: Outstanding Balance & Updated Payment Wiring Instructions',
      date: 'Today, 9:14 AM',
      attachment: 'Invoice_INV-84920_UpdatedWire.pdf (420 KB)',
      emailBody: 'Hi Team,\n\nPlease see attached invoice for this week\'s manufacturing paper run. Note that our primary depository account with Chase is undergoing scheduled audit maintenance. Please wire all funds to our temporary escrow account at Continental Bank:\n\nRouting: 071000288\nAccount: 4899201882\n\nMust be wired by 2 PM to release order #994.',
      highlightWarning: 'Reply-To address differs from Sender domain.'
    },
    learningObjective: 'Identify Business Email Compromise (BEC) and verify banking changes out-of-band.',
    safetyTakeaway: 'Any change to wire instructions or banking accounts must be validated using an independent, verified phone number on file.',
    forensicClues: [
      {
        id: 'clue-inv-domain',
        element: 'Sender domain <sarah.jenkins@pinnacle-paper-supply.com>',
        description: 'Typosquatting: Official vendor domain is pinnaclepaper.com. Attackers registered a lookalike variation.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-inv-replyto',
        element: 'Reply-To: accounting-audit@fastmail-routing.net',
        description: 'Header Redirection: Directs your reply to an external adversary server rather than the sender.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-inv-urgency',
        element: 'Urgency requirement: "Must be wired by 2 PM to release order"',
        description: 'Manufactured Crisis: False deadlines pressure accounting personnel into bypassing secondary approvals.',
        redFlagLevel: 'moderate'
      }
    ],
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
        nextScenarioId: 'sc-invoice-verified'
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
        nextScenarioId: 'sc-invoice-fraud'
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

  // BRANCH 2A: Wire Fraud Containment
  {
    id: 'sc-invoice-fraud',
    title: 'Financial Fraud & Emergency Wire Recall',
    category: 'incident',
    audience: 'workplace',
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

  // BRANCH 2B: Vendor Security Advisory
  {
    id: 'sc-invoice-verified',
    title: 'Vendor Breach Notification & Supply Chain Defense',
    category: 'incident',
    audience: 'workplace',
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

  // SCENARIO 3: The QR Code
  {
    id: 'sc-qr-1',
    title: 'The Coffee Shop / Lobby QR Code',
    category: 'phishing',
    audience: 'everyday',
    difficulty: 'beginner',
    estimatedReadingSec: 20,
    narrative: 'While waiting at a local coffee shop, you see a glossy flyer: "Free $15 Café Voucher + Event Pass! Scan QR code to claim your coupon." You point your smartphone camera at the QR code.',
    simulatedType: 'qr',
    simulatedData: {
      posterHeadline: 'SCAN FOR FREE $15 CAFÉ VOUCHER & TECH EXPO PASS',
      decodedUrl: 'https://login-auth-techsummit2026.cloud-redirect.net/sso/claim?id=4991',
      qrImageText: 'Scan to register with your email and password',
      warningLabel: 'Third-party shortened redirect detected'
    },
    learningObjective: 'Identify QR code phishing ("Quishing") and inspect destination URLs before entering credentials.',
    safetyTakeaway: 'QR codes obscure the destination URL. Always preview the full link, check the domain, and never enter credentials on random scanned pages.',
    forensicClues: [
      {
        id: 'clue-qr-host',
        element: 'Decoded URL: login-auth-techsummit2026.cloud-redirect.net',
        description: 'Masked Hostname: The link ends in .cloud-redirect.net, not the official conference organization.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-qr-sticker',
        element: 'Lobby Coffee Poster Sticker',
        description: 'Physical Tampering: Malicious QR stickers placed over legitimate public flyers divert users to credential harvesters.',
        redFlagLevel: 'moderate'
      }
    ],
    profileFlavor: {
      student: 'Campus noticeboards are prime targets for malicious QR codes offering fake discounts or event passes.',
      office: 'Physical workplace spaces can easily have malicious stickers placed over legitimate building signage.',
      everyday: 'Think twice before scanning physical QR codes in public places that ask you to log in.'
    },
    options: [
      {
        id: 'qr-opt-inspect-url',
        text: 'Inspect the decoded URL carefully. Notice it points to an obscure `.cloud-redirect.net` domain rather than the official café site, and close it.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'phishing', points: 20 },
        consequence: 'You avoided a credential-harvesting trap designed to capture logins under the guise of a free voucher.',
        securityPrinciple: 'Destination URL Inspection (Anti-Quishing)',
        saferExplanation: 'Examining the full hostname before interacting with any QR destination prevents credential theft.'
      },
      {
        id: 'qr-opt-fill-login',
        text: 'Follow the link to the landing page and type in your email and password to claim the $15 voucher quickly.',
        safety: 'critical',
        score: -20,
        skillImpact: { skill: 'phishing', points: -20 },
        consequence: 'Your login credentials were saved to a criminal phishing server. A sticker had been pasted over the original sign.',
        securityPrinciple: 'Credential Harvester Exploitation',
        saferExplanation: 'Legitimate vouchers never require your primary email password on third-party domains.'
      },
      {
        id: 'qr-opt-scan-on-laptop',
        text: 'Take a photo with your phone and send the link to your personal computer to inspect it on a bigger screen.',
        safety: 'risky',
        score: -5,
        skillImpact: { skill: 'browsing', points: -10 },
        consequence: 'You brought an unvetted malicious URL into your home network environment.',
        securityPrinciple: 'Cross-Device Contamination',
        saferExplanation: 'Transferring unverified mobile links across personal devices spreads risk.'
      }
    ]
  },

  // SCENARIO 4: The IT Support Call
  {
    id: 'sc-it-call-1',
    title: 'The "Technical Support" Code Call',
    category: 'verification',
    audience: 'workplace',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'Your phone rings. The caller says: "Hi, this is Patrick from Central Support. We noticed your account is transmitting corrupted network packets. I just sent a 6-digit confirmation PIN to your mobile phone—read it back to me so I can apply the hotfix."',
    simulatedType: 'call',
    simulatedData: {
      callerId: 'Patrick Miller - Central Infrastructure',
      callerNumber: 'Extension #4102',
      smsReceived: 'YOUR PASSCODE: 729-104. DO NOT SHARE THIS WITH ANYONE. Apex Cloud will never ask for this code.',
      callStatus: 'Ongoing - 00:34'
    },
    learningObjective: 'Never disclose one-time passwords (OTP) or authentication codes to anyone, including purported IT support.',
    safetyTakeaway: 'One-time passcodes verify YOU to the system. Legitimate support agents have administrative tools and never require your personal OTP.',
    forensicClues: [
      {
        id: 'clue-call-sms-warning',
        element: 'SMS Passcode: "DO NOT SHARE THIS WITH ANYONE"',
        description: 'Explicit Security Advisory: The automated passcode SMS specifically warns that the organization will never ask for the code.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-call-callerid',
        element: 'Inbound Phone Call (+1 800 extension)',
        description: 'VoIP Spoofing: Inbound Caller ID can be easily fabricated to match corporate directory numbers.',
        redFlagLevel: 'critical'
      }
    ],
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

  // SCENARIO 5: The Shared Document
  {
    id: 'sc-shared-doc-1',
    title: 'The Shared Document Login',
    category: 'phishing',
    audience: 'workplace',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'You receive a notification: "Project Manager Elena Rostova shared Q4_Salary_Adjustments_CONFIDENTIAL.xlsx with you." You click the link, and a page appears displaying the familiar login screen with a URL bar showing `https://onedrive-secure-viewer.portal-sync8.com/login`.',
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
    forensicClues: [
      {
        id: 'clue-doc-url',
        element: 'URL Hostname: portal-sync8.com',
        description: 'Reverse-Proxy Phishing: The actual destination domain is portal-sync8.com rather than the official enterprise cloud domain.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-doc-curiosity',
        element: 'Filename: "Q4_Salary_Adjustments_CONFIDENTIAL.xlsx"',
        description: 'Curiosity Trap: Provocative compensation titles trigger emotional curiosity so victims overlook hostname discrepancies.',
        redFlagLevel: 'moderate'
      }
    ],
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
        consequence: 'The phishing page records your username and IP address, confirming your active email to spam syndicates.',
        securityPrinciple: 'Do Not Interact With Hostile Forms',
        saferExplanation: 'Interacting with malicious portals validates your active presence and exposes metadata. Simply exit.'
      }
    ]
  },

  // SCENARIO 6: The Suspicious USB Drive
  {
    id: 'sc-usb-drive-1',
    title: 'The "Executive Bonus" USB Drive',
    category: 'incident',
    audience: 'workplace',
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
    forensicClues: [
      {
        id: 'clue-usb-tape',
        element: 'Masking Tape Label: "Q1 Exec Bonus Structure"',
        description: 'Physical Baiting: Enticing executive labels exploit human curiosity to bypass physical cybersecurity controls.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-usb-drop',
        element: 'Unattended Hardware on Breakroom Table',
        description: 'Drop Attack: Attackers strategically place rogue USB devices in high-traffic shared office areas.',
        redFlagLevel: 'critical'
      }
    ],
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

  // SCENARIO 7: The Public Wi-Fi Trap
  {
    id: 'sc-wifi-trap-1',
    title: 'The Public Airport Wi-Fi Trap',
    category: 'browsing',
    audience: 'everyday',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'You are waiting at an airport terminal before boarding. You need to check your personal banking and email. Your phone Wi-Fi menu displays "Airport_Free_Fast_WiFi" with no password lock, and an open network called "Terminal_Lounge_5G_VIP". When you tap connect, a popup asks you to install a "WiFi Optimization Security Profile".',
    simulatedType: 'wifi',
    simulatedData: {
      networks: [
        { ssid: 'Airport_Free_Fast_WiFi', security: 'Open (Unencrypted)', signal: '95%' },
        { ssid: 'Terminal_Lounge_5G_VIP', security: 'Open (Unencrypted)', signal: '90%' },
        { ssid: 'Airport_Secure_Carrier', security: 'WPA3 Encrypted', signal: '70%' }
      ],
      captivePortalWarning: 'Captive portal asks to install "WiFi Optimization Security Profile .mobileconfig"'
    },
    learningObjective: 'Safely operate on public networks using cellular hotspots without installing untrusted profiles.',
    safetyTakeaway: 'Never install configuration profiles or certificates to connect to public Wi-Fi. Always tunnel sensitive work via trusted VPN or personal mobile hotspot.',
    forensicClues: [
      {
        id: 'clue-wifi-profile',
        element: 'Captive Portal: "Install Security Profile .mobileconfig"',
        description: 'Root CA Injection: Profiles often install rogue root certificates that strip HTTPS encryption from your device.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-wifi-open',
        element: 'Unencrypted Open Network ("Terminal_Lounge_5G_VIP")',
        description: 'Evil-Twin Risk: Unencrypted networks broadcast device metadata and expose traffic to local peer interception.',
        redFlagLevel: 'moderate'
      }
    ],
    options: [
      {
        id: 'wifi-opt-hotspot-vpn',
        text: 'Disconnect from the open Wi-Fi. Turn on your mobile phone\'s cellular data connection or hotspot before checking sensitive accounts.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'browsing', points: 25 },
        consequence: 'Your traffic is safely routed through isolated cellular spectrum, completely evading local network snoopers.',
        securityPrinciple: 'Cellular Tethering & Encrypted Tunnels',
        saferExplanation: 'Cellular data prevents local evil-twin attacks, rogue DNS poisoning, and captive portal interception.'
      },
      {
        id: 'wifi-opt-install-profile',
        text: 'Agree to download and install the requested "WiFi Optimization Security Profile" so you get free high-speed internet.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: 'browsing', points: -25 },
        consequence: 'The profile installs a malicious root Certificate Authority (CA) that enables the attacker to decrypt your secure logins.',
        securityPrinciple: 'Rogue Root CA Injection',
        saferExplanation: 'Installing network configuration profiles or root certificates allows untrusted actors to break SSL/TLS encryption.'
      },
      {
        id: 'wifi-opt-connect-no-vpn',
        text: 'Connect to Airport_Free_Fast_WiFi without cellular data, assuming normal websites are protected enough.',
        safety: 'partial',
        score: 10,
        skillImpact: { skill: 'browsing', points: 5 },
        consequence: 'While modern HTTPS protects payloads, local DNS queries and unencrypted traffic are exposed to passive monitoring.',
        securityPrinciple: 'Limitations of Transport Layer Security on Open LANs',
        saferExplanation: 'Open LANs expose device hostnames, DNS lookups, and local peer vulnerabilities.'
      }
    ]
  },

  // SCENARIO 8: The Reused Password
  {
    id: 'sc-reused-pwd-1',
    title: 'The Compromised Fitness App (Password Reuse)',
    category: 'authentication',
    audience: 'everyday',
    difficulty: 'beginner',
    estimatedReadingSec: 20,
    narrative: 'You read news that a popular fitness tracking app you used in 2023 was breached, leaking 15 million user passwords. You remember you used the same favorite password (`CascadeSummer#2024`) on that app as you use on your personal email and primary online shopping account.',
    simulatedType: 'password',
    simulatedData: {
      breachName: 'FitTrack Global Data Breach',
      exposedFields: 'Email addresses, Salted MD5 Passwords, Dates of birth',
      affectedCount: '15,200,000 accounts',
      reuseRisk: 'HIGH - Identical password identified across multiple personal accounts'
    },
    learningObjective: 'Adopt unique passwords per service, password managers, and passkeys to defeat credential stuffing.',
    safetyTakeaway: 'Password reuse turns a breach on a low-importance website into a direct threat to your most sensitive personal accounts.',
    forensicClues: [
      {
        id: 'clue-pwd-reuse',
        element: 'Identical Password Across Services (`CascadeSummer#2024`)',
        description: 'Credential Stuffing Exposure: Adversaries test leaked breach pairs automatically against high-value targets like email and banking.',
        redFlagLevel: 'critical'
      }
    ],
    options: [
      {
        id: 'pwd-opt-manager-passkeys',
        text: 'Use a password manager to generate unique, random passwords for every account and enable passkeys or 2FA where available.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: 'authentication', points: 25 },
        consequence: 'Every service now possesses an independent password, insulating you completely from third-party app breaches.',
        securityPrinciple: 'Credential Isolation & Zero-Knowledge Password Management',
        saferExplanation: 'Unique passwords guarantee that one breach on a silly app never cascades into your personal banking.'
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

  // SCENARIO 9: The Fake Job Offer
  {
    id: 'sc-fake-job-1',
    title: 'The Dream Remote Job Offer',
    category: 'privacy',
    audience: 'everyday',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'A recruiter reaches out on social media offering you a high-paying remote consulting role with flexible hours. After a brief chat interview over an encrypted messaging app, they send an immediate offer letter and ask for a copy of your passport and a $250 equipment registration fee.',
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
    forensicClues: [
      {
        id: 'clue-job-advance-fee',
        element: 'Advance $250 Equipment Fee Request',
        description: 'Advance-Fee Fraud: Real employers provide equipment and never demand upfront fees from job applicants.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-job-passport',
        element: 'Immediate Passport & Government ID Request over Chat',
        description: 'Identity Theft Harvester: Scammers request government documents early to create synthetic identities and fraudulent accounts.',
        redFlagLevel: 'critical'
      }
    ],
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

  // SCENARIO 10: The Browser Warning (Workplace)
  {
    id: 'sc-browser-warn-1',
    title: 'The Certificate Security Warning',
    category: 'browsing',
    audience: 'workplace',
    difficulty: 'intermediate',
    estimatedReadingSec: 25,
    narrative: 'While trying to access an employee portal from a hotel network, your browser displays a full-screen red warning: "Your connection is not private. Attackers might be trying to steal your information from payroll.apexcloud.internal (NET::ERR_CERT_COMMON_NAME_INVALID)." There is an option at the bottom that says "Advanced -> Proceed anyway (unsafe)".',
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
    forensicClues: [
      {
        id: 'clue-cert-mismatch',
        element: 'Certificate Subject: *.hotel-guest-gateway.traffic-inspect.com',
        description: 'Common Name Mismatch: The gateway is presenting its own proxy certificate instead of the authentic payroll server.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-cert-issuer',
        element: 'Untrusted Local Gateway Proxy CA',
        description: 'Man-in-the-Middle Proxy: An unauthorized intermediate device is attempting to terminate and inspect encrypted TLS sessions.',
        redFlagLevel: 'critical'
      }
    ],
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
        nextScenarioId: 'sc-invoice-1'
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
        nextScenarioId: 'sc-mfa-compromise'
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

  // SCENARIO 11: The Accidental Data Share (Workplace)
  {
    id: 'sc-accidental-share-1',
    title: 'The Accidental Recipient',
    category: 'privacy',
    audience: 'workplace',
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
    forensicClues: [
      {
        id: 'clue-share-autofill',
        element: 'Recipient domain: @competitor-firm.com',
        description: 'External Domain Mismatch: Email autofill matched a recipient outside your trusted organization.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-share-content',
        element: 'Attachment: Employee_Tax_Records_2026_Final.xlsx',
        description: 'High-Risk PII: Tax identification numbers and personal records represent heavily regulated privacy data.',
        redFlagLevel: 'critical'
      }
    ],
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

  // SCENARIO 12: The Fake CEO Message (Workplace)
  {
    id: 'sc-fake-ceo-1',
    title: 'The Executive WhatsApp Directive',
    category: 'verification',
    audience: 'workplace',
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
    forensicClues: [
      {
        id: 'clue-ceo-giftcard',
        element: 'Demand to Buy Apple Gift Cards & Send Codes',
        description: 'Untraceable Payment Scams: Scammers demand retail gift cards because the redemption codes cannot be reversed or traced once scratched.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-ceo-secrecy',
        element: 'Explicit Secrecy & Channel Prohibition: "Do not call my line"',
        description: 'Isolation Tactic: Attackers forbid out-of-band verification to prevent victims from checking with other staff.',
        redFlagLevel: 'critical'
      }
    ],
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

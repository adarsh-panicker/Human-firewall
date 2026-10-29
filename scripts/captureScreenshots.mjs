import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.resolve('screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Locate Chrome or Edge
const executablePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

console.log('Using browser executable at:', executablePath);

async function run() {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 820 },
    deviceScaleFactor: 2 // High-DPI crisp screenshots
  });

  const page = await context.newPage();

  console.log('1. Capturing Welcome Screen...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_welcome_screen.png') });

  console.log('2. Capturing Interactive Decision Preview on Welcome Screen...');
  const denyButton = page.locator('button:has-text("Deny & Block Intruder")');
  if (await denyButton.isVisible()) {
    await denyButton.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_welcome_preview_denied.png') });
  }

  console.log('3. Capturing Link Scanner Modal...');
  const linkScannerBtn = page.locator('button:has-text("Link Scanner")').first();
  if (await linkScannerBtn.isVisible()) {
    await linkScannerBtn.click();
    await page.waitForTimeout(500);
    // Click a preset scan button
    const presetBtn = page.locator('button:has-text("Fake USPS Redelivery")');
    if (await presetBtn.isVisible()) {
      await presetBtn.click();
      await page.waitForTimeout(800);
    }
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_link_trust_scanner.png') });
    // Close modal
    await page.locator('button:has-text("Close Scanner")').click();
    await page.waitForTimeout(400);
  }

  console.log('4. Capturing Threat Lab Modal...');
  const threatLabBtn = page.locator('button:has-text("Threat Lab")').first();
  if (await threatLabBtn.isVisible()) {
    await threatLabBtn.click();
    await page.waitForTimeout(600);
    // Run an analysis
    const analyzeBtn = page.locator('button:has-text("Run Forensic Threat Deconstruction")');
    if (await analyzeBtn.isVisible()) {
      await analyzeBtn.click();
      await page.waitForTimeout(800);
    }
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_ai_copilot_lab.png') });
    // Close modal
    await page.locator('button:has-text("Close Lab")').click();
    await page.waitForTimeout(400);
  }

  console.log('5. Capturing Player Setup Modal...');
  const startBtn = page.locator('button:has-text("Start Playing")').first();
  if (await startBtn.isVisible()) {
    await startBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_player_setup.png') });

    // Select Everyday user & Start Quick Play
    const quickPlayBtn = page.locator('button:has-text("Launch Quick Play")');
    if (await quickPlayBtn.isVisible()) {
      await quickPlayBtn.click();
      await page.waitForTimeout(1000);
    }
  }

  console.log('6. Capturing Everyday Interactive Scenario...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_everyday_scenario.png') });

  console.log('7. Capturing Clue Inspector...');
  const inspectBtn = page.locator('button:has-text("Inspect Clues")');
  if (await inspectBtn.isVisible()) {
    await inspectBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_scenario_clues.png') });
  }

  console.log('8. Capturing Scenario Decision Outcome Feedback...');
  // Click first decision option
  const firstOption = page.locator('button:has-text("1")').first();
  if (await firstOption.isVisible()) {
    await firstOption.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_scenario_outcome.png') });
  }

  console.log('9. Navigating to Dashboard with populated stats...');
  await page.evaluate(() => {
    const mockSession = {
      sessionId: 'HF-CERT-DEMO',
      mode: 'full',
      profile: 'everyday',
      displayName: 'Adarsh Panicker',
      startTime: Date.now() - 360000,
      endTime: Date.now(),
      decisions: [
        { scenarioId: 'sc-home-delivery-1', scenarioTitle: 'USPS Delivery', category: 'phishing', optionId: 'o1', chosenText: 'Safe', safety: 'safer', scoreAwarded: 25, skillImpact: { skill: 'phishing', points: 25 }, timestamp: Date.now(), timeSpentSeconds: 12, consequence: 'Protected', securityPrinciple: 'Verification' },
        { scenarioId: 'sc-home-bank-sms-1', scenarioTitle: 'Bank Fraud Call', category: 'verification', optionId: 'o2', chosenText: 'Safe', safety: 'safer', scoreAwarded: 25, skillImpact: { skill: 'verification', points: 25 }, timestamp: Date.now(), timeSpentSeconds: 15, consequence: 'Protected', securityPrinciple: 'Verification' },
        { scenarioId: 'sc-home-voice-clone-1', scenarioTitle: 'Family Voice Clone', category: 'verification', optionId: 'o3', chosenText: 'Safe', safety: 'safer', scoreAwarded: 25, skillImpact: { skill: 'verification', points: 25 }, timestamp: Date.now(), timeSpentSeconds: 18, consequence: 'Protected', securityPrinciple: 'Verification' },
        { scenarioId: 'sc-home-netflix-1', scenarioTitle: 'Netflix Billing', category: 'phishing', optionId: 'o4', chosenText: 'Safe', safety: 'safer', scoreAwarded: 20, skillImpact: { skill: 'phishing', points: 20 }, timestamp: Date.now(), timeSpentSeconds: 14, consequence: 'Protected', securityPrinciple: 'Phishing' }
      ],
      totalScore: 95,
      normalizedScore: 95,
      completed: true,
      scenarioQueue: ['sc-home-delivery-1', 'sc-home-bank-sms-1', 'sc-home-voice-clone-1', 'sc-home-netflix-1'],
      currentScenarioIndex: 3
    };

    const data = {
      profile: 'everyday',
      displayName: 'Adarsh Panicker',
      stats: {
        totalGamesPlayed: 6,
        totalScenariosCompleted: 32,
        bestScore: 95,
        perfectRuns: 3,
        dailyStreak: 5,
        skillScores: {
          phishing: { totalPoints: 120, maxPossible: 125, percentage: 96 },
          verification: { totalPoints: 115, maxPossible: 120, percentage: 95 },
          authentication: { totalPoints: 95, maxPossible: 100, percentage: 95 },
          privacy: { totalPoints: 90, maxPossible: 100, percentage: 90 },
          incident: { totalPoints: 88, maxPossible: 100, percentage: 88 },
          browsing: { totalPoints: 94, maxPossible: 100, percentage: 94 }
        }
      },
      achievements: [
        { id: 'ach-first-step', title: 'First Defense', description: 'Complete your first scenario.', icon: 'Shield', unlockedAt: Date.now() - 86400000 },
        { id: 'ach-speed-demon', title: 'Quick Thinker', description: 'Make a decision in under 15 seconds.', icon: 'Zap', unlockedAt: Date.now() - 86400000 },
        { id: 'ach-eagle-eye', title: 'Eagle Eye', description: 'Spot all clues before answering.', icon: 'Eye', unlockedAt: Date.now() - 43200000 },
        { id: 'ach-firewall-pro', title: 'Certified Defender', description: 'Achieve a score of 90+.', icon: 'Award', unlockedAt: Date.now() }
      ],
      history: [mockSession],
      activeSession: null,
      preferences: { soundEffects: true, reducedMotion: false, highContrast: false }
    };
    localStorage.setItem('human_firewall_userdata', JSON.stringify(data));
  });

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Click Start Playing on Welcome Screen (which now navigates to Dashboard because history > 0)
  const startPlayingBtn = page.locator('button:has-text("Start Playing")').first();
  if (await startPlayingBtn.isVisible()) {
    await startPlayingBtn.click();
    await page.waitForTimeout(800);
  }

  console.log('10. Capturing Game Dashboard & Cyber Radar Chart...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_game_dashboard.png') });

  // Open Practice Library
  console.log('11. Capturing Practice Scenario Library...');
  const practiceCardBtn = page.locator('button:has-text("Explore Practice Library")');
  if (await practiceCardBtn.isVisible()) {
    await practiceCardBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_practice_library.png') });
    
    // Filter by Everyday
    const everydayTab = page.locator('button:has-text("Everyday & Home Life")');
    if (await everydayTab.isVisible()) {
      await everydayTab.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_practice_everyday_tab.png') });
    }

    // Go back to dashboard
    await page.locator('button:has-text("Back to Dashboard")').click();
    await page.waitForTimeout(600);
  }

  // View Results & Certificate
  console.log('12. Capturing Assessment Report & Digital Certificate...');
  const viewReportBtn = page.locator('button:has-text("View Report")').first();
  if (await viewReportBtn.isVisible()) {
    await viewReportBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_results_report.png') });

    // Open certificate
    const certBtn = page.locator('button:has-text("Claim Official Clearance Badge")');
    if (await certBtn.isVisible()) {
      await certBtn.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_clearance_certificate.png') });
    }
  }

  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  await browser.close();
}

run().catch(err => {
  console.error('Screenshot script error:', err);
  process.exit(1);
});

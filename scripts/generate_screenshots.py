import os
import subprocess
import shutil

SCREENSHOTS_DIR = "screenshots"
TEMP_DIR = "temp_assets"

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

def run(cmd):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Command failed: {cmd}\nStderr: {res.stderr}")
    return res.returncode == 0

# Check and resize temp assets
if os.path.exists(f"{TEMP_DIR}/banner.jpg"):
    run(f"convert {TEMP_DIR}/banner.jpg -resize 650x260^ -gravity center -extent 650x260 {TEMP_DIR}/banner_crop.png")
if os.path.exists(f"{TEMP_DIR}/poster.jpg"):
    run(f"convert {TEMP_DIR}/poster.jpg -resize 650x280^ -gravity center -extent 650x280 {TEMP_DIR}/poster_crop.png")
if os.path.exists(f"{TEMP_DIR}/slide1.jpg"):
    run(f"convert {TEMP_DIR}/slide1.jpg -resize 650x300^ -gravity center -extent 650x300 {TEMP_DIR}/slide1_crop.png")

print("Rendering Screenshot 00: Motion Splash Screen (Enhanced High-Legibility)...")
# 00: Motion Splash Screen (750x1520) - 2x Retina iPhone 16 Pro
cmd_00 = """convert -size 750x1520 xc:#070A12 \\
  -fill "#151328" -draw "roundrectangle 12,12 738,1508 52,52" \\
  -fill "#070A12" -draw "roundrectangle 24,24 726,1496 46,46" \\
  -fill "#000000" -draw "roundrectangle 255,40 495,84 22,22" \\
  -fill "#e2e8f0" -font Helvetica-Bold -pointsize 26 -draw "text 65,70 '9:41'" \\
  -fill "#94a3b8" -draw "roundrectangle 625,48 685,76 7,7" \\
  -fill "#10b981" -draw "roundrectangle 628,51 682,73 5,5" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 18 -draw "text 634,68 '100%'" \\
  -fill "#6366f1" -draw "circle 375,490 375,320" \\
  -fill "#070A12" -draw "circle 375,490 375,340" \\
  -fill "#8b5cf6" -draw "circle 375,490 375,400" \\
  -fill "#06b6d4" -draw "circle 375,490 375,440" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 54 -draw "gravity center text 0,-140 'FlowCraft Pro'" \\
  -fill "#c4b5fd" -font Helvetica -pointsize 28 -draw "gravity center text 0,-70 'From Idea to Automated Prototype'" \\
  -fill "#1e1b4b" -stroke "#8b5cf6" -strokewidth 2.5 -draw "roundrectangle 160,850 590,920 35,35" -stroke none \\
  -fill "#e9d5ff" -font Helvetica-Bold -pointsize 24 -draw "gravity center text 0,+125 '⚡ Instant High-Velocity Simulation'" \\
  -fill "#1e293b" -draw "roundrectangle 100,1230 650,1254 12,12" \\
  -fill "#8b5cf6" -draw "roundrectangle 100,1230 480,1254 12,12" \\
  -fill "#94a3b8" -font Helvetica -pointsize 22 -draw "gravity center text 0,+510 'Dwell Timer 2.8s · Auto-Advance Enabled'" \\
  -fill "#475569" -draw "roundrectangle 260,1470 490,1482 6,6" \\
  screenshots/00-motion-splash-screen.png"""
run(cmd_00)

print("Rendering Screenshot 01: Welcome Onboarding Screen...")
# 01: Welcome Onboarding
cmd_01 = f"""convert -size 750x1520 xc:#070A12 \\
  -fill "#151328" -draw "roundrectangle 12,12 738,1508 52,52" \\
  -fill "#0F172A" -draw "roundrectangle 24,24 726,1496 46,46" \\
  -fill "#000000" -draw "roundrectangle 255,40 495,84 22,22" \\
  -fill "#f8fafc" -font Helvetica-Bold -pointsize 26 -draw "text 65,70 '9:41'" \\
  -fill "#94a3b8" -draw "roundrectangle 625,48 685,76 7,7" \\
  -fill "#10b981" -draw "roundrectangle 628,51 682,73 5,5" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 18 -draw "text 634,68 '100%'" \\
  \\( {TEMP_DIR}/banner_crop.png -resize 650x220! \\) -geometry +50+110 -composite \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 42 -draw "text 65,375 'FinPulse Mobile'" \\
  -fill "#cbd5e1" -font Helvetica -pointsize 24 -draw "text 65,415 'Next-generation smart wealth & currency engine'" \\
  -fill "#1e293b" -stroke "#3b82f6" -strokewidth 2 -draw "roundrectangle 50,450 700,575 22,22" -stroke none \\
  -fill "#38bdf8" -font Helvetica-Bold -pointsize 26 -draw "text 75,500 '🛡️ Zero Fee Global Transfers'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 21 -draw "text 75,540 'Manage 42 fiat currencies & digital assets in one vault.'" \\
  \\( {TEMP_DIR}/poster_crop.png -resize 650x250! \\) -geometry +50+605 -composite \\
  -fill "rgba(15,23,42,0.6)" -draw "roundrectangle 50,605 700,855 22,22" \\
  -fill "#6366f1" -draw "circle 375,730 375,680" \\
  -fill "#ffffff" -draw "polygon 365,710 395,730 365,750" \\
  -fill "#0f172a" -draw "roundrectangle 560,800 685,840 12,12" \\
  -fill "#38bdf8" -font Helvetica-Bold -pointsize 20 -draw "text 578,828 '▶ 02:45'" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 24 -draw "text 70,835 '🎬 Product Walkthrough Video'" \\
  -fill "#064e3b" -stroke "#059669" -strokewidth 2 -draw "roundrectangle 50,880 700,940 18,18" -stroke none \\
  -fill "#34d399" -font Helvetica-Bold -pointsize 22 -draw "text 75,918 '✓ SOC-2 Type II Verified & Bank-Grade Encrypted'" \\
  -fill "#6366f1" -draw "roundrectangle 50,965 700,1055 26,26" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 30 -draw "gravity center text 0,+270 'Get Started Now →'" \\
  -fill "#1e293b" -stroke "#475569" -strokewidth 2 -draw "roundrectangle 50,1075 700,1165 26,26" -stroke none \\
  -fill "#e2e8f0" -font Helvetica-Bold -pointsize 26 -draw "gravity center text 0,+380 'I Already Have an Account'" \\
  -fill "#fef08a" -stroke "#eab308" -strokewidth 2.5 -draw "roundrectangle 50,1190 700,1340 20,20" -stroke none \\
  -fill "#713f12" -font Helvetica-Bold -pointsize 22 -draw "text 75,1230 '📌 Note 1: Guest Session Auth Contract'" \\
  -fill "#854d0e" -font Helvetica -pointsize 20 -draw "text 75,1268 'POST /v1/auth/session on guest start. Check device'" \\
  -fill "#854d0e" -font Helvetica -pointsize 20 -draw "text 75,1300 'hardware integrity before issuing refresh token.'" \\
  -fill "#475569" -draw "roundrectangle 260,1470 490,1482 6,6" \\
  screenshots/01-welcome-onboarding-screen.png"""
run(cmd_01)

print("Rendering Screenshot 02: Biometric Authentication Screen...")
# 02: Biometric Sign In
cmd_02 = """convert -size 750x1520 xc:#070A12 \\
  -fill "#151328" -draw "roundrectangle 12,12 738,1508 52,52" \\
  -fill "#0F172A" -draw "roundrectangle 24,24 726,1496 46,46" \\
  -fill "#000000" -draw "roundrectangle 255,40 495,84 22,22" \\
  -fill "#f8fafc" -font Helvetica-Bold -pointsize 26 -draw "text 65,70 '9:41'" \\
  -fill "#94a3b8" -draw "roundrectangle 625,48 685,76 7,7" \\
  -fill "#10b981" -draw "roundrectangle 628,51 682,73 5,5" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 18 -draw "text 634,68 '100%'" \\
  -fill "#94a3b8" -font Helvetica-Bold -pointsize 32 -draw "text 55,145 '‹ Back'" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 44 -draw "text 55,215 'Secure Sign In'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 24 -draw "text 55,260 'Enter credentials or authenticate with biometrics'" \\
  -fill "#cbd5e1" -font Helvetica-Bold -pointsize 22 -draw "text 55,325 'Work Email Address'" \\
  -fill "#1e293b" -stroke "#475569" -strokewidth 2 -draw "roundrectangle 50,345 700,430 20,20" -stroke none \\
  -fill "#ffffff" -font Helvetica -pointsize 26 -draw "text 75,398 'stephen.gershen@gmail.com'" \\
  -fill "#cbd5e1" -font Helvetica-Bold -pointsize 22 -draw "text 55,475 'Master Security Password'" \\
  -fill "#1e293b" -stroke "#475569" -strokewidth 2 -draw "roundrectangle 50,495 700,580 20,20" -stroke none \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 32 -draw "text 75,550 '••••••••••••••••'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 2 -draw "roundrectangle 50,620 700,730 22,22" -stroke none \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 24 -draw "text 80,665 'Enable FaceID Quick Authentication'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 20 -draw "text 80,700 'Instant biometric unlocking on this device'" \\
  -fill "#10b981" -draw "roundrectangle 605,650 675,698 24,24" \\
  -fill "#ffffff" -draw "circle 652,674 652,656" \\
  -fill "#6366f1" -draw "roundrectangle 50,770 700,860 26,26" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 30 -draw "gravity center text 0,+85 'Sign In to Account'" \\
  -fill "#334155" -draw "line 50,905 700,905" \\
  -fill "#1e293b" -stroke "#6366f1" -strokewidth 2.5 -draw "roundrectangle 50,945 700,1035 26,26" -stroke none \\
  -fill "#c7d2fe" -font Helvetica-Bold -pointsize 26 -draw "gravity center text 0,+255 '🔑 Use Hardware Passkey / YubiKey'" \\
  -fill "#d1fae5" -stroke "#10b981" -strokewidth 2.5 -draw "roundrectangle 50,1075 700,1235 22,22" -stroke none \\
  -fill "#065f46" -font Helvetica-Bold -pointsize 23 -draw "text 80,1120 '🛡️ Sticky Note: Biometric Fallback Protocol'" \\
  -fill "#047857" -font Helvetica -pointsize 21 -draw "text 80,1160 'If biometric LocalAuth fails 3x, fallback to 6-digit'" \\
  -fill "#047857" -font Helvetica -pointsize 21 -draw "text 80,1195 'backup PIN gate before locking account for 60 seconds.'" \\
  -fill "#475569" -draw "roundrectangle 260,1470 490,1482 6,6" \\
  screenshots/02-biometric-authentication-screen.png"""
run(cmd_02)

print("Rendering Screenshot 03: Wealth & Dashboard Screen...")
# 03: Portfolio Dashboard
cmd_03 = f"""convert -size 750x1520 xc:#070A12 \\
  -fill "#151328" -draw "roundrectangle 12,12 738,1508 52,52" \\
  -fill "#0F172A" -draw "roundrectangle 24,24 726,1496 46,46" \\
  -fill "#000000" -draw "roundrectangle 255,40 495,84 22,22" \\
  -fill "#f8fafc" -font Helvetica-Bold -pointsize 26 -draw "text 65,70 '9:41'" \\
  -fill "#94a3b8" -draw "roundrectangle 625,48 685,76 7,7" \\
  -fill "#10b981" -draw "roundrectangle 628,51 682,73 5,5" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 18 -draw "text 634,68 '100%'" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 36 -draw "text 55,145 'FinPulse Vault'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 22 -draw "text 55,180 'Welcome back, Stephen'" \\
  -fill "#1e293b" -stroke "#6366f1" -strokewidth 2.5 -draw "roundrectangle 50,210 700,380 26,26" -stroke none \\
  -fill "#94a3b8" -font Helvetica-Bold -pointsize 22 -draw "text 80,255 'TOTAL NET LIQUID ASSETS'" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 54 -draw "text 80,320 '$148,920.45'" \\
  -fill "#10b981" -font Helvetica-Bold -pointsize 24 -draw "text 80,360 '▲ +12.4% past 30 days (+$16,420)'" \\
  \\( {TEMP_DIR}/slide1_crop.png -resize 650x260! \\) -geometry +50+410 -composite \\
  -fill "rgba(15,23,42,0.72)" -draw "roundrectangle 50,410 700,670 24,24" \\
  -fill "#ec4899" -draw "roundrectangle 75,435 210,475 12,12" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 18 -draw "text 92,462 'EXCLUSIVE'" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 34 -draw "text 75,525 'Earn 5.4% High Yield APY'" \\
  -fill "#cbd5e1" -font Helvetica -pointsize 22 -draw "text 75,565 'Institutional USD Treasury bonds with instant liquidity'" \\
  -fill "#38bdf8" -font Helvetica-Bold -pointsize 21 -draw "text 75,620 'Hyperlink Target: Instant Transfer (Slide Up) →'" \\
  -fill "#6366f1" -draw "circle 355,648 355,641" \\
  -fill "#94a3b8" -draw "circle 375,648 375,641" \\
  -fill "#94a3b8" -draw "circle 395,648 395,641" \\
  -fill "#6366f1" -draw "roundrectangle 50,695 700,780 24,24" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 28 -draw "gravity center text 0,-60 '⚡ Send Instant Transfer'" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 26 -draw "text 55,830 'Recent Transactions'" \\
  -fill "#1e293b" -draw "roundrectangle 50,855 700,955 20,20" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 24 -draw "text 80,900 'Stripe SaaS Revenue Payout'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 19 -draw "text 80,935 'Oct 03 · Direct ACH Settlement'" \\
  -fill "#10b981" -font Helvetica-Bold -pointsize 30 -draw "text 510,915 '+$4,250.00'" \\
  -fill "#1e293b" -draw "roundrectangle 50,975 700,1075 20,20" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 24 -draw "text 80,1020 'Amazon Web Services Cloud'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 19 -draw "text 80,1055 'Oct 02 · Corporate Debit'" \\
  -fill "#f43f5e" -font Helvetica-Bold -pointsize 30 -draw "text 530,1035 '-$384.20'" \\
  -fill "#0b0f19" -stroke "#1e293b" -strokewidth 2.5 -draw "roundrectangle 50,1320 700,1445 28,28" -stroke none \\
  -fill "#818cf8" -font Helvetica-Bold -pointsize 22 -draw "text 95,1390 '🏠 Home'" \\
  -fill "#cbd5e1" -font Helvetica-Bold -pointsize 22 -draw "text 255,1390 '💸 Transfer'" \\
  -fill "#cbd5e1" -font Helvetica-Bold -pointsize 22 -draw "text 430,1390 '💳 Cards'" \\
  -fill "#cbd5e1" -font Helvetica-Bold -pointsize 22 -draw "text 585,1390 '⚙️ Vault'" \\
  -fill "#475569" -draw "roundrectangle 260,1470 490,1482 6,6" \\
  screenshots/03-portfolio-dashboard-screen.png"""
run(cmd_03)

print("Rendering Screenshot 04: Instant Transfer Screen...")
# 04: Instant Transfer Form
cmd_04 = """convert -size 750x1520 xc:#070A12 \\
  -fill "#151328" -draw "roundrectangle 12,12 738,1508 52,52" \\
  -fill "#0F172A" -draw "roundrectangle 24,24 726,1496 46,46" \\
  -fill "#000000" -draw "roundrectangle 255,40 495,84 22,22" \\
  -fill "#f8fafc" -font Helvetica-Bold -pointsize 26 -draw "text 65,70 '9:41'" \\
  -fill "#94a3b8" -draw "roundrectangle 625,48 685,76 7,7" \\
  -fill "#10b981" -draw "roundrectangle 628,51 682,73 5,5" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 18 -draw "text 634,68 '100%'" \\
  -fill "#94a3b8" -font Helvetica-Bold -pointsize 32 -draw "text 55,145 '‹ Cancel'" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 44 -draw "text 55,215 'New Instant Transfer'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 24 -draw "text 55,260 'Zero-fee instant cross-border routing'" \\
  -fill "#cbd5e1" -font Helvetica-Bold -pointsize 22 -draw "text 55,325 'Recipient Tag or IBAN'" \\
  -fill "#1e293b" -stroke "#475569" -strokewidth 2 -draw "roundrectangle 50,345 700,430 20,20" -stroke none \\
  -fill "#ffffff" -font Helvetica -pointsize 26 -draw "text 75,398 'elena.rostova@techcorp.io'" \\
  -fill "#cbd5e1" -font Helvetica-Bold -pointsize 22 -draw "text 55,475 'Amount in USD ($)'" \\
  -fill "#1e293b" -stroke "#6366f1" -strokewidth 2.5 -draw "roundrectangle 50,495 700,600 22,22" -stroke none \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 54 -draw "text 75,565 '$2,500.00'" \\
  -fill "#38bdf8" -font Helvetica-Bold -pointsize 20 -draw "text 440,565 'Available: $148,920.45'" \\
  -fill "#cbd5e1" -font Helvetica-Bold -pointsize 22 -draw "text 55,645 'Memo / Payment Reference'" \\
  -fill "#1e293b" -stroke "#475569" -strokewidth 2 -draw "roundrectangle 50,665 700,750 20,20" -stroke none \\
  -fill "#ffffff" -font Helvetica -pointsize 24 -draw "text 75,718 'Q4 Frontend Prototype Milestone Hand-off'" \\
  -fill "#1e293b" -stroke "#059669" -strokewidth 2.5 -draw "roundrectangle 50,785 700,910 24,24" -stroke none \\
  -fill "#34d399" -font Helvetica-Bold -pointsize 24 -draw "text 80,835 '⚡ Estimated Arrival: Under 30 seconds'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 20 -draw "text 80,875 'Zero network routing fees · Live FX rate locked for 15 min.'" \\
  -fill "#6366f1" -draw "roundrectangle 50,950 700,1040 26,26" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 30 -draw "gravity center text 0,+265 'Confirm & Transfer $2,500.00 →'" \\
  -fill "#475569" -draw "roundrectangle 260,1470 490,1482 6,6" \\
  screenshots/04-instant-transfer-screen.png"""
run(cmd_04)

print("Rendering Screenshot 05: Transfer Receipt Success Screen...")
# 05: Transfer Success Receipt
cmd_05 = """convert -size 750x1520 xc:#070A12 \\
  -fill "#151328" -draw "roundrectangle 12,12 738,1508 52,52" \\
  -fill "#0F172A" -draw "roundrectangle 24,24 726,1496 46,46" \\
  -fill "#000000" -draw "roundrectangle 255,40 495,84 22,22" \\
  -fill "#f8fafc" -font Helvetica-Bold -pointsize 26 -draw "text 65,70 '9:41'" \\
  -fill "#94a3b8" -draw "roundrectangle 625,48 685,76 7,7" \\
  -fill "#10b981" -draw "roundrectangle 628,51 682,73 5,5" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 18 -draw "text 634,68 '100%'" \\
  -fill "#10b981" -draw "circle 375,230 375,160" \\
  -fill "#047857" -draw "circle 375,230 375,175" \\
  -fill "#ffffff" -stroke "#ffffff" -strokewidth 8 -draw "line 345,230 370,260 line 370,260 410,200" -stroke none \\
  -fill "#059669" -draw "roundrectangle 160,330 590,385 16,16" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 20 -draw "gravity center text 0,-400 'INSTANT SETTLEMENT COMPLETED'" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 56 -draw "gravity center text 0,-320 '$2,500.00 USD'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 24 -draw "gravity center text 0,-260 'Sent to Elena Rostova (TechCorp)'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 2.5 -draw "roundrectangle 50,560 700,940 28,28" -stroke none \\
  -fill "#38bdf8" -font Helvetica-Bold -pointsize 26 -draw "text 80,620 'Transaction Details & Proof'" \\
  -fill "#cbd5e1" -font Helvetica -pointsize 21 -draw "text 80,675 'Payment Reference: Q4 Frontend Milestone Hand-off'" \\
  -fill "#cbd5e1" -font Helvetica -pointsize 21 -draw "text 80,725 'Network Hash: #FP-994021-X992'" \\
  -fill "#cbd5e1" -font Helvetica -pointsize 21 -draw "text 80,775 'Fee Breakdown: $0.00 (Zero Fee Routing)'" \\
  -fill "#cbd5e1" -font Helvetica -pointsize 21 -draw "text 80,825 'Settlement Speed: 1.4 seconds (SEPA Instant)'" \\
  -fill "#cbd5e1" -font Helvetica -pointsize 21 -draw "text 80,875 'Timestamp: Oct 14, 2026 · 13:51 UTC'" \\
  -fill "#34d399" -font Helvetica-Bold -pointsize 22 -draw "text 80,920 '✓ Cryptographic Ledger Receipt Verified'" \\
  -fill "#6366f1" -draw "roundrectangle 50,980 700,1070 26,26" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 30 -draw "gravity center text 0,+255 'Back to Dashboard'" \\
  -fill "#1e293b" -stroke "#475569" -strokewidth 2 -draw "roundrectangle 50,1095 700,1185 26,26" -stroke none \\
  -fill "#e2e8f0" -font Helvetica-Bold -pointsize 24 -draw "gravity center text 0,+370 '📄 Download PDF Confirmation Receipt'" \\
  -fill "#475569" -draw "roundrectangle 260,1470 490,1482 6,6" \\
  screenshots/05-transfer-receipt-success.png"""
run(cmd_05)

print("Rendering Screenshot 06: Full Canvas Workspace Overview (High-Clarity)...")
# 06: Full Canvas Studio Overview (1920x1080)
cmd_06 = """convert -size 1920x1080 xc:#070A12 \\
  -fill "#0E0C1C" -draw "rectangle 0,0 1920,70" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 24 -draw "text 35,45 'FlowCraft Pro' " \\
  -fill "#a78bfa" -font Helvetica -pointsize 16 -draw "text 210,45 'v2.8.0 • FinPulse Mobile Prototyping Studio'" \\
  -fill "#1e1b4b" -stroke "#6366f1" -strokewidth 1.5 -draw "roundrectangle 550,14 700,56 10,10" -stroke none \\
  -fill "#c084fc" -font Helvetica-Bold -pointsize 15 -draw "text 570,41 '🔍 Zoom: 100%'" \\
  -fill "#10b981" -draw "roundrectangle 720,14 860,56 10,10" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 15 -draw "text 745,41 '▶ Simulate'" \\
  -fill "#ec4899" -draw "roundrectangle 880,14 1030,56 10,10" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 15 -draw "text 900,41 'Layers Figma'" \\
  -fill "#6366f1" -draw "roundrectangle 1050,14 1240,56 10,10" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 15 -draw "text 1070,41 '📦 Bundle ZIP'" \\
  -fill "#120F22" -draw "rectangle 0,70 280,1080" \\
  -fill "#cbd5e1" -font Helvetica-Bold -pointsize 16 -draw "text 25,110 'COMPONENTS PALETTE'" \\
  -fill "#1c1936" -draw "roundrectangle 20,130 260,180 10,10" \\
  -fill "#ffffff" -font Helvetica -pointsize 15 -draw "text 35,162 '🎬 Internet Video Player'" \\
  -fill "#1c1936" -draw "roundrectangle 20,195 260,245 10,10" \\
  -fill "#ffffff" -font Helvetica -pointsize 15 -draw "text 35,227 '🎠 Banner Carousel'" \\
  -fill "#1c1936" -draw "roundrectangle 20,260 260,310 10,10" \\
  -fill "#ffffff" -font Helvetica -pointsize 15 -draw "text 35,292 '💳 Balance Metric Card'" \\
  -fill "#1c1936" -draw "roundrectangle 20,325 260,375 10,10" \\
  -fill "#ffffff" -font Helvetica -pointsize 15 -draw "text 35,357 '🔘 Interactive Button'" \\
  \\( screenshots/01-welcome-onboarding-screen.png -resize 350x710 \\) -geometry +310+140 -composite \\
  \\( screenshots/02-biometric-authentication-screen.png -resize 350x710 \\) -geometry +690+140 -composite \\
  \\( screenshots/03-portfolio-dashboard-screen.png -resize 350x710 \\) -geometry +1070+140 -composite \\
  \\( screenshots/04-instant-transfer-screen.png -resize 350x710 \\) -geometry +1450+140 -composite \\
  -fill "#38bdf8" -font Helvetica-Bold -pointsize 18 -draw "text 310,120 '01. Welcome Onboarding'" \\
  -fill "#38bdf8" -font Helvetica-Bold -pointsize 18 -draw "text 690,120 '02. Biometric Auth'" \\
  -fill "#38bdf8" -font Helvetica-Bold -pointsize 18 -draw "text 1070,120 '03. Wealth Dashboard'" \\
  -fill "#38bdf8" -font Helvetica-Bold -pointsize 18 -draw "text 1450,120 '04. Instant Transfer'" \\
  -stroke "#6366f1" -strokewidth 4 -fill none \\
  -draw "bezier 660,500 675,470 675,470 690,500" \\
  -draw "bezier 1040,500 1055,470 1055,470 1070,500" \\
  -draw "bezier 1420,500 1435,470 1435,470 1450,500" \\
  -stroke none \\
  -fill "#fef08a" -stroke "#eab308" -strokewidth 1.5 -draw "roundrectangle 690,880 970,980 12,12" -stroke none \\
  -fill "#713f12" -font Helvetica-Bold -pointsize 15 -draw "text 705,912 '📌 API Spec: POST /v1/auth'" \\
  -fill "#854d0e" -font Helvetica -pointsize 13 -draw "text 705,938 'Hardware integrity verification'" \\
  -fill "#713f12" -font Helvetica -pointsize 13 -draw "text 705,962 'Lead Architect • 2026-10-01'" \\
  -fill "#120F22" -draw "rectangle 0,1015 1920,1080" \\
  -fill "#cbd5e1" -font Helvetica-Bold -pointsize 16 -draw "text 35,1055 'Connected Screens: 6  |  Total Prototype Components: 48  |  Interactions: 14 Handled  |  Figma REST API Ready'" \\
  screenshots/06-full-canvas-workspace-overview.png"""
run(cmd_06)

print("Rendering Screenshot 07: Properties Panel & CMS Inspector...")
# 07: Properties Panel & Inspector View
cmd_07 = """convert -size 1920x1080 xc:#070A12 \\
  -fill "#0E0C1C" -draw "rectangle 0,0 1920,70" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 24 -draw "text 35,45 'FlowCraft Pro - Element Properties Inspector & CMS'" \\
  \\( screenshots/03-portfolio-dashboard-screen.png -resize 420x850 \\) -geometry +80+110 -composite \\
  -fill "#120F22" -stroke "#6366f1" -strokewidth 1.5 -draw "roundrectangle 530,95 1880,1045 20,20" -stroke none \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 28 -draw "text 570,150 '⚙️ Element Properties Inspector (Video Player & Banner Carousel)'" \\
  -fill "#cbd5e1" -font Helvetica -pointsize 17 -draw "text 570,190 'Configure real-time internet stream sources, local CMS graphic assets, transition timing, and hyperlinks'" \\
  -fill "#1c1936" -stroke "#334155" -strokewidth 1.5 -draw "roundrectangle 570,225 1200,605 16,16" -stroke none \\
  -fill "#38bdf8" -font Helvetica-Bold -pointsize 20 -draw "text 600,265 '🎬 Video Source File & Stream URL (Internet & Local)'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 16 -draw "text 600,305 'Video Source Mode: Internet Direct Stream / MP4 / WebM'" \\
  -fill "#0f172a" -stroke "#475569" -strokewidth 2 -draw "roundrectangle 600,325 1170,380 12,12" -stroke none \\
  -fill "#a5b4fc" -font Helvetica -pointsize 15 -draw "text 615,360 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-4192.mp4'" \\
  -fill "#10b981" -draw "roundrectangle 600,405 780,455 10,10" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 15 -draw "text 625,435 '📂 Open Assets CMS'" \\
  -fill "#3b82f6" -draw "roundrectangle 800,405 980,455 10,10" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 15 -draw "text 820,435 '🔍 Local PC Search'" \\
  -fill "#cbd5e1" -font Helvetica -pointsize 16 -draw "text 600,490 'Controls: [✓] Autoplay   [✓] Loop   [✓] Muted   [✓] Show Controls'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 15 -draw "text 600,530 'Poster Thumbnail: https://images.unsplash.com/photo-1551288049...'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 15 -draw "text 600,570 'Duration: 02:45   •   Caption: Real-time high frequency liquidity stream'" \\
  -fill "#1c1936" -stroke "#334155" -strokewidth 1.5 -draw "roundrectangle 1230,225 1845,605 16,16" -stroke none \\
  -fill "#c084fc" -font Helvetica-Bold -pointsize 20 -draw "text 1260,265 '🎠 Image Carousel & Banner Slider Customization'" \\
  -fill "#94a3b8" -font Helvetica -pointsize 16 -draw "text 1260,305 'Slide Interval: 3200ms (3.2s)   •   Slide Animation Speed: 450ms'" \\
  -fill "#0f172a" -draw "roundrectangle 1260,325 1815,342 8,8" \\
  -fill "#8b5cf6" -draw "roundrectangle 1260,325 1620,342 8,8" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 16 -draw "text 1260,380 'Slide 1: Earn 5.4% High Yield APY'" \\
  -fill "#38bdf8" -font Helvetica -pointsize 15 -draw "text 1260,408 'Hyperlink Target: Instant Transfer Screen (/transfers/new)'" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 16 -draw "text 1260,448 'Slide 2: Global Multi-Currency Card'" \\
  -fill "#38bdf8" -font Helvetica -pointsize 15 -draw "text 1260,476 'Hyperlink Target: Biometric Sign In Screen (/auth/signin)'" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 16 -draw "text 1260,516 'Slide 3: Instant Business Payroll API'" \\
  -fill "#38bdf8" -font Helvetica -pointsize 15 -draw "text 1260,544 'Hyperlink Target: Instant Transfer Screen (/transfers/new)'" \\
  -fill "#1e1b4b" -stroke "#6366f1" -strokewidth 1.5 -draw "roundrectangle 570,630 1845,1015 16,16" -stroke none \\
  -fill "#ec4899" -font Helvetica-Bold -pointsize 22 -draw "text 600,675 '📦 Multi-Platform Export Suite & Figma REST API Architecture'" \\
  -fill "#e2e8f0" -font Helvetica -pointsize 16 -draw "text 600,720 '• Figma REST API compatible JSON document hierarchy (DOCUMENT -> CANVAS -> FRAME -> ELEMENT)'" \\
  -fill "#e2e8f0" -font Helvetica -pointsize 16 -draw "text 600,760 '• 1-Click Figma Desktop Plugin script generator (import screens with auto-layout directly into Figma canvas)'" \\
  -fill "#e2e8f0" -font Helvetica -pointsize 16 -draw "text 600,800 '• Native iOS SwiftUI & Android Jetpack Compose production components for iPhone 16 Pro & Galaxy S25'" \\
  -fill "#e2e8f0" -font Helvetica -pointsize 16 -draw "text 600,840 '• Cross-platform React Native & Flutter screen definitions with interactive state machines'" \\
  -fill "#e2e8f0" -font Helvetica -pointsize 16 -draw "text 600,880 '• Complete Production Web Build (HTML5 / TypeScript / Vite / Tailwind CSS)'" \\
  -fill "#10b981" -draw "roundrectangle 600,920 910,980 14,14" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 18 -draw "text 625,958 '✓ Download Full Project ZIP'" \\
  -fill "#ec4899" -draw "roundrectangle 930,920 1250,980 14,14" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 18 -draw "text 950,958 '✓ Export Figma REST JSON'" \\
  -fill "#6366f1" -draw "roundrectangle 1270,920 1570,980 14,14" \\
  -fill "#ffffff" -font Helvetica-Bold -pointsize 18 -draw "text 1290,958 '✓ Download Technical PDF'" \\
  screenshots/07-properties-panel-and-cms-inspector.png"""
run(cmd_07)

print("Screenshots generation complete!")

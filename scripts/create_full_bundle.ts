import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { INITIAL_PROJECT } from '../src/data/initialProject';
import { generateReactProjectCode } from '../src/utils/codeGenerator';
import { generateComponentSchema, generateHandoffDataPayload } from '../src/utils/schemaGenerator';
import {
  generateSwiftUICode,
  generateJetpackComposeCode,
  generateReactNativeCode,
  generateFlutterCode,
} from '../src/utils/nativeCodeGenerators';
import { generateFigmaRestApiPayload, generateFigmaPluginScript } from '../src/utils/figmaExporter';

async function main() {
  console.log('📦 Starting Full Project Bundle Creation (Build + Screenshots + Source)...');
  const project = INITIAL_PROJECT;
  const zip = new JSZip();

  // 1. Include Production Build (dist/*)
  const distDir = path.resolve('dist');
  if (fs.existsSync(distDir)) {
    console.log('Adding production build from dist/...');
    function addDirToZip(currentDir: string, zipPrefix: string) {
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        // Skip any existing zip file inside dist to prevent recursion
        if (item.endsWith('.zip')) continue;
        const fullPath = path.join(currentDir, item);
        const relPath = path.join(zipPrefix, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          addDirToZip(fullPath, relPath);
        } else {
          const content = fs.readFileSync(fullPath);
          zip.file(relPath, content);
        }
      }
    }
    addDirToZip(distDir, 'build');
  } else {
    console.warn('Warning: dist/ directory not found. Please run npm run build first.');
  }

  // 2. Include High-Resolution PNG Screenshots
  const screenshotsDir = path.resolve('screenshots');
  if (fs.existsSync(screenshotsDir)) {
    console.log('Adding screenshots from screenshots/...');
    const screenshots = fs.readdirSync(screenshotsDir);
    for (const file of screenshots) {
      if (file.endsWith('.png')) {
        const fileData = fs.readFileSync(path.join(screenshotsDir, file));
        zip.file(`screenshots/${file}`, fileData);
      }
    }

    const screenshotsReadme = `# High-Resolution Product Screenshots Catalog
Project: ${project.name}
Generated: ${new Date().toISOString()}

### Included High-Resolution Screenshots:
1. **00-motion-splash-screen.png** (750x1520):
   - Dynamic motion splash launch screen with brand glowing logo, pulse rings, and 2.8s dwell auto-advance timer.
2. **01-welcome-onboarding-screen.png** (750x1520):
   - Welcome onboarding screen featuring the hero visual banner, zero-fee global transfers card, interactive internet video player walkthrough with play controls, SOC-2 verified badge, primary CTA buttons, and Lead Architect API specification note.
3. **02-biometric-authentication-screen.png** (750x1520):
   - Biometric sign-in artboard with email/password input fields, active FaceID quick authentication toggle, hardware passkey/YubiKey button, and fallback security protocol note.
4. **03-portfolio-dashboard-screen.png** (750x1520):
   - Wealth & cash portfolio dashboard displaying total balance ($148,920.45, +12.4%), interactive featured promotions carousel with active slides and hyperlink triggers, instant transfer action, recent transactions (Stripe, AWS), and bottom tab bar dock.
5. **04-instant-transfer-screen.png** (750x1520):
   - Instant transfer form with recipient IBAN/tag, live balance check, numeric amount field ($2,500.00), payment reference note, and 30-second arrival guarantee card.
6. **05-transfer-receipt-success.png** (750x1520):
   - Transfer completed settlement receipt featuring green verified badge, settlement proof hash (#FP-994021), network breakdown, and actions to return or download PDF receipt.
7. **06-full-canvas-workspace-overview.png** (1920x1080):
   - Panoramic canvas workspace displaying all 6 mobile artboards in sequence, connected with visual bezier navigation flow wires, screen labels, component library sidebar, and top studio navigation.
8. **07-properties-panel-and-cms-inspector.png** (1920x1080):
   - Deep-dive inspector view showing the video URL input, local/internet source selector, CMS graphic assets browser, carousel timing sliders, and multi-platform export panel.`;

    zip.file('screenshots/README-screenshots.md', screenshotsReadme);
  }

  // 3. Include Figma REST API Document & Plugin Script
  console.log('Generating Figma REST API document and plugin script...');
  const figmaPayload = generateFigmaRestApiPayload(project);
  const figmaScript = generateFigmaPluginScript(project);

  zip.file('code-exports/figma/figma-rest-document.json', JSON.stringify(figmaPayload, null, 2));
  zip.file('code-exports/figma/figma-plugin-import.js', figmaScript);
  zip.file(
    'code-exports/figma/README.md',
    `# Export to Figma (REST API & 1-Click Desktop Importer)
Project: ${project.name}

### Method 1: 1-Click Desktop Figma Plugin Console
1. Open any Figma file in your browser or desktop app.
2. In Figma, navigate to: **Plugins -> Development -> Open Console** (or use the Scripter plugin).
3. Paste the contents of \`figma-plugin-import.js\` and press Run.
4. All ${project.screens.length} screens will automatically be generated as native auto-layout frames with correct dimensions, fills, and typography!

### Method 2: Figma REST API / Webhooks
Use \`figma-rest-document.json\` directly with the Figma REST API. It follows the official Figma Node hierarchy (DOCUMENT -> CANVAS -> FRAME -> ELEMENT) with complete prototype interaction links.
`
  );

  // 4. Include Native iOS SwiftUI Source
  console.log('Generating iOS SwiftUI source...');
  const swiftCode = generateSwiftUICode(project);
  zip.file('code-exports/ios-native/ContentView.swift', swiftCode);
  zip.file(
    'code-exports/ios-native/README.md',
    `# Native iOS (SwiftUI)
Project: ${project.name}
Target: iOS 18+ / iPhone 16 Pro
Framework: SwiftUI with Spring Navigation & State Management

### How to Run:
1. Open Xcode 16+.
2. Create a new iOS App project with SwiftUI interface.
3. Paste \`ContentView.swift\` into your project and press Run (Cmd+R).`
  );

  // 5. Include Native Android Jetpack Compose Source
  console.log('Generating Android Jetpack Compose source...');
  const composeCode = generateJetpackComposeCode(project);
  zip.file('code-exports/android-native/MainActivity.kt', composeCode);
  zip.file(
    'code-exports/android-native/README.md',
    `# Native Android (Jetpack Compose)
Project: ${project.name}
Target: Android 15 / Pixel 9 Pro & Samsung Galaxy S25
Framework: Jetpack Compose with Material 3 Navigation

### How to Run:
1. Open Android Studio Ladybug or newer.
2. Create an 'Empty Activity' project with Compose.
3. Replace \`MainActivity.kt\` in \`com.flowcraft.mobile.ui\`.
4. Sync Gradle and Run on an Android emulator or device.`
  );

  // 6. Include React Native & Flutter Source
  console.log('Generating React Native & Flutter source...');
  zip.file('code-exports/react-native/App.tsx', generateReactNativeCode(project));
  zip.file('code-exports/flutter/lib/main.dart', generateFlutterCode(project));

  // 7. Include JSON Schemas & State Machine
  console.log('Generating JSON Schemas and State Machine...');
  zip.file('code-exports/schemas/component-schema.json', JSON.stringify(generateComponentSchema(project), null, 2));
  zip.file('code-exports/schemas/journey-flow-handoff.json', JSON.stringify(generateHandoffDataPayload(project), null, 2));

  // 8. Include Web Prototype Source
  console.log('Generating React Web Prototype source...');
  const reactFiles = generateReactProjectCode(project);
  Object.entries(reactFiles).forEach(([filename, content]) => {
    zip.file(`code-exports/web-prototype/${filename}`, content);
  });

  // 9. Master README.md
  const masterReadme = `# ${project.name}
## Complete Project Bundle: Production Build + Screenshots + Multi-Platform Source

Welcome to the complete delivery bundle for **${project.name}**!

### 📦 Bundle Contents Overview:
- **/build/**: Complete, minified production build ready to host on any web server, CDN, or static host (Vercel, Netlify, Cloudflare Pages, S3).
- **/screenshots/**: High-resolution PNG screen mockups (750x1520 and 1920x1080) for all ${project.screens.length} screens and studio canvas views.
- **/code-exports/figma/**: Figma REST API compatible JSON document + 1-Click Figma plugin script.
- **/code-exports/ios-native/**: Production-grade SwiftUI source code for iPhone 16 Pro.
- **/code-exports/android-native/**: Production-grade Jetpack Compose source code for Pixel 9 & Galaxy S25.
- **/code-exports/react-native/**: Cross-platform React Native App component.
- **/code-exports/flutter/**: Cross-platform Flutter Dart entry point.
- **/code-exports/schemas/**: JSON Schema contracts and interactive finite state machine definitions.
- **/code-exports/web-prototype/**: Modular React + Tailwind CSS web application prototype.

### 🚀 Running the Production Build:
To run the included \`build/\` files locally:
\`\`\`bash
# Using npx serve:
npx serve build

# Or using python:
cd build && python3 -m http.server 8080
\`\`\`

### 🎨 Importing to Figma:
1. Open Figma.
2. Go to **Plugins -> Development -> Open Console**.
3. Paste the contents of \`code-exports/figma/figma-plugin-import.js\` and press Run.
`;
  zip.file('README.md', masterReadme);

  // Generate ZIP file
  console.log('Compressing ZIP archive...');
  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  // Ensure public directory exists
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }

  const rootZipPath = path.resolve('flowcraft-finpulse-build-and-screenshots.zip');
  const publicZipPath = path.resolve('public/flowcraft-finpulse-build-and-screenshots.zip');
  const distZipPath = path.resolve('dist/flowcraft-finpulse-build-and-screenshots.zip');

  fs.writeFileSync(rootZipPath, zipBuffer);
  fs.writeFileSync(publicZipPath, zipBuffer);
  if (fs.existsSync('dist')) {
    fs.writeFileSync(distZipPath, zipBuffer);
  }

  const sizeMb = (zipBuffer.length / (1024 * 1024)).toFixed(2);
  console.log(`✅ Success! Created full bundle ZIP: ${sizeMb} MB`);
  console.log(`Saved to:`);
  console.log(` - ${rootZipPath}`);
  console.log(` - ${publicZipPath}`);
  console.log(` - ${distZipPath}`);
}

main().catch((err) => {
  console.error('Error generating bundle:', err);
  process.exit(1);
});

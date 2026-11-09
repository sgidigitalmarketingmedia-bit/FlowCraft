import JSZip from 'jszip';
import { Project } from '../types/builder';
import { generateReactProjectCode } from './codeGenerator';
import { generateComponentSchema, generateHandoffDataPayload } from './schemaGenerator';
import { 
  generateSwiftUICode, 
  generateJetpackComposeCode, 
  generateReactNativeCode, 
  generateFlutterCode 
} from './nativeCodeGenerators';
import { generateProjectPdfBlob } from './pdfGenerator';

export async function downloadProjectZip(project: Project) {
  const zip = new JSZip();

  // 1. Generate React code files for Web Prototype
  const files = generateReactProjectCode(project);
  Object.entries(files).forEach(([filename, content]) => {
    zip.file(`web-prototype/${filename}`, content);
  });

  // 2. Generate PDF Technical Handoff Specification Document
  try {
    const pdfBlob = await generateProjectPdfBlob(project);
    zip.file('docs/developer-technical-handoff-spec.pdf', pdfBlob);
  } catch (pdfErr) {
    console.warn('PDF inclusion note:', pdfErr);
  }

  // 2. Generate Native iOS (SwiftUI) code files
  const swiftCode = generateSwiftUICode(project);
  zip.file('ios-native/SwiftUI/ContentView.swift', swiftCode);
  zip.file('ios-native/README.md', `# iOS Native Integration (SwiftUI)
Project: ${project.name}
Optimized for: Apple iPhone 16 Pro & iOS 18+

### Setup Instructions
1. Open Xcode 16+ and create a new SwiftUI iOS App.
2. Replace or add \`ContentView.swift\` to your project.
3. Build and Run on iPhone 16 Pro simulator or physical device.`);

  // 3. Generate Native Android (Jetpack Compose) code files
  const composeCode = generateJetpackComposeCode(project);
  zip.file('android-native/JetpackCompose/MainActivity.kt', composeCode);
  zip.file('android-native/README.md', `# Android Native Integration (Jetpack Compose)
Project: ${project.name}
Optimized for: Google Pixel 9 Pro & Samsung Galaxy S25 / S24 Ultra

### Setup Instructions
1. Open Android Studio (Ladybug or newer) and create an 'Empty Activity (Compose)' project.
2. Add \`MainActivity.kt\` in \`com.flowcraft.mobile.ui\`.
3. Sync Gradle and Run on Pixel 9 Pro or Galaxy S25.`);

  // 4. Generate Cross-Platform React Native code files
  const reactNativeCode = generateReactNativeCode(project);
  zip.file('react-native/App.tsx', reactNativeCode);

  // 5. Generate Cross-Platform Flutter code files
  const flutterCode = generateFlutterCode(project);
  zip.file('flutter/lib/main.dart', flutterCode);

  // 6. Generate JSON Schema & Flow State Machine outputs
  const componentSchema = generateComponentSchema(project);
  const handoffPayload = generateHandoffDataPayload(project);

  zip.file('schemas/component-schema.json', JSON.stringify(componentSchema, null, 2));
  zip.file('schemas/journey-flow-handoff.json', JSON.stringify(handoffPayload, null, 2));

  // 7. Generate Figma REST API Compatible Document & Importer Script
  const { generateFigmaRestApiPayload, generateFigmaPluginScript } = await import('./figmaExporter');
  const figmaPayload = generateFigmaRestApiPayload(project);
  const figmaScript = generateFigmaPluginScript(project);

  zip.file('figma/figma-rest-document.json', JSON.stringify(figmaPayload, null, 2));
  zip.file('figma/figma-plugin-import.js', figmaScript);
  zip.file('figma/README.md', `# Export to Figma (Figma REST API & Plugin)
Project: ${project.name}

### Method A: Figma REST API / Webhooks
Use \`figma-rest-document.json\` with the Figma REST API (or middleware such as FigJam/Figma document importers).
The JSON conforms to the Figma REST API node tree hierarchy:
- DOCUMENT -> CANVAS -> FRAME (Screen Artboards)
- Complete element hierarchies: Buttons, Inputs, Carousels, Video Players, Cards, Headers
- Prototyping interactions with transition animations

### Method B: 1-Click Figma Desktop Import (Plugin Console)
1. Open Figma and create or open a document.
2. Go to **Plugins -> Development -> Open Console** (or use the Scripter plugin).
3. Paste the contents of \`figma-plugin-import.js\` and press Run.
4. All ${project.screens.length} screens will be rendered with auto-layout and typography!`);

  // 7. Add Tailwind & Index files for Web
  zip.file('web-prototype/index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${project.name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-slate-950">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

  zip.file('web-prototype/src/index.css', `@import "tailwindcss";

body {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}`);

  // 8. Add screenshots if available
  try {
    const screenshotFiles = [
      '00-motion-splash-screen.png',
      '01-welcome-onboarding-screen.png',
      '02-biometric-authentication-screen.png',
      '03-portfolio-dashboard-screen.png',
      '04-instant-transfer-screen.png',
      '05-transfer-receipt-success.png',
      '06-full-canvas-workspace-overview.png',
      '07-properties-panel-and-cms-inspector.png',
    ];
    for (const filename of screenshotFiles) {
      try {
        const resp = await fetch(`/screenshots/${filename}`);
        if (resp.ok) {
          const blobData = await resp.blob();
          zip.file(`screenshots/${filename}`, blobData);
        }
      } catch {
        // Non-blocking
      }
    }
  } catch {
    // Non-blocking
  }

  // 9. Generate zip blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const sanitizedName = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  link.download = `${sanitizedName}-multi-device-native-bundle.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(filename: string, data: object) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadTextFile(filename: string, content: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

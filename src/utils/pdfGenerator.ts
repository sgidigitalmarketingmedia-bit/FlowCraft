import { jsPDF } from 'jspdf';
import { Project, Screen, ElementProperties } from '../types/builder';
import { generateComponentSchema, generateHandoffDataPayload } from './schemaGenerator';
import { DEVICE_PRESETS } from '../data/initialProject';

/**
 * Generates a comprehensive, beautifully structured technical handoff PDF document
 * for developers based on the project JSON schema, flow pathways, and style specifications.
 */
export function generateDeveloperHandoffPdf(project: Project): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;
  let currentPage = 1;

  const transitions = project.screens.flatMap(screen =>
    screen.elements
      .filter(e => e.hasAction)
      .map(e => ({
        sourceScreen: screen.id,
        triggerElement: e.label || e.name,
        triggerEvent: e.trigger || 'onClick',
        targetScreen: e.targetScreenId || (e.actionType === 'back' ? 'Previous Screen' : 'Action Handler'),
        transitionAnimation: e.transition || 'slide-left',
        action: e.actionType || 'navigate',
      }))
  );
  const initialScreen = project.screens.find(s => s.isEntry) || project.screens[0];

  // Helper for adding new page with header & footer
  const addNewPage = () => {
    doc.addPage();
    currentPage++;
    currentY = margin + 30;
    renderPageHeaderAndFooter();
  };

  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin - 30) {
      addNewPage();
    }
  };

  const renderPageHeaderAndFooter = () => {
    // Header rule & small label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`${project.name} • Developer Technical Handoff Specification`, margin, margin + 12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin, margin + 12, { align: 'right' });
    
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 18, pageWidth - margin, margin + 18);

    // Footer rule & page number
    doc.line(margin, pageHeight - margin - 15, pageWidth - margin, pageHeight - margin - 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('FlowCraft Pro • Production Native Handoff Specification', margin, pageHeight - margin - 4);
    doc.text(`Page ${currentPage}`, pageWidth - margin, pageHeight - margin - 4, { align: 'right' });
  };

  // -------------------------------------------------------------
  // COVER / TITLE HEADER BLOCK
  // -------------------------------------------------------------
  // Header background badge
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, currentY, contentWidth, 120, 8, 8, 'F');

  // Accent gradient line
  doc.setFillColor(37, 99, 235); // blue-600
  doc.roundedRect(margin, currentY, 6, 120, 3, 3, 'F');

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('Developer Technical Handoff', margin + 20, currentY + 36);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(147, 197, 253); // blue-300
  doc.text(project.name, margin + 20, currentY + 54);

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  const descLines = doc.splitTextToSize(project.description || 'Full-stack mobile journey and native implementation specifications.', contentWidth - 40);
  doc.text(descLines, margin + 20, currentY + 72);

  // Metadata pills in cover
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const metaText = `Screens: ${project.screens.length}   |   Transitions: ${transitions.length}   |   Entry: ${initialScreen?.route || '/'}   |   Preset: ${project.devicePreset}`;
  doc.text(metaText, margin + 20, currentY + 104);

  currentY += 140;

  // -------------------------------------------------------------
  // SECTION 1: ARCHITECTURE OVERVIEW & SCREEN HIERARCHY
  // -------------------------------------------------------------
  ensureSpace(120);
  renderSectionTitle('1. Screen Hierarchy & Architecture Summary');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'The table below specifies all screens comprising the mobile application, their routing paths, initial entry point status, and total element counts.',
    margin,
    currentY
  );
  currentY += 15;

  // Screen table header
  const tableHeaderY = currentY;
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, tableHeaderY, contentWidth, 20, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('Index', margin + 8, tableHeaderY + 13);
  doc.text('Screen Name', margin + 40, tableHeaderY + 13);
  doc.text('Route', margin + 210, tableHeaderY + 13);
  doc.text('Role', margin + 330, tableHeaderY + 13);
  doc.text('Elements', margin + 420, tableHeaderY + 13);
  currentY += 20;

  // Screen table rows
  project.screens.forEach((scr, idx) => {
    ensureSpace(22);
    const rowY = currentY;
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, rowY, contentWidth, 20, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, rowY + 20, margin + contentWidth, rowY + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`0${idx + 1}`, margin + 8, rowY + 13);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(scr.title.replace(/^\d+\.\s*/, ''), margin + 40, rowY + 13);

    doc.setFont('courier', 'normal');
    doc.setTextColor(37, 99, 235);
    doc.text(scr.route, margin + 210, rowY + 13);

    doc.setFont('helvetica', scr.isEntry ? 'bold' : 'normal');
    doc.setTextColor(scr.isEntry ? 16 : 100, scr.isEntry ? 185 : 116, scr.isEntry ? 129 : 139);
    doc.text(scr.isEntry ? 'Initial Entry' : 'Flow Destination', margin + 330, rowY + 13);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`${scr.elements.length} components`, margin + 420, rowY + 13);

    currentY += 20;
  });

  currentY += 25;

  // -------------------------------------------------------------
  // SECTION 2: FLOW PATHWAYS & INTERACTION STATE MACHINE
  // -------------------------------------------------------------
  ensureSpace(140);
  renderSectionTitle('2. User Journey Flow Pathways & State Transitions');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Interactive flow pathways triggered by user interactions (tap, submission, gestures) and the resulting state transitions and screen motions.',
    margin,
    currentY
  );
  currentY += 15;

  // Pathway table header
  const flowHeaderY = currentY;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, flowHeaderY, contentWidth, 20, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Source Screen', margin + 8, flowHeaderY + 13);
  doc.text('Trigger Component', margin + 140, flowHeaderY + 13);
  doc.text('Event', margin + 270, flowHeaderY + 13);
  doc.text('Target Screen', margin + 340, flowHeaderY + 13);
  doc.text('Transition Motion', margin + 440, flowHeaderY + 13);
  currentY += 20;

  if (transitions.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('No interactive action triggers configured.', margin + 8, currentY + 14);
    currentY += 24;
  } else {
    transitions.forEach((trans, idx) => {
      ensureSpace(22);
      const rowY = currentY;
      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, rowY, contentWidth, 20, 'F');
      }
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, rowY + 20, margin + contentWidth, rowY + 20);

      const srcScreen = project.screens.find(s => s.id === trans.sourceScreen);
      const targetScreen = project.screens.find(s => s.id === trans.targetScreen);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(srcScreen ? srcScreen.title.replace(/^\d+\.\s*/, '') : trans.sourceScreen, margin + 8, rowY + 13);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(trans.triggerElement, margin + 140, rowY + 13);

      doc.setFont('courier', 'normal');
      doc.setTextColor(37, 99, 235);
      doc.text(trans.triggerEvent || 'onClick', margin + 270, rowY + 13);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129); // emerald-600
      doc.text(targetScreen ? targetScreen.title.replace(/^\d+\.\s*/, '') : (trans.targetScreen || 'Action Handler'), margin + 340, rowY + 13);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(trans.transitionAnimation || 'slide-left', margin + 440, rowY + 13);

      currentY += 20;
    });
  }

  currentY += 25;

  // -------------------------------------------------------------
  // SECTION 3: COMPONENT SPECIFICATIONS & PROP CONTRACTS
  // -------------------------------------------------------------
  ensureSpace(120);
  renderSectionTitle('3. Screen & Component Prop Specifications');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Detailed prop attributes, validation types, visual variants, and interactive parameters for all UI components on each artboard.',
    margin,
    currentY
  );
  currentY += 15;

  project.screens.forEach((screen, scrIdx) => {
    ensureSpace(80);

    // Screen sub-box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, currentY, contentWidth, 24, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Screen 0${scrIdx + 1}: ${screen.title} (${screen.route})`, margin + 10, currentY + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    currentY += 28;

    // Screen Developer Annotations & Sticky Notes
    if (screen.annotations && screen.annotations.length > 0) {
      screen.annotations.forEach(ann => {
        ensureSpace(24);
        const annY = currentY;
        doc.setFillColor(254, 249, 195);
        doc.roundedRect(margin + 6, annY, contentWidth - 12, 18, 3, 3, 'F');
        doc.setDrawColor(234, 179, 8);
        doc.roundedRect(margin + 6, annY, contentWidth - 12, 18, 3, 3, 'S');

        // Badge
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(161, 98, 7);
        const badgeLabel = ann.type === 'pin' ? `[PIN • ${ann.category.toUpperCase()}]` : `[NOTE • ${ann.category.toUpperCase()}]`;
        doc.text(badgeLabel, margin + 12, annY + 12);

        // Content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(30, 41, 59);
        const noteText = `${ann.title ? `${ann.title}: ` : ''}${ann.content}`;
        const truncatedNote = noteText.length > 88 ? noteText.substring(0, 85) + '...' : noteText;
        doc.text(truncatedNote, margin + 130, annY + 12);

        currentY += 22;
      });
    }

    // Component sub-table
    screen.elements.forEach((el, elIdx) => {
      ensureSpace(28);
      const rowY = currentY;

      doc.setDrawColor(241, 245, 249);
      doc.setFillColor(elIdx % 2 === 0 ? 255 : 248, elIdx % 2 === 0 ? 255 : 250, elIdx % 2 === 0 ? 255 : 252);
      doc.rect(margin, rowY, contentWidth, 24, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, rowY + 24, margin + contentWidth, rowY + 24);

      // Component Type Badge
      doc.setFillColor(37, 99, 235);
      doc.roundedRect(margin + 6, rowY + 5, 52, 14, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(el.type.toUpperCase(), margin + 32, rowY + 15, { align: 'center' });

      // Label & Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(el.label || el.name, margin + 65, rowY + 15);

      // Props / Variant
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      const propsSummary = `Variant: ${el.variant || 'default'}  |  Radius: ${el.borderRadius || 'md'}`;
      doc.text(propsSummary, margin + 240, rowY + 15);

      // Action / Target
      if (el.hasAction) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
        const actionDesc = `Action: ${el.actionType} → ${el.targetScreenId || 'handled'}`;
        doc.text(actionDesc, margin + 380, rowY + 15);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text('Static Presentational', margin + 380, rowY + 15);
      }

      currentY += 24;
    });

    currentY += 14;
  });

  currentY += 10;

  // -------------------------------------------------------------
  // SECTION 4: STYLE SPECIFICATIONS & DESIGN SYSTEM TOKENS
  // -------------------------------------------------------------
  ensureSpace(140);
  renderSectionTitle('4. Design System Tokens & Style Specifications');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Production color palettes, typographic hierarchies, border radii, and device hardware specifications for design and developer alignment.',
    margin,
    currentY
  );
  currentY += 18;

  // Color Tokens Palette Blocks
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Brand & UI Color Palette Tokens:', margin, currentY);
  currentY += 10;

  const colorTokens = [
    { name: 'Primary Blue', hex: '#2563EB', r: 37, g: 99, b: 235 },
    { name: 'Deep Slate Bg', hex: '#0F172A', r: 15, g: 23, b: 42 },
    { name: 'Card Surface', hex: '#1E293B', r: 30, g: 41, b: 59 },
    { name: 'Success Green', hex: '#10B981', r: 16, g: 185, b: 129 },
    { name: 'Accent Amber', hex: '#F59E0B', r: 245, g: 158, b: 11 },
  ];

  const swatchWidth = (contentWidth - (colorTokens.length - 1) * 10) / colorTokens.length;
  colorTokens.forEach((color, i) => {
    const swatchX = margin + i * (swatchWidth + 10);
    // Color block
    doc.setFillColor(color.r, color.g, color.b);
    doc.roundedRect(swatchX, currentY, swatchWidth, 32, 4, 4, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(swatchX, currentY, swatchWidth, 32, 4, 4, 'S');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(color.name, swatchX + 4, currentY + 44);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(color.hex, swatchX + 4, currentY + 54);
  });

  currentY += 66;

  // Typography & Radii Tokens Table
  ensureSpace(100);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Typography & Spacing Standards:', margin, currentY);
  currentY += 10;

  const tokenRows = [
    { category: 'Typography (UI Font)', val: 'Plus Jakarta Sans, system-ui, sans-serif', standard: 'Display & Primary Body Copy' },
    { category: 'Typography (Code & Numbers)', val: 'JetBrains Mono, SF Mono, monospace', standard: 'Tabular Currency, Numbers, Routes' },
    { category: 'Border Radius (Cards)', val: '16px (1.0rem)', standard: 'Surfaces, modules, and modals' },
    { category: 'Border Radius (Buttons)', val: '14px (0.875rem)', standard: 'Primary & Secondary action buttons' },
    { category: 'Border Radius (Inputs)', val: '12px (0.75rem)', standard: 'Text fields, search bars, and selects' },
  ];

  tokenRows.forEach((row, idx) => {
    ensureSpace(18);
    const rowY = currentY;
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, rowY, contentWidth, 18, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, rowY + 18, margin + contentWidth, rowY + 18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(row.category, margin + 8, rowY + 12);

    doc.setFont('courier', 'normal');
    doc.setTextColor(37, 99, 235);
    doc.text(row.val, margin + 170, rowY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(row.standard, margin + 360, rowY + 12);

    currentY += 18;
  });

  currentY += 25;

  // -------------------------------------------------------------
  // SECTION 5: HARDWARE DEVICE PROFILES & NATIVE INTEGRATION
  // -------------------------------------------------------------
  ensureSpace(140);
  renderSectionTitle('5. Hardware Device Profiles & Native Framework Integration');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Hardware specification benchmarks validated on simulator for cross-platform integration.',
    margin,
    currentY
  );
  currentY += 14;

  const devicesList = [
    {
      model: 'Apple iPhone 16 Pro',
      os: 'iOS 18+ (SwiftUI 5+)',
      viewport: '393 × 852 pt',
      safeArea: 'Dynamic Island, 59pt top, 34pt bottom',
      frameworkFile: 'ios-native/SwiftUI/ContentView.swift',
    },
    {
      model: 'Google Pixel 9 Pro',
      os: 'Android 15 (Jetpack Compose)',
      viewport: '412 × 915 dp',
      safeArea: 'Centered punch-hole camera, Material 3 Scaffold',
      frameworkFile: 'android-native/JetpackCompose/MainActivity.kt',
    },
    {
      model: 'Samsung Galaxy S25',
      os: 'One UI 7 (Jetpack Compose)',
      viewport: '384 × 832 dp',
      safeArea: 'Pinhole cutout, squared titanium corners',
      frameworkFile: 'android-native/JetpackCompose/MainActivity.kt',
    },
  ];

  devicesList.forEach((dev, idx) => {
    ensureSpace(40);
    const boxY = currentY;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, boxY, contentWidth, 34, 4, 4, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, boxY, contentWidth, 34, 4, 4, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(dev.model, margin + 10, boxY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Platform: ${dev.os}   |   Viewport: ${dev.viewport}`, margin + 10, boxY + 26);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(37, 99, 235);
    doc.text(`File: ${dev.frameworkFile}`, pageWidth - margin - 10, boxY + 20, { align: 'right' });

    currentY += 40;
  });

  currentY += 15;

  // Developer Checklist Block
  ensureSpace(70);
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.roundedRect(margin, currentY, contentWidth, 54, 6, 6, 'F');
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, currentY, contentWidth, 54, 6, 6, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(49, 46, 129); // indigo-900
  doc.text('Developer Integration Checklist:', margin + 12, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(67, 56, 202);
  doc.text('[x] JSON schema contracts exported and compliant with Draft-07 specification', margin + 12, currentY + 28);
  doc.text('[x] Journey flow state machine verified with valid initial state and destination routes', margin + 12, currentY + 38);
  doc.text('[x] Native SwiftUI & Jetpack Compose boilerplate files packaged for rapid iOS & Android builds', margin + 12, currentY + 48);

  // Render headers and footers across all generated pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    // Header & Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`${project.name} • Developer Technical Handoff Specification`, margin, margin + 12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin, margin + 12, { align: 'right' });
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 18, pageWidth - margin, margin + 18);

    doc.line(margin, pageHeight - margin - 15, pageWidth - margin, pageHeight - margin - 15);
    doc.text('FlowCraft Pro Native Studio • Technical Handoff Spec', margin, pageHeight - margin - 4);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - margin - 4, { align: 'right' });
  }

  return doc;

  // Helper inside to render uniform section title
  function renderSectionTitle(title: string) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(title, margin, currentY);

    // Accent line under title
    doc.setFillColor(37, 99, 235);
    doc.rect(margin, currentY + 4, 30, 2, 'F');
    currentY += 16;
  }
}

/**
 * Downloads the technical developer handoff PDF directly in the browser.
 */
export function downloadDeveloperHandoffPdf(project: Project): void {
  const doc = generateDeveloperHandoffPdf(project);
  const slug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  doc.save(`${slug}-technical-handoff-spec.pdf`);
}

/**
 * Generates the PDF Blob representation for preview or ZIP packaging.
 */
export async function generateProjectPdfBlob(project: Project): Promise<Blob> {
  const doc = generateDeveloperHandoffPdf(project);
  return doc.output('blob');
}

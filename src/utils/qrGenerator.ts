import QRCode from 'qrcode';
import { QRConfig, QRDotStyle } from '../types';
import { DEFAULT_LOGO_DATA_URL } from '../constants/logos';

export type PlatformType = 'meet' | 'zoom' | 'teams' | 'webex' | 'youtube' | 'general';

export interface PlatformInfo {
  type: PlatformType;
  name: string;
  badgeColor: string;
  iconName: string;
  description: string;
}

/**
 * Detects the meeting/link platform based on URL pattern
 */
export function detectPlatform(url: string): PlatformInfo {
  const cleanUrl = url.trim().toLowerCase();

  if (cleanUrl.includes('meet.google.com')) {
    return {
      type: 'meet',
      name: 'Google Meet',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconName: 'Video',
      description: 'Tautan panggilan video Google Meet',
    };
  }

  if (cleanUrl.includes('zoom.us') || cleanUrl.includes('zoomgov.com')) {
    return {
      type: 'zoom',
      name: 'Zoom Meeting',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconName: 'Video',
      description: 'Tautan ruang rapat Zoom',
    };
  }

  if (cleanUrl.includes('teams.microsoft.com') || cleanUrl.includes('teams.live.com')) {
    return {
      type: 'teams',
      name: 'Microsoft Teams',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconName: 'Video',
      description: 'Tautan rapat Microsoft Teams',
    };
  }

  if (cleanUrl.includes('webex.com')) {
    return {
      type: 'webex',
      name: 'Cisco Webex',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      iconName: 'Video',
      description: 'Tautan konferensi Cisco Webex',
    };
  }

  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    return {
      type: 'youtube',
      name: 'YouTube Live / Video',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      iconName: 'Youtube',
      description: 'Tautan siaran langsung atau video YouTube',
    };
  }

  return {
    type: 'general',
    name: 'Tautan Web / Dokumen',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    iconName: 'Globe',
    description: 'Tautan website, agenda, atau berkas rapat',
  };
}

/**
 * Sanitizes a filename for cross-platform download
 */
export function sanitizeFileName(name: string, fallback = 'qr_code'): string {
  const sanitized = (name || '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_')
    .substring(0, 50);
  return sanitized || fallback;
}

/**
 * Validates whether the given string is a valid URL or meeting link
 */
export function validateMeetingUrl(url: string): {
  isValid: boolean;
  errorMessage?: string;
  normalizedUrl: string;
  platformType?: PlatformType;
  platformLabel?: string;
} {
  const trimmed = url.trim();
  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: 'Tautan rapat tidak boleh kosong',
      normalizedUrl: '',
      platformLabel: 'Tautan',
    };
  }

  let testUrl = trimmed;
  if (!/^https?:\/\//i.test(testUrl)) {
    testUrl = `https://${testUrl}`;
  }

  try {
    const parsed = new URL(testUrl);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return {
        isValid: false,
        errorMessage: 'Format domain URL tidak valid (contoh: meet.google.com/xxx)',
        normalizedUrl: testUrl,
        platformLabel: 'Tautan',
      };
    }
    const platform = detectPlatform(testUrl);
    return {
      isValid: true,
      normalizedUrl: testUrl,
      platformType: platform.type,
      platformLabel: platform.name,
    };
  } catch {
    return {
      isValid: false,
      errorMessage: 'URL tidak valid. Masukkan tautan lengkap.',
      normalizedUrl: testUrl,
      platformLabel: 'Tautan',
    };
  }
}

/**
 * Checks if a coordinate belongs to one of the three 7x7 finder patterns (corners)
 */
export function isFinderPattern(r: number, c: number, moduleCount: number): boolean {
  // Top-Left Finder
  if (r <= 6 && c <= 6) return true;
  // Top-Right Finder
  if (r <= 6 && c >= moduleCount - 7) return true;
  // Bottom-Left Finder
  if (r >= moduleCount - 7 && c <= 6) return true;
  return false;
}

/**
 * Resolves the active logo Data URL according to user configuration
 */
export function getActiveLogoDataUrl(config: QRConfig): string | null {
  switch (config.logoPreset) {
    case 'default':
      return DEFAULT_LOGO_DATA_URL;
    case 'custom':
      return config.customLogoUrl || null;
    case 'none':
      return null;
    default:
      return DEFAULT_LOGO_DATA_URL;
  }
}

/**
 * Loads an image from a URL or Data URL asynchronously
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Helper to draw rounded rectangle on canvas
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * Helper to wrap text into multiple lines for Canvas
 */
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];

  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }
      if (ctx.measureText(word).width > maxWidth) {
        let chunk = '';
        for (const char of word) {
          if (ctx.measureText(chunk + char).width <= maxWidth) {
            chunk += char;
          } else {
            lines.push(chunk);
            chunk = char;
          }
        }
        currentLine = chunk;
      } else {
        currentLine = word;
      }
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Escapes special XML characters for safe SVG embedding
 */
function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Helper to wrap text for SVG output
 */
function wrapSvgText(text: string, maxCharsPerLine = 32): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    } else {
      if (currentLine) lines.push(currentLine);
      if (word.length > maxCharsPerLine) {
        let part = '';
        for (const ch of word) {
          if ((part + ch).length <= maxCharsPerLine) {
            part += ch;
          } else {
            lines.push(part);
            part = ch;
          }
        }
        currentLine = part;
      } else {
        currentLine = word;
      }
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Generates the raw square HTMLCanvasElement with the QR Code, custom dot style, and framed logo.
 */
export async function generateRawQRCanvas(
  config: QRConfig,
  targetResolution?: number
): Promise<HTMLCanvasElement> {
  const rawUrl = config.meetingUrl || config.zoomUrl || '';
  const validation = validateMeetingUrl(rawUrl);
  const targetUrl = validation.isValid ? validation.normalizedUrl : 'https://meet.google.com';

  const qrData = QRCode.create(targetUrl, {
    errorCorrectionLevel: config.errorCorrectionLevel || 'H',
  });

  const moduleCount = qrData.modules.size;
  const marginModules = config.margin ?? 3;
  const totalModules = moduleCount + marginModules * 2;

  const resolution = targetResolution || config.qrSize || 1024;
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D canvas context');

  // Background of the QR canvas
  ctx.fillStyle = config.bgColor || '#ffffff';
  ctx.fillRect(0, 0, resolution, resolution);

  // Module sizing
  const moduleSize = resolution / totalModules;
  const offset = marginModules * moduleSize;
  const dotStyle: QRDotStyle = config.dotStyle || 'square';

  // Render QR Modules
  ctx.fillStyle = config.fgColor || '#000000';

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qrData.modules.get(r, c)) {
        const x = offset + c * moduleSize;
        const y = offset + r * moduleSize;
        const isFinder = isFinderPattern(r, c, moduleCount);

        if (isFinder || dotStyle === 'square') {
          // Classic crisp square module (and finder modules for 100% scan precision)
          if (dotStyle === 'rounded' && isFinder) {
            drawRoundedRect(ctx, x, y, moduleSize, moduleSize, moduleSize * 0.25);
          } else {
            ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(moduleSize), Math.ceil(moduleSize));
          }
        } else if (dotStyle === 'dots') {
          // Circular dot module
          const radius = (moduleSize / 2) * 0.88;
          ctx.beginPath();
          ctx.arc(x + moduleSize / 2, y + moduleSize / 2, radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (dotStyle === 'rounded') {
          // Rounded rectangular module
          const pad = moduleSize * 0.04;
          const radius = moduleSize * 0.35;
          drawRoundedRect(ctx, x + pad, y + pad, moduleSize - pad * 2, moduleSize - pad * 2, radius);
        } else if (dotStyle === 'classy') {
          // Classy diamond / smooth micro-pill module
          const pad = moduleSize * 0.05;
          const w = moduleSize - pad * 2;
          const h = moduleSize - pad * 2;
          drawRoundedRect(ctx, x + pad, y + pad, w, h, moduleSize * 0.45);
        }
      }
    }
  }

  // Draw Logo with circular protective badge & elegant border ring
  const logoDataUrl = getActiveLogoDataUrl(config);
  if (logoDataUrl && config.logoPreset !== 'none') {
    try {
      const logoImg = await loadImage(logoDataUrl);

      // Sizing calculation
      const logoPercent = Math.min(Math.max(config.logoSizePercent || 20, 12), 26) / 100;
      const logoBoundingSize = resolution * logoPercent;
      const centerX = resolution / 2;
      const centerY = resolution / 2;

      // Maintain natural aspect ratio
      const naturalAspect = (logoImg.naturalWidth || 1) / (logoImg.naturalHeight || 1);
      let drawW = logoBoundingSize;
      let drawH = logoBoundingSize;

      if (naturalAspect > 1) {
        drawH = logoBoundingSize / naturalAspect;
      } else if (naturalAspect < 1) {
        drawW = logoBoundingSize * naturalAspect;
      }

      const drawX = centerX - drawW / 2;
      const drawY = centerY - drawH / 2;

      const hasBorder = config.logoBorder !== false; // Default true
      if (hasBorder) {
        // Radius of protective circular badge
        const badgeRadius = (Math.max(drawW, drawH) / 2) + Math.max(resolution * 0.012, 5);
        
        ctx.save();
        // 1. Draw solid circular badge background in white (or config.bgColor) so QR dark modules are kept away cleanly
        ctx.beginPath();
        ctx.arc(centerX, centerY, badgeRadius, 0, Math.PI * 2);
        ctx.fillStyle = config.bgColor || '#ffffff';
        ctx.fill();

        // 2. Draw crisp circular border stroke
        const strokeColor = config.logoBorderColor || config.fgColor || '#0F172A';
        const strokeWidth = Math.max(resolution * 0.0035, 2.5);
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        // 3. Subtle inner accent ring for high-end crest framing
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(badgeRadius - strokeWidth - 2, 2), 0, Math.PI * 2);
        ctx.lineWidth = Math.max(resolution * 0.001, 1);
        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha = 0.25;
        ctx.stroke();
        ctx.restore();
      }

      // Draw logo centered and sharp inside the framed badge
      ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
    } catch (err) {
      console.warn('Could not draw logo on canvas:', err);
    }
  }

  return canvas;
}

/**
 * Generates an export-ready HTMLCanvasElement with white background, meeting title header,
 * and QR Code centered underneath. ONLY title and QR code are included (no badges or footer links).
 * Layout: Title is lowered 1 enter close to the QR code, centered horizontally, and expands upward if multi-line.
 */
export async function generateExportCanvas(
  config: QRConfig,
  targetResolution?: number
): Promise<HTMLCanvasElement> {
  const cardWidth = targetResolution || config.exportResolution || 2048;
  const meetingTitle = config.meetingName.trim() || 'Judul';
  const rawUrl = config.meetingUrl || config.zoomUrl || '';
  const validation = validateMeetingUrl(rawUrl);
  const targetUrl = validation.isValid ? validation.normalizedUrl : 'https://meet.google.com';

  const qrData = QRCode.create(targetUrl, {
    errorCorrectionLevel: config.errorCorrectionLevel || 'H',
  });
  const moduleCount = qrData.modules.size;
  const marginModules = config.margin ?? 3;
  const totalModules = moduleCount + marginModules * 2;

  const qrSize = Math.round(cardWidth * 0.82);
  const qrX = Math.round((cardWidth - qrSize) / 2);
  const moduleSize = qrSize / totalModules;
  // White quiet zone margin already inside the raw QR canvas:
  const qrQuietZone = marginModules * moduleSize;

  // Measure fonts and text layout
  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d')!;

  const padX = Math.round(cardWidth * 0.08);
  const contentWidth = cardWidth - padX * 2;

  // Title sizing (clean, prominent, high contrast)
  let titleFontSize = Math.max(Math.round(cardWidth * 0.046), 34);
  if (meetingTitle.length > 55) {
    titleFontSize = Math.max(Math.round(cardWidth * 0.035), 28);
  } else if (meetingTitle.length > 30) {
    titleFontSize = Math.max(Math.round(cardWidth * 0.04), 30);
  }
  const titleFont = `bold ${titleFontSize}px 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`;
  measureCtx.font = titleFont;
  const titleLines = wrapCanvasText(measureCtx, meetingTitle, contentWidth);
  const titleLineHeight = Math.round(titleFontSize * 1.34);
  const titleTotalHeight = titleLines.length * titleLineHeight;

  // Distance between title text bottom and top black QR modules:
  // Lowered down close to the QR code (~0.55 * titleFontSize)
  const gapToBlackModules = Math.round(titleFontSize * 0.55);

  const padTopMin = Math.round(cardWidth * 0.08);
  const padBottom = Math.round(cardWidth * 0.07);

  // Position QR:
  const qrY = Math.max(
    padTopMin + titleTotalHeight + gapToBlackModules - qrQuietZone,
    Math.round(cardWidth * 0.04)
  );

  const totalCardHeight = qrY + qrSize + padBottom;

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = cardWidth;
  exportCanvas.height = totalCardHeight;
  const ctx = exportCanvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D canvas context');

  // 1. Pure White Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, cardWidth, totalCardHeight);

  // 2. Position calculations:
  // The bottom of the title is placed down close to the top black QR modules:
  const titleBottomY = qrY + qrQuietZone - gapToBlackModules;
  const titleStartY = titleBottomY - titleTotalHeight;

  ctx.font = titleFont;
  ctx.fillStyle = '#0F172A';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let i = 0; i < titleLines.length; i++) {
    const lineY = titleStartY + i * titleLineHeight;
    ctx.fillText(titleLines[i], cardWidth / 2, lineY);
  }

  // 3. QR Code (directly underneath title, lowered down close to title)
  const rawQRCanvas = await generateRawQRCanvas(config, qrSize);
  ctx.drawImage(rawQRCanvas, qrX, qrY, qrSize, qrSize);

  return exportCanvas;
}

/**
 * Generates an HTMLCanvasElement with the QR Code.
 * When includeTitle is true (or default when exporting), formats as white background, title at top, and QR code below.
 */
export async function generateQRCanvas(
  config: QRConfig,
  targetResolution?: number,
  includeTitle?: boolean
): Promise<HTMLCanvasElement> {
  const shouldIncludeTitle = includeTitle ?? false;
  if (shouldIncludeTitle) {
    return generateExportCanvas(config, targetResolution);
  }
  return generateRawQRCanvas(config, targetResolution);
}

/**
 * Generates an SVG string representation of the QR Code with custom dot style and framed logo.
 * If includeTitle is true (default when config.includeTitleInExport !== false), generates a complete vector card:
 * white background, meeting title at top, and QR code underneath (ONLY title and QR code, no badges or footers).
 */
export async function generateQRSVG(
  config: QRConfig,
  includeTitle?: boolean
): Promise<string> {
  const rawUrl = config.meetingUrl || config.zoomUrl || '';
  const validation = validateMeetingUrl(rawUrl);
  const targetUrl = validation.isValid ? validation.normalizedUrl : 'https://meet.google.com';

  const qrData = QRCode.create(targetUrl, {
    errorCorrectionLevel: config.errorCorrectionLevel || 'H',
  });

  const moduleCount = qrData.modules.size;
  const margin = config.margin ?? 3;
  const totalSize = moduleCount + margin * 2;
  const viewBoxSize = 1000;
  const moduleSize = viewBoxSize / totalSize;
  const offset = margin * moduleSize;
  const dotStyle: QRDotStyle = config.dotStyle || 'square';

  // Build SVG elements for modules
  let modulesSvg = '';

  if (dotStyle === 'square') {
    let pathD = '';
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qrData.modules.get(r, c)) {
          const x = offset + c * moduleSize;
          const y = offset + r * moduleSize;
          pathD += `M${x.toFixed(2)},${y.toFixed(2)}h${moduleSize.toFixed(2)}v${moduleSize.toFixed(2)}h-${moduleSize.toFixed(2)}z `;
        }
      }
    }
    modulesSvg = `<path d="${pathD}" fill="${config.fgColor || '#000000'}" shape-rendering="crispEdges" />`;
  } else {
    // Generate individual SVG shapes (dots, rounded, classy)
    let shapes = '';
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qrData.modules.get(r, c)) {
          const x = offset + c * moduleSize;
          const y = offset + r * moduleSize;
          const isFinder = isFinderPattern(r, c, moduleCount);

          if (isFinder) {
            const rx = dotStyle === 'rounded' ? (moduleSize * 0.25).toFixed(2) : '0';
            shapes += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${moduleSize.toFixed(2)}" height="${moduleSize.toFixed(2)}" rx="${rx}" fill="${config.fgColor || '#000000'}" />`;
          } else if (dotStyle === 'dots') {
            const cx = (x + moduleSize / 2).toFixed(2);
            const cy = (y + moduleSize / 2).toFixed(2);
            const rad = ((moduleSize / 2) * 0.88).toFixed(2);
            shapes += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${config.fgColor || '#000000'}" />`;
          } else if (dotStyle === 'rounded') {
            const pad = moduleSize * 0.04;
            const rx = (moduleSize * 0.35).toFixed(2);
            shapes += `<rect x="${(x + pad).toFixed(2)}" y="${(y + pad).toFixed(2)}" width="${(moduleSize - pad * 2).toFixed(2)}" height="${(moduleSize - pad * 2).toFixed(2)}" rx="${rx}" fill="${config.fgColor || '#000000'}" />`;
          } else if (dotStyle === 'classy') {
            const pad = moduleSize * 0.05;
            const rx = (moduleSize * 0.45).toFixed(2);
            shapes += `<rect x="${(x + pad).toFixed(2)}" y="${(y + pad).toFixed(2)}" width="${(moduleSize - pad * 2).toFixed(2)}" height="${(moduleSize - pad * 2).toFixed(2)}" rx="${rx}" fill="${config.fgColor || '#000000'}" />`;
          }
        }
      }
    }
    modulesSvg = `<g id="qr-modules">${shapes}</g>`;
  }

  const logoDataUrl = getActiveLogoDataUrl(config);
  let logoSvgElement = '';

  if (logoDataUrl && config.logoPreset !== 'none') {
    const logoPercent = Math.min(Math.max(config.logoSizePercent || 20, 12), 26) / 100;
    const logoSize = viewBoxSize * logoPercent;
    const centerX = viewBoxSize / 2;
    const centerY = viewBoxSize / 2;
    const logoX = centerX - logoSize / 2;
    const logoY = centerY - logoSize / 2;

    const hasBorder = config.logoBorder !== false;
    let badgeSvg = '';
    if (hasBorder) {
      const badgeRadius = (logoSize / 2) + Math.max(viewBoxSize * 0.012, 5);
      const strokeColor = config.logoBorderColor || config.fgColor || '#0F172A';
      const strokeWidth = Math.max(viewBoxSize * 0.0035, 2.5);
      badgeSvg = `
        <!-- Circular protective badge and border ring -->
        <circle cx="${centerX.toFixed(2)}" cy="${centerY.toFixed(2)}" r="${badgeRadius.toFixed(2)}" fill="${config.bgColor || '#FFFFFF'}" stroke="${strokeColor}" stroke-width="${strokeWidth.toFixed(2)}" />
        <circle cx="${centerX.toFixed(2)}" cy="${centerY.toFixed(2)}" r="${(badgeRadius - strokeWidth - 2).toFixed(2)}" fill="none" stroke="${strokeColor}" stroke-width="1" opacity="0.25" />
      `;
    }

    logoSvgElement = `
      <g id="qr-logo-overlay">
        ${badgeSvg}
        <image href="${logoDataUrl}" x="${logoX.toFixed(2)}" y="${logoY.toFixed(2)}" width="${logoSize.toFixed(2)}" height="${logoSize.toFixed(2)}" preserveAspectRatio="xMidYMid meet" />
      </g>
    `;
  }

  // Check if we should render card layout (white background, title at top, QR underneath)
  const shouldRenderCard = includeTitle ?? (config.includeTitleInExport !== false);

  if (!shouldRenderCard) {
    // Standard square 1:1 QR code SVG
    return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${viewBoxSize}" height="${viewBoxSize}">
  <!-- Background -->
  <rect width="${viewBoxSize}" height="${viewBoxSize}" fill="${config.bgColor || '#FFFFFF'}" />
  <!-- QR Modules -->
  ${modulesSvg}
  ${logoSvgElement}
</svg>`;
  }

  // Card Format: Pure White Background, Title at top, QR Code underneath ONLY
  // Layout: Title is lowered close to the QR code, centered horizontally, and expands upward if multi-line.
  const meetingTitle = config.meetingName.trim() || 'Judul';
  const qrBoxSize = 780;
  const qrX = (1000 - qrBoxSize) / 2;
  const qrScale = qrBoxSize / viewBoxSize;
  const qrQuietZone = offset * qrScale;

  const titleFontSize = meetingTitle.length > 55 ? 28 : meetingTitle.length > 30 ? 34 : 40;
  const titleLines = wrapSvgText(meetingTitle, titleFontSize < 34 ? 36 : 28);
  const titleLineHeight = Math.round(titleFontSize * 1.34);
  const titleTotalHeight = titleLines.length * titleLineHeight;

  // Distance between title bottom and top black QR modules:
  const gapToBlackModules = Math.round(titleFontSize * 0.55);

  const padTopMin = 75;
  const padBottom = 65;

  const qrY = Math.max(
    padTopMin + titleTotalHeight + gapToBlackModules - qrQuietZone,
    45
  );

  const totalSvgHeight = qrY + qrBoxSize + padBottom;

  // The title's bottom is anchored close to the top black QR modules:
  const titleBottomY = qrY + qrQuietZone - gapToBlackModules;
  const titleStartY = titleBottomY - titleTotalHeight;

  let titleTspans = '';
  for (let i = 0; i < titleLines.length; i++) {
    const lineY = titleStartY + (i + 1) * titleLineHeight - Math.round(titleFontSize * 0.22);
    titleTspans += `<tspan x="500" y="${Math.round(lineY)}">${escapeXml(titleLines[i])}</tspan>`;
  }
  const titleSvg = `<text text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="800" font-size="${titleFontSize}" fill="#0F172A">${titleTspans}</text>`;

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1000 ${totalSvgHeight}" width="1000" height="${totalSvgHeight}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
    </style>
  </defs>

  <!-- 1. Pure White Background -->
  <rect width="1000" height="${totalSvgHeight}" fill="#FFFFFF" />

  <!-- 2. Header: Meeting Title (centered at top) -->
  ${titleSvg}

  <!-- 3. QR Code (directly underneath title) -->
  <g id="qr-content-wrapper" transform="translate(${qrX}, ${qrY}) scale(${qrScale})">
    <rect width="${viewBoxSize}" height="${viewBoxSize}" fill="${config.bgColor || '#FFFFFF'}" />
    ${modulesSvg}
    ${logoSvgElement}
  </g>
</svg>`;
}

/**
 * Downloads a string or blob as a file in the browser
 */
export function triggerFileDownload(content: Blob | string, fileName: string, mimeType: string) {
  let url = '';
  if (typeof content === 'string') {
    const blob = new Blob([content], { type: mimeType });
    url = URL.createObjectURL(blob);
  } else {
    url = URL.createObjectURL(content);
  }

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1500);
}

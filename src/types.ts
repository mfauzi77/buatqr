export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type LogoPresetType = 'default' | 'none' | 'custom' | string;

export type DownloadFormat = 'png' | 'svg';

export type QRDotStyle = 'square' | 'rounded' | 'dots' | 'classy';

export interface QRConfig {
  meetingUrl: string;
  zoomUrl?: string; // alias for backwards compatibility
  meetingName: string;
  logoPreset: LogoPresetType;
  customLogoUrl: string | null;
  customLogoName?: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  qrSize: number; // 256 to 1024
  margin: number; // 1 to 6
  logoSizePercent: number; // 14% to 26%
  logoBorder?: boolean; // Whether to render a protective border ring around the logo
  logoBorderColor?: string; // Color of the border ring
  dotStyle?: QRDotStyle; // 'square' | 'rounded' | 'dots' | 'classy'
  fgColor: string; // default #000000
  bgColor: string; // default #ffffff
  exportResolution: 1024 | 2048 | 4096;
  includeTitleInExport?: boolean; // Whether download format includes white background, meeting title & QR code layout (default: true)
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
  duration?: number;
}

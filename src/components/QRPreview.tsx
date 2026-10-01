import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Printer,
  FileDown,
  Info,
  Globe
} from 'lucide-react';
import { QRConfig } from '../types';
import {
  generateQRCanvas,
  generateQRSVG,
  sanitizeFileName,
  triggerFileDownload,
  validateMeetingUrl
} from '../utils/qrGenerator';

interface QRPreviewProps {
  config: QRConfig;
  onReset: () => void;
  onToast: (text: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  onChange?: (updates: Partial<QRConfig>) => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ config, onReset, onToast, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [downloadingSvg, setDownloadingSvg] = useState(false);

  const rawUrl = config.meetingUrl || config.zoomUrl || '';
  const validation = validateMeetingUrl(rawUrl);
  const shouldIncludeTitle = config.includeTitleInExport !== false;

  // Render QR whenever config changes
  useEffect(() => {
    let isCancelled = false;

    async function render() {
      setIsGenerating(true);
      try {
        const canvas = await generateQRCanvas(config, 1024, false);
        if (!isCancelled) {
          setQrDataUrl(canvas.toDataURL('image/png'));
        }
      } catch (err) {
        console.error('Error generating preview:', err);
      } finally {
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    }

    render();

    return () => {
      isCancelled = true;
    };
  }, [
    config.meetingUrl,
    config.zoomUrl,
    config.meetingName,
    config.logoPreset,
    config.customLogoUrl,
    config.errorCorrectionLevel,
    config.margin,
    config.logoSizePercent,
    config.logoBorder,
    config.logoBorderColor,
    config.dotStyle,
    config.fgColor,
    config.bgColor,
  ]);

  // Download PNG Handler
  const handleDownloadPNG = async () => {
    if (!validation.isValid) {
      onToast('Masukkan tautan meeting / URL yang valid terlebih dahulu', 'warning');
      return;
    }

    setDownloadingPng(true);
    try {
      const targetRes = config.exportResolution || 2048;
      const exportCanvas = await generateQRCanvas(config, targetRes, shouldIncludeTitle);
      
      exportCanvas.toBlob((blob) => {
        if (blob) {
          const fileName = sanitizeFileName(config.meetingName || validation.platformLabel, 'png');
          triggerFileDownload(blob, fileName, 'image/png');
          onToast(
            shouldIncludeTitle
              ? `Kartu QR Code PNG (berisi judul rapat) berhasil diunduh (${fileName})`
              : `QR Code PNG berhasil diunduh (${fileName})`,
            'success'
          );
        } else {
          onToast('Gagal memproses gambar QR Code', 'error');
        }
        setDownloadingPng(false);
      }, 'image/png');
    } catch (err) {
      console.error(err);
      onToast('Terjadi kesalahan saat mengunduh PNG', 'error');
      setDownloadingPng(false);
    }
  };

  // Download SVG Handler
  const handleDownloadSVG = async () => {
    if (!validation.isValid) {
      onToast('Masukkan tautan meeting / URL yang valid terlebih dahulu', 'warning');
      return;
    }

    setDownloadingSvg(true);
    try {
      const svgString = await generateQRSVG(config, shouldIncludeTitle);
      const fileName = sanitizeFileName(config.meetingName || validation.platformLabel, 'svg');
      triggerFileDownload(svgString, fileName, 'image/svg+xml');
      onToast(
        shouldIncludeTitle
          ? `Kartu QR Code SVG vektor (berisi judul rapat) berhasil diunduh (${fileName})`
          : `QR Code SVG vektor berhasil diunduh (${fileName})`,
        'success'
      );
    } catch (err) {
      console.error(err);
      onToast('Terjadi kesalahan saat mengunduh SVG', 'error');
    } finally {
      setDownloadingSvg(false);
    }
  };

  // Copy Link Handler
  const handleCopyLink = () => {
    if (!validation.isValid) return;
    navigator.clipboard.writeText(validation.normalizedUrl);
    setCopiedLink(true);
    onToast('Tautan berhasil disalin ke clipboard', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!qrDataUrl) return;
    try {
      const canvas = await generateQRCanvas(config, 1024, shouldIncludeTitle);
      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && window.ClipboardItem) {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          setCopiedImage(true);
          onToast(
            shouldIncludeTitle
              ? 'Gambar kartu QR (dengan judul) disalin ke clipboard!'
              : 'Gambar QR Code disalin ke clipboard!',
            'success'
          );
          setTimeout(() => setCopiedImage(false), 2000);
        } else {
          onToast('Fitur salin gambar langsung tidak didukung di browser ini', 'info');
        }
      });
    } catch {
      onToast('Gagal menyalin gambar QR', 'error');
    }
  };

  // Print Card
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="preview-card" className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-2 sm:p-2.5 h-full flex flex-col justify-between overflow-hidden">
      {/* Header (Compact) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <QrCode className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Preview QR Code
          </h2>
        </div>

        {/* Reset Button */}
        <button
          type="button"
          id="btn-reset"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded transition-colors cursor-pointer"
          title="Kembalikan ke pengaturan awal"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div 
        ref={containerRef}
        id="qr-printable-area"
        className="relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs text-center flex-1 min-h-0 my-1 w-full overflow-hidden"
      >
        {/* Title Header (Lowered down right above the QR code) */}
        {shouldIncludeTitle && (
          <div className="w-full px-2 pb-1 shrink-0">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight break-words tracking-tight">
              {config.meetingName.trim() ? config.meetingName : 'Judul'}
            </h3>
          </div>
        )}

        {/* QR Code Canvas/Image Wrapper (Fills available space dynamically - grows big when closed) */}
        <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-0.5 overflow-hidden">
          {isGenerating && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex items-center justify-center rounded-lg z-10">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {qrDataUrl ? (
            <img
              id="qr-preview-image"
              src={qrDataUrl}
              alt="Preview QR Code"
              className="max-h-full max-w-full aspect-square w-auto h-auto object-contain transition-all"
            />
          ) : (
            <div className="w-full h-full max-h-full aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
              <QrCode className="w-14 h-14 animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Action & Download Section (Compact) */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100 shrink-0">
        {/* Export Format Selector (Compact Switcher) */}
        <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1 shrink-0">
            <FileDown className="w-3.5 h-3.5 text-blue-600" />
            Format:
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              id="opt-format-card"
              onClick={() => onChange?.({ includeTitleInExport: true })}
              className={`px-2.5 py-1 text-[11px] rounded transition-all cursor-pointer ${
                shouldIncludeTitle
                  ? 'bg-blue-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Judul + QR
            </button>
            <button
              type="button"
              id="opt-format-qronly"
              onClick={() => onChange?.({ includeTitleInExport: false })}
              className={`px-2.5 py-1 text-[11px] rounded transition-all cursor-pointer ${
                !shouldIncludeTitle
                  ? 'bg-blue-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Hanya QR
            </button>
          </div>
        </div>

        {/* Main Download Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {/* Download PNG Button */}
          <button
            type="button"
            id="btn-download-png"
            onClick={handleDownloadPNG}
            disabled={downloadingPng || !validation.isValid}
            className="w-full py-2 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 text-white font-semibold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingPng ? 'Memproses...' : 'Download PNG'}</span>
          </button>

          {/* Download SVG Button */}
          <button
            type="button"
            id="btn-download-svg"
            onClick={handleDownloadSVG}
            disabled={downloadingSvg || !validation.isValid}
            className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 text-blue-900 border border-blue-200 hover:border-blue-300 font-semibold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-600" />
            <span>{downloadingSvg ? 'Memproses...' : 'Download SVG'}</span>
          </button>
        </div>

        {/* Secondary Quick Utilities */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <button
            type="button"
            id="btn-copy-image"
            onClick={handleCopyImage}
            className="inline-flex items-center gap-1 hover:text-blue-700 font-medium py-0.5 px-1.5 rounded hover:bg-blue-50 transition-colors cursor-pointer"
          >
            {copiedImage ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>Salin Gambar</span>
          </button>

          <button
            type="button"
            id="btn-copy-link"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 hover:text-blue-700 font-medium py-0.5 px-1.5 rounded hover:bg-blue-50 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>Salin Tautan</span>
          </button>

          <button
            type="button"
            id="btn-print-card"
            onClick={handlePrint}
            className="inline-flex items-center gap-1 hover:text-blue-700 font-medium py-0.5 px-1.5 rounded hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3 h-3" />
            <span>Cetak</span>
          </button>
        </div>
      </div>
    </div>
  );
};

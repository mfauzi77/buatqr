import React from 'react';
import { Sparkles, Palette, ShieldAlert } from 'lucide-react';
import { QRConfig, ErrorCorrectionLevel, QRDotStyle } from '../types';

interface QRSettingsProps {
  config: QRConfig;
  onChange: (updates: Partial<QRConfig>) => void;
  onClose?: () => void;
  embedded?: boolean;
}

export const QRSettings: React.FC<QRSettingsProps> = ({ config, onChange, embedded = false }) => {
  const dotStyles: { id: QRDotStyle; label: string; desc: string; preview: React.ReactNode }[] = [
    {
      id: 'square',
      label: 'Kotak (Klasik)',
      desc: 'Tajam standar',
      preview: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <rect x="2" y="2" width="8" height="8" />
          <rect x="14" y="2" width="8" height="8" />
          <rect x="2" y="14" width="8" height="8" />
          <rect x="14" y="14" width="8" height="8" />
        </svg>
      ),
    },
    {
      id: 'rounded',
      label: 'Rounded (Halus)',
      desc: 'Sudut melengkung',
      preview: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <rect x="2" y="2" width="8" height="8" rx="2.5" />
          <rect x="14" y="2" width="8" height="8" rx="2.5" />
          <rect x="2" y="14" width="8" height="8" rx="2.5" />
          <rect x="14" y="14" width="8" height="8" rx="2.5" />
        </svg>
      ),
    },
    {
      id: 'dots',
      label: 'Dots (Bulat)',
      desc: 'Titik lingkaran',
      preview: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <circle cx="6" cy="6" r="4" />
          <circle cx="18" cy="6" r="4" />
          <circle cx="6" cy="18" r="4" />
          <circle cx="18" cy="18" r="4" />
        </svg>
      ),
    },
    {
      id: 'classy',
      label: 'Classy',
      desc: 'Kapsul elegan',
      preview: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
          <rect x="2" y="2" width="8" height="8" rx="3.5" />
          <rect x="14" y="2" width="8" height="8" rx="3.5" />
          <rect x="2" y="14" width="8" height="8" rx="3.5" />
          <rect x="14" y="14" width="8" height="8" rx="3.5" />
        </svg>
      ),
    },
    {
      id: 'diamond',
      label: 'Ketupat',
      desc: 'Diamond / Berlian',
      preview: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
          <polygon points="6,2 11,6 6,10 1,6" />
          <polygon points="18,2 23,6 18,10 13,6" />
          <polygon points="6,14 11,18 6,22 1,18" />
          <polygon points="18,14 23,18 18,22 13,18" />
        </svg>
      ),
    },
    {
      id: 'leaf',
      label: 'Daun',
      desc: 'Organik melengkung',
      preview: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
          <path d="M5,2 L10,2 L10,7 Q10,10 7,10 L2,10 L2,5 Q2,2 5,2 Z" />
          <path d="M17,2 L22,2 L22,7 Q22,10 19,10 L14,10 L14,5 Q14,2 17,2 Z" />
          <path d="M5,14 L10,14 L10,19 Q10,22 7,22 L2,22 L2,17 Q2,14 5,14 Z" />
          <path d="M17,14 L22,14 L22,19 Q22,22 19,22 L14,22 L14,17 Q14,14 17,14 Z" />
        </svg>
      ),
    },
    {
      id: 'star',
      label: 'Bintang',
      desc: 'Sparkle cross / Star',
      preview: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
          <path d="M6,2 L7.2,4.8 L10,6 L7.2,7.2 L6,10 L4.8,7.2 L2,6 L4.8,4.8 Z" />
          <path d="M18,2 L19.2,4.8 L22,6 L19.2,7.2 L18,10 L16.8,7.2 L14,6 L16.8,4.8 Z" />
          <path d="M6,14 L7.2,16.8 L10,18 L7.2,19.2 L6,22 L4.8,19.2 L2,18 L4.8,16.8 Z" />
          <path d="M18,14 L19.2,16.8 L22,18 L19.2,19.2 L18,22 L16.8,19.2 L14,18 L16.8,16.8 Z" />
        </svg>
      ),
    },
    {
      id: 'fluid',
      label: 'Cair',
      desc: 'Pebble halus',
      preview: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
          <rect x="2" y="2" width="8" height="8" rx="3.8" />
          <rect x="14" y="2" width="8" height="8" rx="3.8" />
          <rect x="2" y="14" width="8" height="8" rx="3.8" />
          <rect x="14" y="14" width="8" height="8" rx="3.8" />
        </svg>
      ),
    },
  ];

  const errorCorrectionOptions: { level: ErrorCorrectionLevel; label: string; desc: string; badge?: string }[] = [
    { level: 'H', label: 'Tinggi (30%)', desc: 'Rekomendasi untuk berlogo', badge: 'Rekomendasi' },
    { level: 'Q', label: 'Kuat (25%)', desc: 'Pemulihan data 25%' },
    { level: 'M', label: 'Sedang (15%)', desc: 'Standar 15%' },
  ];

  const colorPresets = [
    { name: 'Hitam Formal', fg: '#000000', label: 'Hitam' },
    { name: 'Navy Gelap', fg: '#0F172A', label: 'Navy' },
    { name: 'Royal Blue', fg: '#1E3A8A', label: 'Biru' },
    { name: 'Dark Slate', fg: '#334155', label: 'Slate' },
  ];

  return (
    <div
      id="style-panel-card"
      className={`h-full flex flex-col justify-start overflow-hidden ${
        embedded ? '' : 'bg-white rounded-xl border border-slate-200/90 shadow-2xs p-2.5 sm:p-3'
      }`}
    >
      {/* Header Panel (Shown only when not embedded) */}
      {!embedded && (
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2 shrink-0">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-2xs">
              <Sparkles className="w-3 h-3" />
            </div>
            Gaya Titik & Desain QR
          </h2>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Kustomisasi
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-2 flex-1 min-h-0 flex flex-col justify-start overflow-y-auto">
        {/* 1. Gaya Titik QR Code (Dot Style) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Gaya Titik (Dot Style)
            </label>
            <span className="text-[10px] text-slate-500">Bentuk modul</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {dotStyles.map((style) => {
              const isSelected = (config.dotStyle || 'square') === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  id={`btn-dot-style-${style.id}`}
                  onClick={() => onChange({ dotStyle: style.id })}
                  className={`h-8 px-1 rounded-lg border text-center transition-all relative flex items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/90 text-blue-900 ring-1 ring-blue-500 shadow-2xs font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                  title={`${style.label} - ${style.desc}`}
                >
                  <div className={`shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                    {style.preview}
                  </div>
                  <span className="text-[10px] font-semibold leading-tight truncate">{style.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Warna QR Code */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-blue-600" />
            Warna Titik QR
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {colorPresets.map((c) => (
              <button
                key={c.fg}
                type="button"
                onClick={() => onChange({ fgColor: c.fg })}
                className={`h-7 px-1.5 flex items-center justify-center gap-1 text-xs rounded-lg border transition-all cursor-pointer ${
                  config.fgColor === c.fg
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                  style={{ backgroundColor: c.fg }}
                />
                <span className="text-[11px] truncate">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Ketahanan Pindai (Error Correction) */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
            Ketahanan Pindai QR
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {errorCorrectionOptions.map((opt) => {
              const isSelected = config.errorCorrectionLevel === opt.level;
              return (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => onChange({ errorCorrectionLevel: opt.level })}
                  className={`h-7 px-1.5 rounded-lg border text-center text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                  }`}
                >
                  <span>{opt.level}</span>
                  <span className="text-[10px] opacity-75">
                    ({opt.level === 'H' ? '30%' : opt.level === 'Q' ? '25%' : '15%'})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Margin & Ukuran Logo Sliders (Inline controls with labels) */}
        <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-700 shrink-0">
              Margin: <strong className="font-mono text-blue-700">{config.margin}px</strong>
            </span>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={config.margin}
              onChange={(e) => onChange({ margin: Number(e.target.value) })}
              className="w-28 sm:w-36 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {config.logoPreset !== 'none' && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-700 shrink-0">
                Ukuran Logo: <strong className="font-mono text-blue-700">{config.logoSizePercent}%</strong>
              </span>
              <input
                type="range"
                min="14"
                max="26"
                step="1"
                value={config.logoSizePercent}
                onChange={(e) => onChange({ logoSizePercent: Number(e.target.value) })}
                className="w-28 sm:w-36 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Sparkles, Palette, ShieldAlert, Disc, X, Check } from 'lucide-react';
import { QRConfig, ErrorCorrectionLevel, QRDotStyle } from '../types';

interface QRSettingsProps {
  config: QRConfig;
  onChange: (updates: Partial<QRConfig>) => void;
  onClose?: () => void;
}

export const QRSettings: React.FC<QRSettingsProps> = ({ config, onChange, onClose }) => {
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
      label: 'Classy (Kapsul)',
      desc: 'Kapsul elegan',
      preview: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <rect x="2" y="2" width="8" height="8" rx="3.5" />
          <rect x="14" y="2" width="8" height="8" rx="3.5" />
          <rect x="2" y="14" width="8" height="8" rx="3.5" />
          <rect x="14" y="14" width="8" height="8" rx="3.5" />
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

  const borderPresets = [
    { name: 'Navy / Hitam', color: '#0F172A', label: 'Navy' },
    { name: 'Emas Mewah', color: '#D97706', label: 'Emas' },
    { name: 'Abu-Abu Lembut', color: '#CBD5E1', label: 'Abu' },
    { name: 'Biru Rapat', color: '#1E3A8A', label: 'Biru' },
  ];

  return (
    <div id="style-panel-card" className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 sm:p-3.5 h-full flex flex-col justify-between overflow-hidden">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 shrink-0">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-2xs">
            <Sparkles className="w-3 h-3" />
          </div>
          Gaya Titik & Desain QR
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded transition-colors cursor-pointer"
            title="Tutup panel pengaturan gaya titik"
          >
            <span>Tutup</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="space-y-2.5 flex-1 min-h-0 flex flex-col justify-between pt-2">
        {/* 1. Gaya Titik QR Code (Dot Style) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Gaya Titik (Dot Style)
            </label>
            <span className="text-[10px] text-slate-500">Pilih modul</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {dotStyles.map((style) => {
              const isSelected = (config.dotStyle || 'square') === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onChange({ dotStyle: style.id })}
                  className={`p-2 rounded-lg border text-left transition-all relative flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-1 ring-blue-500 shadow-2xs font-semibold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                    {style.preview}
                  </div>
                  <div className="truncate min-w-0">
                    <div className="text-xs font-bold leading-tight truncate">{style.label}</div>
                    <div className="text-[9px] text-slate-500 leading-tight truncate">{style.desc}</div>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-auto shrink-0" />
                  )}
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
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs rounded-lg border transition-all cursor-pointer ${
                  config.fgColor === c.fg
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                  style={{ backgroundColor: c.fg }}
                />
                <span className="text-[11px] truncate">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Garis Border & Pelindung Logo di QR */}
        {config.logoPreset !== 'none' && (
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <Disc className="w-3.5 h-3.5 text-blue-600" />
                Garis Border Logo di QR
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={config.logoBorder !== false}
                  onChange={(e) => onChange({ logoBorder: e.target.checked })}
                  className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-[11px]">Aktif</span>
              </label>
            </div>

            {config.logoBorder !== false && (
              <div className="grid grid-cols-4 gap-1 pt-0.5">
                {borderPresets.map((b) => {
                  const isSelected = (config.logoBorderColor || '#0F172A') === b.color;
                  return (
                    <button
                      key={b.color}
                      type="button"
                      onClick={() => onChange({ logoBorderColor: b.color })}
                      className={`flex items-center justify-center gap-1 py-1 px-1.5 text-xs rounded border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-white text-blue-900 font-semibold ring-1 ring-blue-500 shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-100/70 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                        style={{ backgroundColor: b.color }}
                      />
                      <span className="text-[10px] truncate">{b.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4. Ketahanan Pindai (Error Correction) & Margin */}
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
                  className={`p-1.5 rounded-lg border text-left text-xs transition-all relative cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs leading-tight">{opt.level}</div>
                  <div className="text-[9px] text-slate-500 leading-tight truncate">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Margin & Ukuran Logo Sliders */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-slate-700">Margin Putih</span>
              <span className="font-mono font-bold text-blue-700">{config.margin} px</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={config.margin}
              onChange={(e) => onChange({ margin: Number(e.target.value) })}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {config.logoPreset !== 'none' && (
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-700">Ukuran Logo</span>
                <span className="font-mono font-bold text-blue-700">{config.logoSizePercent}%</span>
              </div>
              <input
                type="range"
                min="14"
                max="26"
                step="1"
                value={config.logoSizePercent}
                onChange={(e) => onChange({ logoSizePercent: Number(e.target.value) })}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

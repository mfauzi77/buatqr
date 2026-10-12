import React, { useRef, useState } from 'react';
import {
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Palette,
  Disc,
  ShieldAlert,
  Upload,
  CheckCircle2,
  AlertCircle,
  Ban,
  Sliders,
  Check
} from 'lucide-react';
import { QRConfig, QRDotStyle, ErrorCorrectionLevel, LogoPresetType } from '../types';
import { LOGO_PRESETS, DEFAULT_LOGO_DATA_URL } from '../constants/logos';
import { validateMeetingUrl } from '../utils/qrGenerator';

interface ControlPanelProps {
  config: QRConfig;
  onChange: (updates: Partial<QRConfig>) => void;
  onToast: (text: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ config, onChange, onToast }) => {
  const [touchedUrl, setTouchedUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUrl = config.meetingUrl || config.zoomUrl || '';
  const validation = validateMeetingUrl(currentUrl);
  const showUrlError = touchedUrl && !validation.isValid && currentUrl.trim().length > 0;

  // Dot styles (Compact 4-column horizontal segmented pills)
  const dotStyles: { id: QRDotStyle; label: string; icon: React.ReactNode }[] = [
    {
      id: 'square',
      label: 'Kotak',
      icon: (
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
          <rect x="2" y="2" width="8" height="8" />
          <rect x="14" y="2" width="8" height="8" />
          <rect x="2" y="14" width="8" height="8" />
          <rect x="14" y="14" width="8" height="8" />
        </svg>
      ),
    },
    {
      id: 'rounded',
      label: 'Round',
      icon: (
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
          <rect x="2" y="2" width="8" height="8" rx="2.5" />
          <rect x="14" y="2" width="8" height="8" rx="2.5" />
          <rect x="2" y="14" width="8" height="8" rx="2.5" />
          <rect x="14" y="14" width="8" height="8" rx="2.5" />
        </svg>
      ),
    },
    {
      id: 'dots',
      label: 'Dots',
      icon: (
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
          <circle cx="6" cy="6" r="4" />
          <circle cx="18" cy="6" r="4" />
          <circle cx="6" cy="18" r="4" />
          <circle cx="18" cy="18" r="4" />
        </svg>
      ),
    },
    {
      id: 'classy',
      label: 'Kapsul',
      icon: (
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
          <rect x="2" y="2" width="8" height="8" rx="3.5" />
          <rect x="14" y="2" width="8" height="8" rx="3.5" />
          <rect x="2" y="14" width="8" height="8" rx="3.5" />
          <rect x="14" y="14" width="8" height="8" rx="3.5" />
        </svg>
      ),
    },
  ];

  // Color swatches (Compact horizontal single row)
  const colorPresets = [
    { name: 'Hitam', fg: '#000000' },
    { name: 'Navy', fg: '#0F172A' },
    { name: 'Biru', fg: '#1E3A8A' },
    { name: 'Slate', fg: '#334155' },
  ];

  // Logo border color presets
  const borderPresets = [
    { name: 'Navy', color: '#0F172A' },
    { name: 'Emas', color: '#D97706' },
    { name: 'Abu', color: '#CBD5E1' },
    { name: 'Biru', color: '#1E3A8A' },
  ];

  // Error correction levels
  const errorCorrectionOptions: { level: ErrorCorrectionLevel; label: string; desc: string }[] = [
    { level: 'H', label: 'Tinggi (30%)', desc: 'Rekomendasi' },
    { level: 'Q', label: 'Kuat (25%)', desc: 'Presisi' },
    { level: 'M', label: 'Sedang (15%)', desc: 'Standar' },
  ];

  // Handle Logo Upload
  const handleFileUpload = (file: File) => {
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg|svg\+xml|webp)$/)) {
      onToast('Format gambar harus PNG, JPG, JPEG, WEBP, atau SVG', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onToast('Ukuran file maksimal 5 MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange({
          logoPreset: 'custom',
          customLogoUrl: result,
          customLogoName: file.name,
        });
        onToast(`Logo "${file.name}" berhasil diunggah`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const selectPreset = (presetId: LogoPresetType) => {
    if (presetId === 'custom' && !config.customLogoUrl) {
      fileInputRef.current?.click();
    } else {
      onChange({ logoPreset: presetId });
    }
  };

  const currentPreset = config.logoPreset === 'none' ? 'none' : (config.logoPreset === 'custom' ? 'custom' : 'default');

  return (
    <div id="control-panel-card" className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 sm:p-3.5 h-full flex flex-col justify-between overflow-hidden">
      {/* Header Panel (Compact 28px height) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 shrink-0">
        <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <div className="w-4.5 h-4.5 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-2xs">
            <Sliders className="w-2.5 h-2.5" />
          </div>
          Pengaturan QR Code
        </h2>
        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
          Data & Desain
        </span>
      </div>

      {/* Internal 2-Column Grid (Saves vertical space, fits 1-screen perfectly) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-0 pt-2.5 items-stretch overflow-hidden">
        
        {/* SUB-KOLOM KIRI: Link, Judul, Pilihan Logo, Ketahanan */}
        <div className="flex flex-col justify-between space-y-2 h-full min-h-0 border-r-0 md:border-r md:border-slate-100 md:pr-3">
          
          {/* 1. Link / Tautan */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="meeting-url-input" className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-blue-600" />
                Link / Tautan <span className="text-red-500">*</span>
              </label>
              {validation.isValid && currentUrl.trim().length > 0 && (
                <span className="text-[9px] font-medium text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>{validation.platformLabel}</span>
                </span>
              )}
            </div>

            <input
              id="meeting-url-input"
              type="text"
              required
              value={currentUrl}
              onChange={(e) => {
                onChange({
                  meetingUrl: e.target.value,
                  zoomUrl: e.target.value,
                });
              }}
              onBlur={() => setTouchedUrl(true)}
              placeholder="https://google.com atau link tautan"
              className={`w-full px-2.5 py-1 text-xs font-['JetBrains_Mono',monospace] rounded-md border transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-hidden ${
                showUrlError
                  ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-100 text-red-900'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 text-slate-900'
              }`}
            />

            {showUrlError && (
              <p className="text-[10px] text-red-600 flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                {validation.errorMessage || 'URL tidak valid.'}
              </p>
            )}
          </div>

          {/* 2. Judul */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="meeting-name-input" className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <FileText className="w-3 h-3 text-blue-600" />
                Judul
              </label>
              <span className="text-[9px] text-blue-600 font-medium">Di atas QR</span>
            </div>
            <input
              id="meeting-name-input"
              type="text"
              value={config.meetingName}
              onChange={(e) => onChange({ meetingName: e.target.value })}
              placeholder="Contoh: Judul Kegiatan"
              className="w-full px-2.5 py-1 text-xs rounded-md border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-hidden text-slate-900"
            />
          </div>

          {/* 3. Pilihan Logo */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-blue-600" />
              Pilihan Logo QR
            </label>

            <div className="grid grid-cols-3 gap-1">
              {LOGO_PRESETS.map((preset) => {
                const isSelected = currentPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    id={`logo-preset-${preset.id}`}
                    onClick={() => selectPreset(preset.id)}
                    className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-md border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 ring-1 ring-blue-500 text-blue-900 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-4 h-4 rounded flex items-center justify-center shrink-0">
                      {preset.id === 'default' ? (
                        <img src={DEFAULT_LOGO_DATA_URL} alt="Logo PMK" className="w-full h-full object-contain" />
                      ) : preset.id === 'custom' ? (
                        config.customLogoUrl ? (
                          <img src={config.customLogoUrl} alt="Custom" className="w-full h-full object-contain" />
                        ) : (
                          <Upload className="w-3 h-3 text-blue-600" />
                        )
                      ) : (
                        <Ban className="w-3 h-3 text-slate-400" />
                      )}
                    </div>

                    <span className="text-[10px] font-semibold truncate leading-tight">
                      {preset.id === 'default' ? 'Logo PMK' : preset.id === 'none' ? 'Tanpa Logo' : 'Upload'}
                    </span>
                  </button>
                );
              })}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* 4. Ketahanan Pindai (Error Correction) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-blue-600" />
                Ketahanan Pindai
              </label>
              <span className="text-[9px] text-slate-400">Error recovery</span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {errorCorrectionOptions.map((opt) => {
                const isSelected = config.errorCorrectionLevel === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => onChange({ errorCorrectionLevel: opt.level })}
                    className={`py-1 px-1 text-[10px] rounded-md border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* SUB-KOLOM KANAN: Gaya Titik, Warna Titik, Border Logo, Sliders */}
        <div className="flex flex-col justify-between space-y-2 h-full min-h-0 md:pl-0.5">
          
          {/* 1. Gaya Titik QR (4 Segmen Horisontal) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Gaya Titik QR
              </label>
              <span className="text-[9px] text-slate-400">Bentuk modul</span>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {dotStyles.map((style) => {
                const isSelected = (config.dotStyle || 'square') === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    id={`dot-style-${style.id}`}
                    onClick={() => onChange({ dotStyle: style.id })}
                    className={`flex items-center justify-center gap-1 py-1 px-1 rounded-md border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-1 ring-blue-500 shadow-2xs font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                      {style.icon}
                    </div>
                    <span className="text-[10px] truncate leading-tight">{style.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Kontrol Warna (Warna Titik & Border Logo Vertikal dengan Tombol Kecil Horisontal) */}
          <div className="space-y-1.5 p-2 bg-slate-50/70 rounded-lg border border-slate-200/80">
            {/* Baris Warna Titik */}
            <div className="flex items-center justify-between gap-1.5">
              <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1 shrink-0">
                <Palette className="w-3 h-3 text-blue-600" />
                Warna Titik:
              </label>
              <div className="flex items-center gap-1">
                {colorPresets.map((c) => {
                  const isSelected = config.fgColor === c.fg;
                  return (
                    <button
                      key={c.fg}
                      type="button"
                      onClick={() => onChange({ fgColor: c.fg })}
                      title={c.name}
                      className={`flex items-center gap-1 py-0.5 px-1.5 text-[10px] rounded border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-white text-blue-900 font-bold ring-1 ring-blue-500 shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full border border-slate-300 shrink-0"
                        style={{ backgroundColor: c.fg }}
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Baris Border Logo (jika logo aktif) */}
            {config.logoPreset !== 'none' ? (
              <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-200/60">
                <label className="flex items-center gap-1 cursor-pointer text-[11px] font-bold text-slate-800 shrink-0">
                  <Disc className="w-3 h-3 text-blue-600" />
                  <input
                    type="checkbox"
                    checked={config.logoBorder !== false}
                    onChange={(e) => onChange({ logoBorder: e.target.checked })}
                    className="w-3 h-3 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Border Logo:</span>
                </label>

                {config.logoBorder !== false ? (
                  <div className="flex items-center gap-1">
                    {borderPresets.map((b) => {
                      const isSelected = (config.logoBorderColor || '#0F172A') === b.color;
                      return (
                        <button
                          key={b.color}
                          type="button"
                          onClick={() => onChange({ logoBorderColor: b.color })}
                          title={b.name}
                          className={`flex items-center gap-0.5 py-0.5 px-1 text-[9px] rounded border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-white text-blue-900 font-bold ring-1 ring-blue-500'
                              : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: b.color }}
                          />
                          <span>{b.name}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-[9px] text-slate-400 italic">Nonaktif</span>
                )}
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 italic pt-0.5">
                Pilih logo untuk opsi border
              </div>
            )}
          </div>

          {/* 3. Slider Margin & Ukuran Logo */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-50/40 rounded-lg border border-slate-200/60">
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold text-slate-700">Margin QR</span>
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

            {config.logoPreset !== 'none' ? (
              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-700">Ukuran Logo</span>
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
            ) : (
              <div className="flex items-center text-[10px] text-slate-400 italic pt-1">
                Tanpa logo tengah
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

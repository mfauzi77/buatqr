import React, { useRef } from 'react';
import { Upload, Check, Image as ImageIcon, Trash2, Sparkles, Ban } from 'lucide-react';
import { QRConfig, LogoPresetType } from '../types';
import { LOGO_PRESETS, DEFAULT_LOGO_DATA_URL } from '../constants/logos';

interface LogoUploaderProps {
  config: QRConfig;
  onChange: (updates: Partial<QRConfig>) => void;
  onToast: (text: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ config, onChange, onToast }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        onToast(`Logo "${file.name}" berhasil diunggah (tanpa background)`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
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
    <div id="logo-uploader-section" className="space-y-1.5 pt-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
          Pilihan Logo QR
        </label>
        <span className="text-[10px] text-slate-500 font-medium">
          Garis border aktif & rapi
        </span>
      </div>

      {/* Preset Selection Grid - Compact 1-Row 3-Cols */}
      <div className="grid grid-cols-3 gap-1.5">
        {LOGO_PRESETS.map((preset) => {
          const isSelected = currentPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              id={`logo-preset-${preset.id}`}
              onClick={() => selectPreset(preset.id)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 ring-1 ring-blue-500 text-blue-900 shadow-2xs font-bold'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              {/* Preset Icon */}
              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0">
                {preset.id === 'default' ? (
                  <img src={DEFAULT_LOGO_DATA_URL} alt="Logo PMK" className="w-full h-full object-contain" />
                ) : preset.id === 'custom' ? (
                  config.customLogoUrl ? (
                    <img src={config.customLogoUrl} alt="Custom" className="w-full h-full object-contain" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                  )
                ) : (
                  <Ban className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              <span className="text-[11px] font-semibold truncate leading-tight">
                {preset.id === 'default' ? 'Logo PMK' : preset.id === 'none' ? 'Tanpa Logo' : 'Upload'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Upload Dropzone */}
      {currentPreset === 'custom' && (
        <div
          id="custom-logo-dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-blue-300 hover:border-blue-500 rounded-lg p-2 bg-blue-50/30 hover:bg-blue-50/60 transition-all cursor-pointer text-center"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />

          {config.customLogoUrl ? (
            <div className="flex items-center justify-between gap-2 text-left">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0">
                  <img
                    src={config.customLogoUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="truncate min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {config.customLogoName || 'Logo Kustom'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  id="btn-replace-logo"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-2 py-0.5 text-[11px] font-medium text-blue-700 hover:bg-blue-100 rounded transition-colors"
                >
                  Ganti
                </button>
                <button
                  type="button"
                  id="btn-remove-logo"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange({
                      logoPreset: 'default',
                      customLogoUrl: null,
                      customLogoName: undefined,
                    });
                    onToast('Kembali ke Logo Kemenko PMK', 'info');
                  }}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                  title="Hapus logo kustom"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 py-0.5">
              <Upload className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>
                <strong className="text-blue-700">Pilih logo</strong> (PNG/JPG/SVG)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

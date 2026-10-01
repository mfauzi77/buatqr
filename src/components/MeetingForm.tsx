import React, { useState } from 'react';
import {
  Link as LinkIcon,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Sliders,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { QRConfig } from '../types';
import { validateMeetingUrl } from '../utils/qrGenerator';
import { LogoUploader } from './LogoUploader';

interface MeetingFormProps {
  config: QRConfig;
  onChange: (updates: Partial<QRConfig>) => void;
  onToast: (text: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  isStyleOpen?: boolean;
  onToggleStyle?: () => void;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({
  config,
  onChange,
  onToast,
  isStyleOpen,
  onToggleStyle,
}) => {
  const [touchedUrl, setTouchedUrl] = useState(false);

  const currentUrl = config.meetingUrl || config.zoomUrl || '';
  const validation = validateMeetingUrl(currentUrl);
  const showUrlError = touchedUrl && !validation.isValid && currentUrl.trim().length > 0;



  return (
    <div id="form-card" className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 sm:p-3.5 h-full flex flex-col justify-between overflow-hidden">
      {/* Card Header (Compact) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 shrink-0">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          Input Link & Judul
        </h2>
        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Formulir Utama
        </span>
      </div>

      <div className="space-y-2 flex-1 min-h-0 flex flex-col justify-between pt-2">
        {/* Field 1: Link / Tautan */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="meeting-url-input" className="text-xs font-semibold text-slate-800 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
              Link / Tautan <span className="text-red-500">*</span>
            </label>
            {validation.isValid && currentUrl.trim().length > 0 && (
              <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>{validation.platformLabel}</span>
              </span>
            )}
          </div>

          <div className="relative">
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
              placeholder="https://google.com atau link tautan apa saja"
              className={`w-full px-3 py-1.5 text-xs sm:text-sm font-['JetBrains_Mono',monospace] rounded-lg border transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-hidden ${
                showUrlError
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-red-900'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900'
              }`}
            />
          </div>

          {showUrlError && (
            <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {validation.errorMessage || 'URL tidak valid.'}
            </p>
          )}


        </div>

        {/* Field 2: Judul */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="meeting-name-input" className="text-xs font-semibold text-slate-800 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Judul
            </label>
            <span className="text-[10px] text-blue-600 font-medium">Dicetak di atas QR</span>
          </div>
          <input
            id="meeting-name-input"
            type="text"
            value={config.meetingName}
            onChange={(e) => onChange({ meetingName: e.target.value })}
            placeholder="Contoh: Judul Rapat / Kegiatan"
            className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-hidden text-slate-900"
          />
        </div>

        {/* Logo Uploader Section (Compact) */}
        <LogoUploader
          config={config}
          onChange={onChange}
          onToast={onToast}
        />

        {/* Tombol Fitur Pengaturan Gaya Titik (Buka / Tutup) */}
        {onToggleStyle && (
          <div className="pt-1">
            <button
              type="button"
              id="btn-toggle-style-panel"
              onClick={onToggleStyle}
              className={`w-full flex items-center justify-between p-2 sm:p-2.5 rounded-xl border-2 transition-all cursor-pointer group ${
                isStyleOpen
                  ? 'border-blue-500 bg-blue-50/80 text-blue-950 shadow-2xs'
                  : 'border-blue-200 hover:border-blue-400 bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    Fitur Pengaturan Gaya Titik & Warna
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                    {isStyleOpen
                      ? 'Panel terbuka di samping (1 Screen)'
                      : 'Buka pilihan titik kotak, rounded, bulat, kapsul'}
                  </span>
                </div>
              </div>

              <div className="shrink-0 ml-2">
                {isStyleOpen ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white shadow-2xs transition-all border border-slate-700">
                    <span>Tutup</span>
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-300" />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all border border-blue-500">
                    <span>Buka</span>
                    <ChevronRight className="w-3.5 h-3.5 text-blue-100" />
                  </span>
                )}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

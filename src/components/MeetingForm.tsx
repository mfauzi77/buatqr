import React, { useState } from 'react';
import {
  Link as LinkIcon,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { QRConfig } from '../types';
import { validateMeetingUrl } from '../utils/qrGenerator';
import { LogoUploader } from './LogoUploader';

interface MeetingFormProps {
  config: QRConfig;
  onChange: (updates: Partial<QRConfig>) => void;
  onToast: (text: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  embedded?: boolean;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({
  config,
  onChange,
  onToast,
  embedded = false,
}) => {
  const [touchedUrl, setTouchedUrl] = useState(false);

  const currentUrl = config.meetingUrl || config.zoomUrl || '';
  const validation = validateMeetingUrl(currentUrl);
  const showUrlError = touchedUrl && !validation.isValid && currentUrl.trim().length > 0;

  return (
    <div
      id="form-card"
      className={`h-full flex flex-col justify-start overflow-hidden ${
        embedded ? '' : 'bg-white rounded-xl border border-slate-200/90 shadow-2xs p-2.5 sm:p-3'
      }`}
    >
      {/* Card Header (Shown only when not embedded) */}
      {!embedded && (
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2 shrink-0">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Input Link & Judul
          </h2>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Formulir Utama
          </span>
        </div>
      )}

      <div className="space-y-2 flex-1 min-h-0 flex flex-col justify-start overflow-y-auto">
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
              className={`w-full h-8 px-2.5 py-1 text-xs font-['JetBrains_Mono',monospace] rounded-lg border transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-hidden ${
                showUrlError
                  ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-100 text-red-900'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 text-slate-900'
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
            className="w-full h-8 px-2.5 py-1 text-xs rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-hidden text-slate-900"
          />
        </div>

        {/* Logo Uploader Section (Compact) */}
        <LogoUploader
          config={config}
          onChange={onChange}
          onToast={onToast}
        />
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { MeetingForm } from './components/MeetingForm';
import { QRSettings } from './components/QRSettings';
import { QRPreview } from './components/QRPreview';
import { Footer } from './components/Footer';
import { ToastNotification } from './components/ToastNotification';
import { QRConfig, ToastMessage } from './types';

const INITIAL_CONFIG: QRConfig = {
  meetingUrl: 'https://google.com',
  zoomUrl: 'https://google.com',
  meetingName: 'Judul',
  logoPreset: 'default',
  customLogoUrl: null,
  customLogoName: undefined,
  errorCorrectionLevel: 'H',
  qrSize: 1024,
  margin: 2,
  logoSizePercent: 20,
  logoBorder: false,
  logoBorderColor: '#0F172A',
  dotStyle: 'square',
  fgColor: '#000000',
  bgColor: '#ffffff',
  exportResolution: 2048,
  includeTitleInExport: true,
};

export default function App() {
  const [config, setConfig] = useState<QRConfig>(() => {
    try {
      const saved = localStorage.getItem('app_qr_generator_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Custom uploaded logo is strictly temporary; on reload it resets to default Logo PMK
        delete parsed.customLogoUrl;
        delete parsed.customLogoName;
        // Default logoBorder to false
        parsed.logoBorder = false;
        if (parsed.logoPreset === 'custom' || !parsed.logoPreset || (parsed.logoPreset !== 'none' && parsed.logoPreset !== 'default')) {
          parsed.logoPreset = 'default';
        }
        if (parsed.meetingUrl === 'https://meet.google.com/abc-defg-hij') {
          parsed.meetingUrl = 'https://google.com';
          parsed.zoomUrl = 'https://google.com';
        }
        if (parsed.meetingName === 'Rapat Koordinasi Nasional') {
          parsed.meetingName = 'Judul';
        }
        return {
          ...INITIAL_CONFIG,
          ...parsed,
          logoBorder: false,
          customLogoUrl: null,
          customLogoName: undefined,
        };
      }
    } catch {
      // ignore
    }
    return INITIAL_CONFIG;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [leftTab, setLeftTab] = useState<'content' | 'style' | 'all'>('content');

  // Persist settings locally (Omit temporary custom logo so it is never saved to localStorage)
  useEffect(() => {
    try {
      const toSave = { ...config };
      // Uploaded logo is temporary in memory only; reset preset to default in storage
      delete toSave.customLogoUrl;
      delete toSave.customLogoName;
      if (toSave.logoPreset === 'custom') {
        toSave.logoPreset = 'default';
      }
      localStorage.setItem('app_qr_generator_config', JSON.stringify(toSave));
    } catch {
      // ignore
    }
  }, [config]);

  // Toast Helper
  const addToast = (text: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, text, type, duration: 4000 };
    
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Updates partial config
  const updateConfig = (updates: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  // Reset handler
  const handleReset = () => {
    setConfig(INITIAL_CONFIG);
    addToast('Pengaturan berhasil direset ke awal', 'info');
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif] text-slate-900">
      {/* 1. HEADER (Compact) */}
      <Header />

      {/* 2. MAIN DASHBOARD STUDIO (2-Layer Responsive Grid: Layer 1 Settings & Layer 2 Large Preview) */}
      <main
        id="main-content"
        className="flex-1 min-h-0 max-w-7xl w-full mx-auto p-2.5 sm:p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch overflow-hidden"
      >
        {/* LAYER 1: PENGATURAN & KONTROL (Link, Judul, Logo, Desain) */}
        <div className="lg:col-span-6 xl:col-span-5 h-full min-h-0 flex flex-col overflow-hidden">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-2.5 sm:p-3 h-full flex flex-col overflow-hidden">
            {/* Layer 1 Header & Tabs */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 shrink-0 gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 sm:p-1 rounded-lg border border-slate-200 overflow-x-auto">
                <button
                  type="button"
                  id="tab-link-logo"
                  onClick={() => setLeftTab('content')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    leftTab === 'content'
                      ? 'bg-white text-blue-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Link & Judul</span>
                </button>
                <button
                  type="button"
                  id="tab-style-color"
                  onClick={() => setLeftTab('style')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    leftTab === 'style'
                      ? 'bg-white text-blue-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>2. Gaya & Warna</span>
                </button>
                <button
                  type="button"
                  id="tab-all-settings"
                  onClick={() => setLeftTab('all')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    leftTab === 'all'
                      ? 'bg-white text-blue-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Tampilkan semua pengaturan"
                >
                  <span>Semua</span>
                </button>
              </div>

              <span className="hidden sm:inline-flex text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                Layer 1
              </span>
            </div>

            {/* Layer 1 Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-between">
              {leftTab === 'content' && (
                <>
                  <MeetingForm
                    config={config}
                    onChange={updateConfig}
                    onToast={addToast}
                    embedded
                  />
                  <div className="pt-2 mt-auto shrink-0 border-t border-slate-100">
                    <button
                      type="button"
                      id="btn-goto-style"
                      onClick={() => setLeftTab('style')}
                      className="w-full h-8 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-semibold transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pengaturan Gaya Titik & Warna QR</span>
                      </span>
                      <span className="text-[11px] font-bold text-blue-700">Lanjut ke Desain →</span>
                    </button>
                  </div>
                </>
              )}

              {leftTab === 'style' && (
                <>
                  <QRSettings
                    config={config}
                    onChange={updateConfig}
                    embedded
                  />
                  <div className="pt-2 mt-auto shrink-0 border-t border-slate-100">
                    <button
                      type="button"
                      id="btn-backto-content"
                      onClick={() => setLeftTab('content')}
                      className="w-full h-8 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-[11px] font-bold">← Kembali</span>
                      <span>Edit Link & Judul Rapat</span>
                    </button>
                  </div>
                </>
              )}

              {leftTab === 'all' && (
                <div className="space-y-4">
                  <MeetingForm
                    config={config}
                    onChange={updateConfig}
                    onToast={addToast}
                    embedded
                  />
                  <div className="border-t border-slate-200 pt-3">
                    <QRSettings
                      config={config}
                      onChange={updateConfig}
                      embedded
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LAYER 2: PREVIEW QR BESAR & DOWNLOAD ACTIONS */}
        <div className="lg:col-span-6 xl:col-span-7 h-full min-h-0 flex flex-col overflow-hidden">
          <QRPreview
            config={config}
            onReset={handleReset}
            onToast={addToast}
            onChange={updateConfig}
          />
        </div>
      </main>

      {/* 3. FOOTER (Compact) */}
      <Footer />

      {/* 4. TOAST NOTIFICATIONS */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

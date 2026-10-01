import React, { useState, useEffect } from 'react';
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
  margin: 3,
  logoSizePercent: 20,
  logoBorder: true,
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
        if (parsed.logoPreset && parsed.logoPreset !== 'none' && parsed.logoPreset !== 'custom') {
          parsed.logoPreset = 'default';
        }
        if (parsed.meetingUrl === 'https://meet.google.com/abc-defg-hij') {
          parsed.meetingUrl = 'https://google.com';
          parsed.zoomUrl = 'https://google.com';
        }
        if (parsed.meetingName === 'Rapat Koordinasi Nasional') {
          parsed.meetingName = 'Judul';
        }
        return { ...INITIAL_CONFIG, ...parsed };
      }
    } catch {
      // ignore
    }
    return INITIAL_CONFIG;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  // Open style panel by default in studio mode
  const [isStyleOpen, setIsStyleOpen] = useState(true);

  // Persist settings locally
  useEffect(() => {
    try {
      localStorage.setItem('app_qr_generator_config', JSON.stringify(config));
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

      {/* 2. MAIN DASHBOARD STUDIO (1-Screen Non-Scrolling Responsive Grid) */}
      <main
        id="main-content"
        className="flex-1 min-h-0 max-w-7xl w-full mx-auto px-3 sm:px-5 py-2 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch overflow-hidden"
      >
        {isStyleOpen ? (
          <>
            {/* PANEL 1: DATA RAPAT & LOGO KEMENKO PMK */}
            <div className="lg:col-span-4 h-full min-h-0 flex flex-col">
              <MeetingForm
                config={config}
                onChange={updateConfig}
                onToast={addToast}
                isStyleOpen={isStyleOpen}
                onToggleStyle={() => setIsStyleOpen(false)}
              />
            </div>

            {/* PANEL 2: FITUR PENGATURAN GAYA TITIK & WARNA */}
            <div className="lg:col-span-4 h-full min-h-0 flex flex-col">
              <QRSettings
                config={config}
                onChange={updateConfig}
                onClose={() => setIsStyleOpen(false)}
              />
            </div>

            {/* PANEL 3: PREVIEW KARTU & DOWNLOAD */}
            <div className="lg:col-span-4 h-full min-h-0 flex flex-col">
              <QRPreview
                config={config}
                onReset={handleReset}
                onToast={addToast}
                onChange={updateConfig}
              />
            </div>
          </>
        ) : (
          <>
            {/* 2-COLUMN VIEW WHEN STYLE PANEL IS COLLAPSED */}
            {/* PANEL 1: DATA RAPAT & LOGO */}
            <div className="lg:col-span-6 h-full min-h-0 flex flex-col">
              <MeetingForm
                config={config}
                onChange={updateConfig}
                onToast={addToast}
                isStyleOpen={isStyleOpen}
                onToggleStyle={() => setIsStyleOpen(true)}
              />
            </div>

            {/* PANEL 3: PREVIEW KARTU & DOWNLOAD */}
            <div className="lg:col-span-6 h-full min-h-0 flex flex-col">
              <QRPreview
                config={config}
                onReset={handleReset}
                onToast={addToast}
                onChange={updateConfig}
              />
            </div>
          </>
        )}
      </main>

      {/* 3. FOOTER (Compact) */}
      <Footer />

      {/* 4. TOAST NOTIFICATIONS */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

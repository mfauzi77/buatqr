import { DEFAULT_LOGO_DATA_URL } from './defaultLogoData';

export { DEFAULT_LOGO_DATA_URL };

export const LOGO_PRESETS = [
  {
    id: 'default' as const,
    name: 'Logo Kemenko PMK',
    subtitle: 'Lambang Resmi PMK',
    badge: 'Kemenko PMK',
    dataUrl: DEFAULT_LOGO_DATA_URL,
  },
  {
    id: 'none' as const,
    name: 'Tanpa Logo',
    subtitle: 'QR Polos Murni',
    badge: 'Polos',
    dataUrl: '',
  },
  {
    id: 'custom' as const,
    name: 'Upload Kustom',
    subtitle: 'PNG / SVG Sendiri',
    badge: 'Kustom',
    dataUrl: '',
  },
];

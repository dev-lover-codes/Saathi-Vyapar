'use client';

/**
 * src/components/LanguageToggleButton.tsx
 *
 * Floating EN/HI language toggle pill button.
 * Uses useLanguage() from LanguageContext.
 */

import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  className?: string;
}

export default function LanguageToggleButton({ className = '' }: Props) {
  const { t, toggleLanguage, language } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
      className={`cursor-pointer px-3 py-1.5 rounded-full border border-[#C9A24B]/60 bg-[#0B1E33]/5 hover:bg-[#C9A24B]/10 text-[#0B1E33] font-bold text-xs transition-all flex items-center gap-1.5 ${className}`}
    >
      <span className="text-[#C9A24B]">🌐</span>
      <span>{t('nav_language_toggle')}</span>
    </button>
  );
}

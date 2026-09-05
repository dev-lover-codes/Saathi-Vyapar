'use client';

import { useState, useEffect } from 'react';

interface ValueProp {
  headline: string;
  detail: string;
}

const VALUE_PROPS: ValueProp[] = [
  {
    headline: 'Works on WhatsApp.',
    detail: 'Zero app installation required. Micro-merchants get financial advisory through familiar messaging.',
  },
  {
    headline: 'No smartphone required.',
    detail: 'Full two-way conversational onboarding also operates seamlessly over basic phone SMS.',
  },
  {
    headline: 'Understands your notebook.',
    detail: 'Snap a photo of your paper bahi-khata; computer vision extracts daily income and expense rows.',
  },
  {
    headline: '15+ Government Schemes.',
    detail: 'Deterministic eligibility matching with PMEGP, Mudra, PM SVANidhi, and Stand-Up India.',
  },
];

export default function RotatingValueProps() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % VALUE_PROPS.length);
        setIsVisible(true);
      }, 400); // fade out duration
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const current = VALUE_PROPS[index];

  return (
    <div className="min-h-[110px] flex flex-col justify-center">
      <div
        className={`transition-all duration-500 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9A24B] animate-pulse shrink-0" />
          <span>{current.headline}</span>
        </div>
        <p className="text-sm text-slate-300/90 mt-2 leading-relaxed max-w-md font-normal">
          {current.detail}
        </p>
      </div>

      {/* Slide dots */}
      <div className="flex items-center gap-2 mt-5">
        {VALUE_PROPS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setIndex(i);
                setIsVisible(true);
              }, 250);
            }}
            aria-label={`Go to value prop ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === i ? 'w-7 bg-[#C9A24B]' : 'w-2 bg-slate-600 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

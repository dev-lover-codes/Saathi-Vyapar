import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';

export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

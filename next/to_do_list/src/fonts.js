import {
  Inter,
  Space_Mono,
  Funnel_Sans,
  Delius_Swash_Caps,
  Atma,
  Jolly_Lodger,
  Mukta_Malar,
} from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
export const space = Space_Mono({ weight: ['400', '700'], subsets: ['latin'] });
export const funnel = Funnel_Sans({
  subsets: ['latin'],
  display: 'swap',
});
export const delius = Delius_Swash_Caps({
  weight: ['400'],
  subsets: ['latin'],
});
export const atma = Atma({
  weight: ['600', '700'],
  subsets: ['latin'],
});
export const jolly = Jolly_Lodger({
  weight: ['400'],
  subsets: ['latin'],
});
export const mukta = Mukta_Malar({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

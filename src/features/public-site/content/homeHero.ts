import type { HeroCta, HeroTitleLine } from '@/features/public-site/components/HeroSection';

export const HOME_HERO_EYEBROW = 'FULL STACK · AI · PRODUCT';

export const HOME_HERO_TAGLINE =
  'Clean systems, sharp interfaces, and collaborations that ship—here is a curated snapshot of my work.';

export const HOME_HERO_PRIMARY_CTA: HeroCta = {
  label: 'View Projects',
  to: '/projects',
};

export const HOME_HERO_SECONDARY_CTA: HeroCta = {
  label: 'Contact Me',
  to: '/contact',
};

export function getHomeHeroLines(siteName: string): HeroTitleLine[] {
  return [
    {
      parts: [
        { text: "Hi, I'm " },
        { text: siteName, gradient: true },
        { text: '.' },
      ],
    },
    {
      parts: [
        { text: 'I build ' },
        { text: 'thoughtful', gradient: true },
        { text: ' software for the ' },
        { text: 'modern web', gradient: true },
        { text: '.' },
      ],
    },
  ];
}

import type { ReactNode } from 'react';

import { PublicPageAtmosphere } from '@/features/public-site/components/PublicPageAtmosphere';

type PublicMarketingPageFrameProps = {
  children: ReactNode;
};

/**
 * Shared shell for public marketing routes: atmospheric background + centered content column.
 */
export function PublicMarketingPageFrame({ children }: PublicMarketingPageFrameProps) {
  return (
    <div className="relative isolate -mt-10 sm:-mt-14 md:-mt-16">
      <PublicPageAtmosphere />
      <div className="relative z-[1] mx-auto w-full max-w-public px-6 sm:px-10 lg:px-12">
        {children}
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';

import {
  trackProjectVisit,
  trackProjectVisitKeepalive,
} from '@/features/analytics/api/analytics.api';

type LastVisit = { projectId: string; instanceId: number };

/**
 * One POST /analytics/track/:projectId per real visit with
 * { incrementView: true, dwellMs } so totalViews and avgTimeSpent both update.
 *
 * Deferred flush + last-visit ref skips the bogus send after React StrictMode's
 * fake unmount. pagehide + keepalive covers tab close/refresh; shared sent flag
 * dedupes cleanup vs pagehide.
 */
export function useTrackProjectVisitWithDwell(projectId: string | undefined): void {
  const instanceCounterRef = useRef(0);
  const lastVisitRef = useRef<LastVisit>({ projectId: '', instanceId: 0 });

  useEffect(() => {
    if (!projectId) return;

    const myProjectId = projectId;
    instanceCounterRef.current += 1;
    const myInstanceId = instanceCounterRef.current;
    lastVisitRef.current = { projectId: myProjectId, instanceId: myInstanceId };

    const startMs = performance.now();
    const sentRef = { sent: false };

    const send = (useKeepalive: boolean) => {
      if (sentRef.sent) return;
      sentRef.sent = true;

      const dwellMs = Math.max(1, Math.floor(performance.now() - startMs));
      const body = { incrementView: true as const, dwellMs };

      if (useKeepalive) {
        trackProjectVisitKeepalive(myProjectId, body);
        return;
      }

      trackProjectVisit(myProjectId, body).catch((err) => {
        if (import.meta.env.DEV) {
          console.debug('[analytics] track failed', err);
        }
      });
    };

    const onPageHide = (ev: PageTransitionEvent) => {
      if (ev.persisted) return;
      send(true);
    };

    window.addEventListener('pagehide', onPageHide);

    return () => {
      window.removeEventListener('pagehide', onPageHide);

      window.setTimeout(() => {
        const cur = lastVisitRef.current;
        const superseded =
          cur.projectId === myProjectId && cur.instanceId !== myInstanceId;
        if (superseded) return;
        send(false);
      }, 0);
    };
  }, [projectId]);
}

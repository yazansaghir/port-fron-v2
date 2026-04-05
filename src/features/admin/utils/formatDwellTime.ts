/** Format an avgTimeSpent value (milliseconds) into a human-readable string. */
export function formatDwellTime(ms: number | null | undefined): string {
  if (ms == null) return '—';
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

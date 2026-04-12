import { useEffect, useRef } from 'react';

type Props = {
  projectTitle: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ProjectDeleteConfirm({ projectTitle, isPending, onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-overlay-scrim"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm rounded-xl border border-foreground/10 bg-background p-6 shadow-lg">
        <h2 id="delete-confirm-title" className="text-base font-semibold text-foreground">
          Delete project
        </h2>
        <p className="mt-2 text-sm text-foreground/70">
          Are you sure you want to delete{' '}
          <span className="font-medium text-foreground">"{projectTitle}"</span>? This action cannot
          be undone.
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-md border border-foreground/15 px-3 py-1.5 text-sm font-medium text-foreground/80 transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-md bg-status-danger px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

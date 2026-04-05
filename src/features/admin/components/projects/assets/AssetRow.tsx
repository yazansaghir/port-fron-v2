import { useState } from 'react';

import { useDeleteAsset } from '@/features/assets/hooks/useDeleteAsset';
import { usePatchAssetAlt } from '@/features/assets/hooks/usePatchAssetAlt';
import { usePatchAssetOrder } from '@/features/assets/hooks/usePatchAssetOrder';
import {
  fieldErrorClass,
  inputClass,
  labelClass,
} from '@/features/admin/components/projects/projectFormClasses';
import type { ProjectAssetPublic } from '@/features/projects/api/projects.types';
import { getDisplayMessage } from '@/shared/api/mapApiError';

import { AssetDeleteConfirm } from './AssetDeleteConfirm';

type Props = {
  asset: ProjectAssetPublic;
  projectId: string;
};

export function AssetRow({ asset, projectId }: Props) {
  const [altText, setAltText] = useState(asset.altText ?? '');
  const [orderValue, setOrderValue] = useState(String(asset.displayOrder));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const patchAlt = usePatchAssetAlt();
  const patchOrder = usePatchAssetOrder();
  const deleteMutation = useDeleteAsset();

  const isBusy = patchAlt.isPending || patchOrder.isPending || deleteMutation.isPending;

  function handleAltSave() {
    patchAlt.mutate({
      assetId: asset.id,
      projectId,
      altText: altText.trim() === '' ? null : altText.trim(),
    });
  }

  function handleOrderApply() {
    const parsed = parseInt(orderValue, 10);
    if (isNaN(parsed) || parsed < 0) return;
    patchOrder.mutate({ assetId: asset.id, projectId, displayOrder: parsed });
  }

  function handleDeleteConfirm() {
    deleteMutation.mutate(
      { assetId: asset.id, projectId },
      { onSuccess: () => setShowDeleteConfirm(false) },
    );
  }

  return (
    <>
      {showDeleteConfirm && (
        <AssetDeleteConfirm
          isPending={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      <div className="rounded-lg border border-foreground/10 bg-background p-4">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            {asset.assetType === 'image' ? (
              <img
                src={asset.assetUrl}
                alt={asset.altText ?? ''}
                className="h-20 w-28 rounded-md border border-foreground/10 object-cover"
              />
            ) : (
              <div className="flex h-20 w-28 flex-col items-center justify-center gap-1 rounded-md border border-foreground/10 bg-foreground/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-foreground/40"
                  aria-hidden="true"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <a
                  href={asset.assetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View video
                </a>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-1 flex-col gap-3">
            {/* Alt text */}
            <div>
              <label className={labelClass}>
                Alt text
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the asset…"
                  disabled={isBusy}
                  className={inputClass}
                  maxLength={200}
                />
              </label>
              {patchAlt.isError && (
                <p className={fieldErrorClass}>
                  {getDisplayMessage(patchAlt.error, 'Failed to update alt text.')}
                </p>
              )}
              {patchAlt.isSuccess && (
                <p role="status" className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  Saved.
                </p>
              )}
            </div>

            {/* Display order */}
            <div className="flex items-end gap-2">
              <div className="w-28">
                <label className={labelClass}>
                  Display order
                  <input
                    type="number"
                    min={0}
                    value={orderValue}
                    onChange={(e) => setOrderValue(e.target.value)}
                    disabled={isBusy}
                    className={inputClass}
                  />
                </label>
                {patchOrder.isError && (
                  <p className={fieldErrorClass}>
                    {getDisplayMessage(patchOrder.error, 'Failed to update order.')}
                  </p>
                )}
                {patchOrder.isSuccess && (
                  <p role="status" className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                    Applied.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions row */}
        <div className="mt-3 flex items-center justify-between border-t border-foreground/8 pt-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAltSave}
              disabled={isBusy}
              className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {patchAlt.isPending ? 'Saving…' : 'Save alt'}
            </button>
            <button
              type="button"
              onClick={handleOrderApply}
              disabled={isBusy}
              className="rounded-md bg-foreground/5 px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:bg-foreground/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {patchOrder.isPending ? 'Applying…' : 'Apply order'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isBusy}
            className="rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete
          </button>
        </div>

        {deleteMutation.isError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
            {getDisplayMessage(deleteMutation.error, 'Failed to delete asset.')}
          </p>
        )}
      </div>
    </>
  );
}

import { useRef, useState } from 'react';

import {
  fieldErrorClass,
  inputClass,
  labelClass,
} from '@/features/admin/components/projects/projectFormClasses';
import type { ProjectAssetType } from '@/features/projects/api/projects.types';
import { getDisplayMessage } from '@/shared/api/mapApiError';

import { useUploadProjectAsset } from '@/features/assets/hooks/useUploadProjectAsset';

type Props = {
  projectId: string;
};

export function AssetUploader({ projectId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [assetType, setAssetType] = useState<ProjectAssetType>('image');
  const [altText, setAltText] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [uploadKey, setUploadKey] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = useUploadProjectAsset({
    onSuccess: () => {
      setFile(null);
      setAltText('');
      setDisplayOrder('');
      setUploadKey((k) => k + 1);
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
    upload.reset();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;

    const orderNum = displayOrder.trim() !== '' ? parseInt(displayOrder, 10) : undefined;

    upload.mutate({
      projectId,
      file,
      assetType,
      altText: altText.trim() !== '' ? altText.trim() : undefined,
      displayOrder: orderNum !== undefined && !isNaN(orderNum) ? orderNum : undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-foreground/10 bg-background p-4 space-y-4"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
        Upload new asset
      </p>

      {/* File + type row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            File
            <input
              key={uploadKey}
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={upload.isPending}
              className="mt-1 block w-full cursor-pointer rounded-lg border border-foreground/15 bg-background text-sm text-foreground/70 file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary transition hover:file:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
          {file && (
            <p className="mt-1 truncate text-xs text-foreground/50">{file.name}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Asset type
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as ProjectAssetType)}
              disabled={upload.isPending}
              className={inputClass}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </label>
        </div>
      </div>

      {/* Alt + order row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Alt text{' '}
            <span className="font-normal text-foreground/50">(optional)</span>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the asset…"
              maxLength={200}
              disabled={upload.isPending}
              className={inputClass}
            />
          </label>
        </div>

        <div>
          <label className={labelClass}>
            Display order{' '}
            <span className="font-normal text-foreground/50">(optional)</span>
            <input
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              placeholder="e.g. 0"
              disabled={upload.isPending}
              className={inputClass}
            />
          </label>
        </div>
      </div>

      {/* Error / success feedback */}
      {upload.isError && (
        <p className={fieldErrorClass}>
          {getDisplayMessage(upload.error, 'Upload failed.')}
        </p>
      )}
      {upload.isSuccess && (
        <p role="status" className="text-xs text-emerald-600 dark:text-emerald-400">
          Asset uploaded successfully.
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!file || upload.isPending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {upload.isPending ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </form>
  );
}

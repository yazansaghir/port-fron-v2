import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { AdminButton } from '@/features/admin/components/ui/AdminButton';
import { AdminCard } from '@/features/admin/components/ui/AdminCard';
import { AdminSection } from '@/features/admin/components/ui/AdminSection';
import { SettingsEditorForm } from '@/features/admin/components/settings/SettingsEditorForm';
import {
  editorValuesToRequest,
  settingsToEditorValues,
  type SettingsEditorValues,
} from '@/features/admin/components/settings/SettingsEditorForm';
import { SettingsPreviewCard } from '@/features/admin/components/settings/SettingsPreviewCard';
import { SettingsVersionList } from '@/features/admin/components/settings/SettingsVersionList';
import { inputClass, labelClass } from '@/features/admin/components/settings/settingsFormClasses';
import type { SiteSettings } from '@/features/settings/api/settings.types';
import { useAdminSettingsList } from '@/features/settings/hooks/useAdminSettingsList';
import { useCloneAdminSettings } from '@/features/settings/hooks/useCloneAdminSettings';
import { usePublishAdminSettings } from '@/features/settings/hooks/usePublishAdminSettings';
import { useUpdateAdminSettings } from '@/features/settings/hooks/useUpdateAdminSettings';
import { ADMIN_SETTINGS_MAX_LIMIT } from '@/shared/api/pagination';
import { getDisplayMessage, getFieldErrorsRecord } from '@/shared/api/mapApiError';

const QUERY_PARAMS = { limit: ADMIN_SETTINGS_MAX_LIMIT };

function pickDefaultId(items: SiteSettings[]): string | null {
  if (items.length === 0) return null;
  return (items.find((i) => i.isPublished) ?? items[0]).id;
}

export default function SettingsPage() {
  const { data, isPending, isError, error, refetch } = useAdminSettingsList(QUERY_PARAMS);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<SettingsEditorValues | null>(null);

  // Seed selection once data is loaded
  useEffect(() => {
    if (!data || selectedId !== null) return;
    const id = pickDefaultId(data.items);
    setSelectedId(id);
  }, [data, selectedId]);

  // Sync form values when selected version changes
  useEffect(() => {
    if (!data || !selectedId) {
      setFormValues(null);
      return;
    }
    const found = data.items.find((i) => i.id === selectedId);
    if (found) setFormValues(settingsToEditorValues(found));
  }, [selectedId, data]);

  const selectedItem = data?.items.find((i) => i.id === selectedId) ?? null;

  // ── Save ──────────────────────────────────────────────────────────────────
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveFieldErrors, setSaveFieldErrors] = useState<Record<string, string>>({});

  const { mutate: save, isPending: isSaving } = useUpdateAdminSettings({
    onSuccess: (updated) => {
      setSaveError(null);
      setSaveFieldErrors({});
      // Refresh form values from server response to pick up server-normalized fields
      setFormValues(settingsToEditorValues(updated));
    },
    onError: (err) => {
      setSaveError(getDisplayMessage(err, 'Failed to save settings.'));
      setSaveFieldErrors(getFieldErrorsRecord(err));
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedId || !formValues) return;
    save({ id: selectedId, body: editorValuesToRequest(formValues) });
  }

  function handleFieldChange(field: keyof SettingsEditorValues, value: string) {
    setFormValues((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  // ── Clone ─────────────────────────────────────────────────────────────────
  const [cloneName, setCloneName] = useState('');
  const [cloneError, setCloneError] = useState<string | null>(null);

  const { mutate: clone, isPending: isCloning } = useCloneAdminSettings({
    onSuccess: (created) => {
      setCloneError(null);
      setCloneName('');
      setSelectedId(created.id);
    },
    onError: (err) => {
      setCloneError(getDisplayMessage(err, 'Failed to clone settings.'));
    },
  });

  function handleClone() {
    if (!selectedId) return;
    clone({
      sourceId: selectedId,
      ...(cloneName.trim() ? { versionName: cloneName.trim() } : {}),
    });
  }

  // ── Publish ───────────────────────────────────────────────────────────────
  const [publishError, setPublishError] = useState<string | null>(null);

  const { mutate: publish, isPending: isPublishing } = usePublishAdminSettings({
    onSuccess: () => {
      setPublishError(null);
    },
    onError: (err) => {
      setPublishError(getDisplayMessage(err, 'Failed to publish settings.'));
    },
  });

  function handlePublish() {
    if (!selectedId) return;
    if (
      !window.confirm(
        'Publish this version? The public site will use the published site name and font. Brand colours are fixed in the site stylesheet; stored colour fields are not applied on the live site.',
      )
    )
      return;
    publish(selectedId);
  }

  const isActionBusy = isSaving || isCloning || isPublishing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          {data && !isPending && (
            <p className="mt-0.5 text-sm text-foreground/50">
              {data.total} version{data.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* List fetch error */}
      {isError && (
        <AdminCard className="p-5">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-foreground/80">
              {getDisplayMessage(error, 'Failed to load settings.')}
            </p>
            <AdminButton variant="soft" onClick={() => void refetch()}>
              Retry
            </AdminButton>
          </div>
        </AdminCard>
      )}

      {!isError && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
          {/* Left: version list */}
          <div className="space-y-3">
            <AdminSection title="Versions" description="Select a version to edit.">
              <SettingsVersionList
                items={data?.items ?? []}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setSaveError(null);
                  setSaveFieldErrors({});
                }}
                isLoading={isPending}
              />
            </AdminSection>
          </div>

          {/* Right: editor + preview + actions */}
          <div className="space-y-6">
            {!isPending && !selectedItem && data?.items.length === 0 ? null : (
              <>
                {/* Editor form */}
                <AdminSection
                  title="Edit version"
                  description={
                    selectedItem
                      ? `Editing: ${selectedItem.versionName ?? selectedItem.id}. Live appearance: site name, font, and CSS tokens — stored colours are database-only.`
                      : undefined
                  }
                >
                  <AdminCard className="p-5">
                    {isPending || !formValues ? (
                      <div className="space-y-4 animate-pulse">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="h-9 rounded-lg bg-foreground/8" />
                        ))}
                      </div>
                    ) : (
                      <SettingsEditorForm
                        values={formValues}
                        onChange={handleFieldChange}
                        onSubmit={handleSubmit}
                        isSaving={isSaving}
                        fieldErrors={saveFieldErrors}
                        generalError={saveError}
                      />
                    )}
                  </AdminCard>
                </AdminSection>

                {/* Preview */}
                {formValues && (
                  <AdminSection
                    title="Preview"
                    description="Scoped preview of stored colours and font. Public pages use fixed brand tokens from CSS, not these stored colours."
                  >
                    <SettingsPreviewCard values={formValues} />
                  </AdminSection>
                )}

                {/* Clone + Publish actions */}
                {!isPending && selectedItem && (
                  <AdminSection title="Version actions">
                    <AdminCard className="divide-y divide-foreground/8">
                      {/* Clone */}
                      <div className="p-5 space-y-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">Clone version</p>
                          <p className="mt-0.5 text-xs text-foreground/50">
                            Creates a new unpublished copy of the selected version.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-end gap-3">
                          <div className="flex-1 min-w-[160px]">
                            <label htmlFor="clone-name" className={labelClass}>
                              New version name{' '}
                              <span className="font-normal text-foreground/50">(optional)</span>
                            </label>
                            <input
                              id="clone-name"
                              type="text"
                              value={cloneName}
                              onChange={(e) => setCloneName(e.target.value)}
                              disabled={isActionBusy}
                              maxLength={50}
                              placeholder="v2.0-draft"
                              className={inputClass}
                            />
                          </div>
                          <AdminButton
                            variant="ghost"
                            onClick={handleClone}
                            disabled={isActionBusy}
                            className="px-4 py-2"
                          >
                            {isCloning ? 'Cloning…' : 'Clone'}
                          </AdminButton>
                        </div>
                        {cloneError && (
                          <p className="text-xs text-red-600 dark:text-red-400">{cloneError}</p>
                        )}
                      </div>

                      {/* Publish */}
                      <div className="p-5 space-y-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">Publish version</p>
                          <p className="mt-0.5 text-xs text-foreground/50">
                            Activates this version for the public site (name and font). Unpublishes
                            all other versions. Stored colours are not applied to the live site.
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <AdminButton
                            onClick={handlePublish}
                            disabled={isActionBusy || selectedItem.isPublished}
                            className="bg-emerald-600 px-4 py-2 hover:bg-emerald-700"
                          >
                            {isPublishing ? 'Publishing…' : 'Publish'}
                          </AdminButton>
                          {selectedItem.isPublished && (
                            <span className="text-xs text-foreground/50">
                              This version is already published.
                            </span>
                          )}
                        </div>
                        {publishError && (
                          <p className="text-xs text-red-600 dark:text-red-400">{publishError}</p>
                        )}
                      </div>
                    </AdminCard>
                  </AdminSection>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

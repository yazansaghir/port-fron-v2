import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { AdminButton } from '@/features/admin/components/ui/AdminButton';
import { AdminCard } from '@/features/admin/components/ui/AdminCard';
import { AdminSection } from '@/features/admin/components/ui/AdminSection';
import { ThemeDraftEditor } from '@/features/admin/components/settings/ThemeDraftEditor';
import { ThemePreviewShell } from '@/features/admin/components/settings/ThemePreviewShell';
import { ThemeRevisionsPanel } from '@/features/admin/components/settings/ThemeRevisionsPanel';
import { inputClass, labelClass } from '@/features/admin/components/settings/settingsFormClasses';
import { formatMessageDateTime } from '@/features/admin/components/messages/messageDate';
import { useSiteAppearance } from '@/features/public-site/hooks/useSiteAppearance';
import {
  draftTokensToNormalized,
  type NormalizedSemanticTokens,
} from '@/features/public-site/lib/theme-runtime';
import { parseThemeDraftTokens } from '@/features/themes/api/themesWire';
import { useAdminThemeDetail } from '@/features/themes/hooks/useAdminThemeDetail';
import { useAdminThemesList } from '@/features/themes/hooks/useAdminThemesList';
import { useCreateAdminTheme } from '@/features/themes/hooks/useCreateAdminTheme';
import { useDuplicateAdminTheme } from '@/features/themes/hooks/useDuplicateAdminTheme';
import { usePatchSiteSettings } from '@/features/themes/hooks/usePatchSiteSettings';
import { usePublishAdminTheme } from '@/features/themes/hooks/usePublishAdminTheme';
import { useUpdateAdminThemeDraft } from '@/features/themes/hooks/useUpdateAdminThemeDraft';
import { getDisplayMessage, getFieldErrorsRecord } from '@/shared/api/mapApiError';

export default function SettingsPage() {
  const { data: themes, isPending: themesLoading, isError: themesError, error: themesErr, refetch } =
    useAdminThemesList();

  const { data: appearance } = useSiteAppearance({ staleTime: 60 * 1000 });

  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [siteName, setSiteName] = useState('');
  const [liveThemeId, setLiveThemeId] = useState('');

  const [draftPreview, setDraftPreview] = useState<NormalizedSemanticTokens>(() =>
    draftTokensToNormalized(parseThemeDraftTokens({})),
  );

  const [newThemeName, setNewThemeName] = useState('');
  const [duplicateName, setDuplicateName] = useState('');

  const { data: selectedTheme, isPending: detailLoading } = useAdminThemeDetail(selectedThemeId);

  useEffect(() => {
    if (!themes?.length) return;
    setSelectedThemeId((id) => id ?? (themes.find((t) => t.isPublished) ?? themes[0]).id);
  }, [themes]);

  useEffect(() => {
    if (!appearance) return;
    if (appearance.siteName) setSiteName(appearance.siteName);
    if (appearance.publishedThemeId) {
      setLiveThemeId((cur) => appearance.publishedThemeId ?? cur);
    }
  }, [appearance]);

  useEffect(() => {
    if (!themes?.length) return;
    setLiveThemeId((id) => id || (themes.find((t) => t.isPublished)?.id ?? themes[0].id));
  }, [themes]);

  useEffect(() => {
    if (!selectedTheme) return;
    setDraftPreview(draftTokensToNormalized(parseThemeDraftTokens(selectedTheme.draft?.tokens ?? {})));
  }, [selectedTheme]);

  const handlePreviewChange = useCallback((tokens: NormalizedSemanticTokens) => {
    setDraftPreview(tokens);
  }, []);

  const [siteError, setSiteError] = useState<string | null>(null);
  const { mutate: saveSite, isPending: savingSite } = usePatchSiteSettings({
    onSuccess: () => setSiteError(null),
    onError: (e) => setSiteError(getDisplayMessage(e, 'Failed to save site settings.')),
  });

  function handleSaveSite(e: React.FormEvent) {
    e.preventDefault();
    saveSite({
      siteName: siteName.trim() || undefined,
      ...(liveThemeId ? { publishedThemeId: liveThemeId } : {}),
    });
  }

  const [draftError, setDraftError] = useState<string | null>(null);
  const [draftFieldErrors, setDraftFieldErrors] = useState<Record<string, string>>({});
  const { mutate: saveDraft, isPending: savingDraft } = useUpdateAdminThemeDraft({
    onSuccess: () => {
      setDraftError(null);
      setDraftFieldErrors({});
    },
    onError: (err) => {
      setDraftError(getDisplayMessage(err, 'Failed to save draft.'));
      setDraftFieldErrors(getFieldErrorsRecord(err));
    },
  });

  const [publishError, setPublishError] = useState<string | null>(null);
  const { mutate: publishTheme, isPending: publishing } = usePublishAdminTheme({
    onSuccess: () => setPublishError(null),
    onError: (e) => setPublishError(getDisplayMessage(e, 'Failed to publish theme.')),
  });

  const [createError, setCreateError] = useState<string | null>(null);
  const { mutate: createTheme, isPending: creating } = useCreateAdminTheme({
    onSuccess: (created) => {
      setCreateError(null);
      setNewThemeName('');
      setSelectedThemeId(created.id);
    },
    onError: (e) => setCreateError(getDisplayMessage(e, 'Failed to create theme.')),
  });

  const [dupError, setDupError] = useState<string | null>(null);
  const { mutate: duplicateTheme, isPending: duplicating } = useDuplicateAdminTheme({
    onSuccess: (created) => {
      setDupError(null);
      setDuplicateName('');
      setSelectedThemeId(created.id);
    },
    onError: (e) => setDupError(getDisplayMessage(e, 'Failed to duplicate theme.')),
  });

  const busy = savingSite || savingDraft || publishing || creating || duplicating;

  function handlePublish() {
    if (!selectedThemeId) return;
    if (
      !window.confirm(
        'Publish this theme? Visitors will see the published revision on the public site.',
      )
    )
      return;
    publishTheme(selectedThemeId);
  }

  function handleCreate() {
    const name = newThemeName.trim() || 'New theme';
    createTheme({ name });
  }

  function handleDuplicate() {
    if (!selectedThemeId) return;
    duplicateTheme({
      themeId: selectedThemeId,
      ...(duplicateName.trim() ? { name: duplicateName.trim() } : {}),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          {themes && !themesLoading && (
            <p className="mt-0.5 text-sm text-foreground/50">
              {themes.length} theme{themes.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {themesError && (
        <AdminCard className="p-5">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-foreground/80">
              {getDisplayMessage(themesErr, 'Failed to load themes.')}
            </p>
            <AdminButton variant="soft" onClick={() => void refetch()}>
              Retry
            </AdminButton>
          </div>
        </AdminCard>
      )}

      {!themesError && (
        <div className="space-y-6">
          <AdminSection
            title="Site"
            description="Site name and which theme is live for visitors."
          >
            <AdminCard className="p-5">
              <form onSubmit={handleSaveSite} className="space-y-4">
                {siteError && <p className="text-sm text-status-danger">{siteError}</p>}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="site-name" className={labelClass}>
                      Site name
                    </label>
                    <input
                      id="site-name"
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      disabled={busy}
                      maxLength={100}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="live-theme" className={labelClass}>
                      Live theme
                    </label>
                    <select
                      id="live-theme"
                      value={liveThemeId}
                      onChange={(e) => setLiveThemeId(e.target.value)}
                      disabled={busy || !themes?.length}
                      className={inputClass}
                    >
                      {(themes ?? []).map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                          {t.isPublished ? ' (published)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <AdminButton type="submit" disabled={busy} className="px-4 py-2">
                    {savingSite ? 'Saving…' : 'Save site settings'}
                  </AdminButton>
                </div>
              </form>
            </AdminCard>
          </AdminSection>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
            <div className="space-y-3">
              <AdminSection title="Theme library" description="Select a theme to edit its draft.">
                <AdminCard className="p-3 space-y-2">
                  {themesLoading ? (
                    <p className="px-2 py-3 text-sm text-foreground/50">Loading themes…</p>
                  ) : !themes?.length ? (
                    <p className="px-2 py-3 text-sm text-foreground/50">No themes yet. Create one below.</p>
                  ) : (
                    themes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSelectedThemeId(t.id);
                          setDraftError(null);
                          setDraftFieldErrors({});
                        }}
                        className={[
                          'w-full rounded-lg border px-4 py-3 text-left transition',
                          selectedThemeId === t.id
                            ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20'
                            : 'border-foreground/10 bg-background hover:border-foreground/20 hover:bg-foreground/[0.03]',
                        ].join(' ')}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-foreground">{t.name}</span>
                          {t.isPublished && (
                            <span className="shrink-0 rounded-full bg-status-success/15 px-2 py-0.5 text-xs font-medium text-status-success">
                              Live
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-foreground/45">
                          {formatMessageDateTime(t.updatedAt)}
                        </p>
                      </button>
                    ))
                  )}
                  <div className="border-t border-foreground/8 pt-3 space-y-2 px-1">
                    <p className="text-xs font-medium text-foreground/70">New theme</p>
                    <input
                      type="text"
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                      disabled={busy}
                      placeholder="Theme name"
                      className={inputClass}
                    />
                    {createError && (
                      <p className="text-xs text-status-danger">{createError}</p>
                    )}
                    <AdminButton type="button" variant="secondary" disabled={busy} onClick={handleCreate}>
                      {creating ? 'Creating…' : 'Create theme'}
                    </AdminButton>
                  </div>
                </AdminCard>
              </AdminSection>
            </div>

            <div className="space-y-6">
              {selectedThemeId && (
                <>
                  <AdminSection
                    title="Draft editor"
                    description={
                      selectedTheme
                        ? `Editing “${selectedTheme.name}”. Save draft, preview, then publish when ready.`
                        : undefined
                    }
                  >
                    <AdminCard className="p-5">
                      {detailLoading || !selectedTheme ? (
                        <div className="space-y-4 animate-pulse">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-9 rounded-lg bg-foreground/8" />
                          ))}
                        </div>
                      ) : (
                        <ThemeDraftEditor
                          theme={selectedTheme}
                          isSaving={savingDraft}
                          fieldErrors={draftFieldErrors}
                          generalError={draftError}
                          onPreviewChange={handlePreviewChange}
                          onSave={(body) => {
                            if (!selectedThemeId) return;
                            saveDraft({ themeId: selectedThemeId, body });
                          }}
                        />
                      )}
                    </AdminCard>
                  </AdminSection>

                  <AdminSection
                    title="Preview"
                    description="Scoped to this card — shows the current draft tokens, not the live site."
                  >
                    <ThemePreviewShell tokens={draftPreview} siteName={siteName || 'Your site'} />
                  </AdminSection>

                  <AdminSection title="Revisions">
                    <ThemeRevisionsPanel themeId={selectedThemeId} />
                  </AdminSection>

                  <AdminSection title="Theme actions">
                    <AdminCard className="divide-y divide-foreground/8">
                      <div className="p-5 space-y-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">Duplicate theme</p>
                          <p className="mt-0.5 text-xs text-foreground/50">
                            Creates a new theme from the selected draft snapshot.
                          </p>
                        </div>
                        <input
                          type="text"
                          value={duplicateName}
                          onChange={(e) => setDuplicateName(e.target.value)}
                          disabled={busy}
                          placeholder="Optional name for the copy"
                          className={inputClass}
                        />
                        {dupError && (
                          <p className="text-xs text-status-danger">{dupError}</p>
                        )}
                        <AdminButton type="button" variant="ghost" disabled={busy} onClick={handleDuplicate}>
                          {duplicating ? 'Duplicating…' : 'Duplicate'}
                        </AdminButton>
                      </div>
                      <div className="p-5 space-y-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">Publish theme</p>
                          <p className="mt-0.5 text-xs text-foreground/50">
                            Pushes the current draft as the published revision for this theme.
                          </p>
                        </div>
                        <AdminButton
                          variant="success"
                          onClick={handlePublish}
                          disabled={busy}
                          className="px-4 py-2"
                        >
                          {publishing ? 'Publishing…' : 'Publish'}
                        </AdminButton>
                        {publishError && (
                          <p className="text-xs text-status-danger">{publishError}</p>
                        )}
                      </div>
                    </AdminCard>
                  </AdminSection>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

import type { FormEvent } from 'react';

import type { SiteSettings, UpdateSettingsRequest } from '@/features/settings/api/settings.types';
import { AdminButton } from '@/features/admin/components/ui/AdminButton';

import {
  fieldErrorClass,
  generalErrorClass,
  inputClass,
  labelClass,
} from './settingsFormClasses';

const STORED_COLOR_META: { field: keyof SettingsEditorValues; label: string }[] = [
  { field: 'primaryColor', label: 'Primary' },
  { field: 'secondaryColor', label: 'Secondary' },
  { field: 'bgColor', label: 'Background' },
  { field: 'textPrimary', label: 'Text' },
];

export type SettingsEditorValues = {
  siteName: string;
  activeFont: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  textPrimary: string;
  versionName: string;
};

export function settingsToEditorValues(s: SiteSettings): SettingsEditorValues {
  return {
    siteName: s.siteName,
    activeFont: s.activeFont,
    primaryColor: s.primaryColor,
    secondaryColor: s.secondaryColor,
    bgColor: s.bgColor,
    textPrimary: s.textPrimary,
    versionName: s.versionName ?? '',
  };
}

export function editorValuesToRequest(v: SettingsEditorValues): UpdateSettingsRequest {
  return {
    siteName: v.siteName,
    activeFont: v.activeFont,
    primaryColor: v.primaryColor,
    secondaryColor: v.secondaryColor,
    bgColor: v.bgColor,
    textPrimary: v.textPrimary,
    // Send undefined when field is empty so backend treats it as unchanged / null
    ...(v.versionName.trim() ? { versionName: v.versionName.trim() } : {}),
  };
}

type Props = {
  values: SettingsEditorValues;
  onChange: (field: keyof SettingsEditorValues, value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  fieldErrors: Record<string, string>;
  generalError: string | null;
};

export function SettingsEditorForm({
  values,
  onChange,
  onSubmit,
  isSaving,
  fieldErrors,
  generalError,
}: Props) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {generalError && (
        <p className={generalErrorClass}>{generalError}</p>
      )}

      {/* Identity */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sf-siteName" className={labelClass}>
            Site name
          </label>
          <input
            id="sf-siteName"
            type="text"
            value={values.siteName}
            onChange={(e) => onChange('siteName', e.target.value)}
            disabled={isSaving}
            maxLength={100}
            placeholder="My Portfolio"
            className={inputClass}
          />
          {fieldErrors['siteName'] && (
            <p className={fieldErrorClass}>{fieldErrors['siteName']}</p>
          )}
        </div>

        <div>
          <label htmlFor="sf-versionName" className={labelClass}>
            Version name
          </label>
          <input
            id="sf-versionName"
            type="text"
            value={values.versionName}
            onChange={(e) => onChange('versionName', e.target.value)}
            disabled={isSaving}
            maxLength={50}
            placeholder="v1.0"
            className={inputClass}
          />
          {fieldErrors['versionName'] && (
            <p className={fieldErrorClass}>{fieldErrors['versionName']}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="sf-activeFont" className={labelClass}>
            Active font
          </label>
          <input
            id="sf-activeFont"
            type="text"
            value={values.activeFont}
            onChange={(e) => onChange('activeFont', e.target.value)}
            disabled={isSaving}
            maxLength={50}
            placeholder="Inter"
            className={inputClass}
          />
          {fieldErrors['activeFont'] && (
            <p className={fieldErrorClass}>{fieldErrors['activeFont']}</p>
          )}
        </div>
      </div>

      {/* Stored colours (persisted; public site uses stylesheet tokens) */}
      <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4">
        <p className="text-sm font-medium text-foreground">Stored colours</p>
        <p className="mt-1 text-xs leading-relaxed text-foreground/50">
          The live portfolio brand palette is defined in{' '}
          <code className="rounded bg-foreground/5 px-1 py-0.5 text-[11px]">globals.css</code>. These
          values stay in the database when you save; they are not applied to the public site.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {STORED_COLOR_META.map(({ field, label }) => (
            <div key={field}>
              <p className={labelClass}>{label}</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className="h-9 w-9 flex-shrink-0 rounded-md border border-foreground/10"
                  style={{ backgroundColor: values[field] }}
                  aria-hidden
                />
                <span className="font-mono text-sm text-foreground/80">{values[field]}</span>
              </div>
              {fieldErrors[field] ? <p className={fieldErrorClass}>{fieldErrors[field]}</p> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <AdminButton type="submit" disabled={isSaving} className="px-4 py-2">
          {isSaving ? 'Saving…' : 'Save changes'}
        </AdminButton>
      </div>
    </form>
  );
}

import { AdminButton } from '@/features/admin/components/ui/AdminButton';
import {
  fieldErrorClass,
  generalErrorClass,
  inputClass,
  labelClass,
  textareaClass,
} from './projectFormClasses';

export type ProjectFormValues = {
  title: string;
  slug: string;
  shortSummary: string;
  content: string;
  thumbnailUrl: string;
  githubUrl: string;
  liveUrl: string;
  metaTitle: string;
  metaDescription: string;
  orderIndex: string;
};

type Props = {
  values: ProjectFormValues;
  onChange: (field: keyof ProjectFormValues, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
  fieldErrors: Record<string, string>;
  generalError: string | null;
  submitLabel?: string;
};

type FieldConfig = {
  id: string;
  field: keyof ProjectFormValues;
  label: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
};

const FIELDS: FieldConfig[] = [
  { id: 'pf-title', field: 'title', label: 'Title', placeholder: 'My Project' },
  { id: 'pf-slug', field: 'slug', label: 'Slug', placeholder: 'my-project' },
  {
    id: 'pf-shortSummary',
    field: 'shortSummary',
    label: 'Short summary',
    placeholder: 'One-line description',
  },
  {
    id: 'pf-content',
    field: 'content',
    label: 'Content',
    placeholder: 'Full project description…',
    textarea: true,
  },
  {
    id: 'pf-thumbnailUrl',
    field: 'thumbnailUrl',
    label: 'Thumbnail URL',
    type: 'url',
    placeholder: 'https://cdn.example.com/thumb.png',
  },
  {
    id: 'pf-githubUrl',
    field: 'githubUrl',
    label: 'GitHub URL',
    type: 'url',
    placeholder: 'https://github.com/org/repo',
  },
  {
    id: 'pf-liveUrl',
    field: 'liveUrl',
    label: 'Live URL',
    type: 'url',
    placeholder: 'https://example.com',
  },
  { id: 'pf-metaTitle', field: 'metaTitle', label: 'Meta title', placeholder: 'SEO title' },
  {
    id: 'pf-metaDescription',
    field: 'metaDescription',
    label: 'Meta description',
    placeholder: 'SEO description',
  },
  {
    id: 'pf-orderIndex',
    field: 'orderIndex',
    label: 'Order index',
    type: 'number',
    placeholder: '0',
  },
];

export function ProjectForm({
  values,
  onChange,
  onSubmit,
  disabled,
  fieldErrors,
  generalError,
  submitLabel = 'Save',
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {generalError && (
        <p className={generalErrorClass} role="alert">
          {generalError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {FIELDS.map((f) => {
          const error = fieldErrors[f.field];
          const errorId = error ? `${f.id}-error` : undefined;

          return (
            <div key={f.field} className={f.textarea || f.field === 'content' ? 'sm:col-span-2' : ''}>
              <label htmlFor={f.id} className={labelClass}>
                {f.label}
              </label>
              {f.textarea ? (
                <textarea
                  id={f.id}
                  value={values[f.field]}
                  onChange={(e) => onChange(f.field, e.target.value)}
                  disabled={disabled}
                  placeholder={f.placeholder}
                  className={textareaClass}
                  aria-invalid={Boolean(error)}
                  aria-describedby={errorId}
                />
              ) : (
                <input
                  id={f.id}
                  type={f.type ?? 'text'}
                  value={values[f.field]}
                  onChange={(e) => onChange(f.field, e.target.value)}
                  disabled={disabled}
                  placeholder={f.placeholder}
                  className={inputClass}
                  aria-invalid={Boolean(error)}
                  aria-describedby={errorId}
                  min={f.type === 'number' ? 0 : undefined}
                />
              )}
              {error && (
                <p id={errorId} className={fieldErrorClass}>
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <AdminButton type="submit" disabled={disabled} className="px-4 py-2">
          {disabled ? 'Saving…' : submitLabel}
        </AdminButton>
      </div>
    </form>
  );
}

import type { CSSProperties, FormEvent } from 'react';

export type ContactFormValues = {
  senderName: string;
  senderEmail: string;
  content: string;
};

type ContactFormProps = {
  values: ContactFormValues;
  onChange: (field: keyof ContactFormValues, value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
  fieldErrors: Partial<Record<keyof ContactFormValues, string>>;
  generalError: string | null;
  success: boolean;
};

const labelCls =
  'block text-xs font-semibold uppercase tracking-[0.14em] text-muted';

const controlBase =
  'mt-2 block w-full rounded-xl border bg-[color-mix(in_srgb,var(--color-surface)_62%,transparent)] px-4 py-3 text-sm leading-snug text-foreground shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-border)_35%,transparent)] outline-none transition-[border-color,box-shadow,ring-color] duration-motion-fast ease-motion-out placeholder:text-foreground/35 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-45';

const controlDefault = `${controlBase} border-border/50 focus:border-border-strong focus:ring-focus-ring/20`;

const controlInvalid = `${controlBase} border-status-danger/40 focus:border-status-danger/50 focus:ring-status-danger/20`;

const submitStyle: CSSProperties = {
  background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
};

function fieldControlClass(invalid: boolean) {
  return invalid ? controlInvalid : controlDefault;
}

export function ContactForm({
  values,
  onChange,
  onSubmit,
  disabled,
  fieldErrors,
  generalError,
  success,
}: ContactFormProps) {
  if (success) {
    return (
      <div className="relative py-4 text-center md:py-6" role="status">
        <div
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-status-success/45 to-transparent sm:inset-x-12"
          aria-hidden
        />
        <p className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
          Message sent
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted md:text-base">
          Thank you for reaching out. Your note is in my inbox and I will reply as soon as I can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      {generalError ? (
        <div
          role="alert"
          className="relative overflow-hidden rounded-xl border border-status-danger/25 bg-status-danger/10 px-4 py-3.5"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-status-danger/50 to-transparent"
            aria-hidden
          />
          <p className="relative text-sm leading-relaxed text-foreground">{generalError}</p>
        </div>
      ) : null}

      <div>
        <label htmlFor="contact-name" className={labelCls}>
          Name
        </label>
        <input
          id="contact-name"
          name="senderName"
          type="text"
          autoComplete="name"
          value={values.senderName}
          onChange={(e) => onChange('senderName', e.target.value)}
          className={fieldControlClass(Boolean(fieldErrors.senderName))}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.senderName)}
          aria-describedby={fieldErrors.senderName ? 'contact-name-error' : undefined}
          placeholder="Your name"
        />
        {fieldErrors.senderName ? (
          <p id="contact-name-error" className="mt-2 text-xs font-medium text-status-danger">
            {fieldErrors.senderName}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className={labelCls}>
          Email
        </label>
        <input
          id="contact-email"
          name="senderEmail"
          type="email"
          autoComplete="email"
          value={values.senderEmail}
          onChange={(e) => onChange('senderEmail', e.target.value)}
          className={fieldControlClass(Boolean(fieldErrors.senderEmail))}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.senderEmail)}
          aria-describedby={fieldErrors.senderEmail ? 'contact-email-error' : undefined}
          placeholder="you@example.com"
        />
        {fieldErrors.senderEmail ? (
          <p id="contact-email-error" className="mt-2 text-xs font-medium text-status-danger">
            {fieldErrors.senderEmail}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelCls}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="content"
          rows={6}
          value={values.content}
          onChange={(e) => onChange('content', e.target.value)}
          className={`${fieldControlClass(Boolean(fieldErrors.content))} min-h-[148px] resize-y leading-relaxed`}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.content)}
          aria-describedby={fieldErrors.content ? 'contact-message-error' : undefined}
          placeholder="Project goals, timeline, budget range, links—whatever helps me understand how I can help."
        />
        {fieldErrors.content ? (
          <p id="contact-message-error" className="mt-2 text-xs font-medium text-status-danger">
            {fieldErrors.content}
          </p>
        ) : null}
      </div>

      <div className="border-t border-border/40 pt-7">
        <button
          type="submit"
          disabled={disabled}
          style={submitStyle}
          className="inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground glow-primary ring-1 ring-primary/30 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[220px]"
        >
          {disabled ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  );
}

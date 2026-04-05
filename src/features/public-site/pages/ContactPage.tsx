import { useState, type FormEvent } from 'react';

import { useSendMessage } from '@/features/messages/hooks/useSendMessage';
import { getDisplayMessage, getFieldErrorsRecord } from '@/shared/api/mapApiError';
import {
  ContactForm,
  type ContactFormValues,
} from '@/features/public-site/components/ContactForm';
import { GradientText } from '@/features/public-site/components/GradientText';
import { FadeInView } from '@/features/public-site/components/motion';
import { PublicMarketingPageFrame } from '@/features/public-site/components/PublicMarketingPageFrame';
import {
  CONTACT_FORM_PANEL_DESCRIPTION,
  CONTACT_FORM_PANEL_TITLE,
  CONTACT_HERO_EYEBROW,
  CONTACT_HERO_LEAD,
  CONTACT_HERO_LINE1,
  CONTACT_HERO_LINE2_GRADIENT,
  CONTACT_HERO_LINE2_PREFIX,
  CONTACT_HERO_LINE2_SUFFIX,
  CONTACT_HERO_SUPPORTING,
  CONTACT_PUBLIC_EMAIL,
  CONTACT_SUPPORT_COLLABORATION,
  CONTACT_SUPPORT_HEADING,
  CONTACT_SUPPORT_RESPONSE,
} from '@/features/public-site/content/contactContent';

const EMPTY: ContactFormValues = { senderName: '', senderEmail: '', content: '' };

const formPanelShellClass =
  'relative overflow-hidden rounded-3xl border border-white/10 bg-[color-mix(in_srgb,var(--color-surface)_72%,transparent)] p-8 shadow-2xl shadow-black/25 backdrop-blur-[20px] md:p-10 lg:p-11';

const sideCardClass =
  'relative overflow-hidden rounded-2xl border border-white/10 bg-[color-mix(in_srgb,var(--color-surface)_58%,transparent)] p-6 shadow-xl shadow-black/20 backdrop-blur-[18px] md:p-7';

export default function ContactPage() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const sendMessage = useSendMessage({
    onSuccess: () => {
      setSubmitted(true);
      setValues(EMPTY);
    },
  });

  const fieldErrors = sendMessage.error
    ? getFieldErrorsRecord(sendMessage.error)
    : {};

  const generalError =
    sendMessage.error && Object.keys(fieldErrors).length === 0
      ? getDisplayMessage(sendMessage.error)
      : null;

  function handleChange(field: keyof ContactFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (submitted) setSubmitted(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendMessage.mutate({
      senderName: values.senderName.trim(),
      senderEmail: values.senderEmail.trim(),
      content: values.content.trim(),
    });
  }

  return (
    <PublicMarketingPageFrame>
      <header className="relative pt-10 pb-14 sm:pt-14 sm:pb-16 md:pt-16 md:pb-20">
        <div
          className="pointer-events-none absolute -left-2 top-8 bottom-8 w-px sm:-left-1"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 35%, transparent), color-mix(in srgb, var(--color-accent) 12%, transparent), transparent)',
          }}
          aria-hidden
        />
        <FadeInView className="relative max-w-3xl pl-5 sm:pl-7">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-primary">
            {CONTACT_HERO_EYEBROW}
          </p>
          <h1 className="mb-8 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-6xl">
            <span className="block text-text">{CONTACT_HERO_LINE1}</span>
            <span className="mt-2 block text-text sm:mt-2.5">
              {CONTACT_HERO_LINE2_PREFIX}
              <GradientText>{CONTACT_HERO_LINE2_GRADIENT}</GradientText>
              {CONTACT_HERO_LINE2_SUFFIX}
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-[1.7] text-muted sm:text-lg">
            {CONTACT_HERO_LEAD}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted/90 sm:text-base">
            {CONTACT_HERO_SUPPORTING}
          </p>
        </FadeInView>
      </header>

      <FadeInView className="grid gap-12 pb-24 md:gap-14 lg:grid-cols-12 lg:gap-12 lg:pb-32">
        <div className="lg:col-span-7">
          <div className={formPanelShellClass}>
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-40"
              style={{
                background:
                  'radial-gradient(ellipse 85% 55% at 50% 0%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 58%)',
              }}
              aria-hidden
            />

            <div className="relative">
              {submitted ? null : (
                <div className="mb-8 border-b border-white/[0.06] pb-8">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {CONTACT_FORM_PANEL_TITLE}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                    {CONTACT_FORM_PANEL_DESCRIPTION}
                  </p>
                </div>
              )}

              <ContactForm
                values={values}
                onChange={handleChange}
                onSubmit={handleSubmit}
                disabled={sendMessage.isPending}
                fieldErrors={fieldErrors}
                generalError={generalError}
                success={submitted}
              />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 lg:pt-1">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-primary/90">
              {CONTACT_SUPPORT_HEADING}
            </p>
            <div className="space-y-5">
              <div className={sideCardClass}>
                <div
                  className="pointer-events-none absolute inset-0 opacity-45"
                  style={{
                    background:
                      'radial-gradient(ellipse 90% 70% at 10% 0%, color-mix(in srgb, var(--color-primary) 7%, transparent), transparent 52%)',
                  }}
                  aria-hidden
                />
                <div className="relative">
                  <h3 className="text-sm font-semibold text-foreground">Response time</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {CONTACT_SUPPORT_RESPONSE}
                  </p>
                </div>
              </div>

              <div className={sideCardClass}>
                <div
                  className="pointer-events-none absolute inset-0 opacity-45"
                  style={{
                    background:
                      'radial-gradient(ellipse 90% 70% at 90% 0%, color-mix(in srgb, var(--color-accent) 6%, transparent), transparent 50%)',
                  }}
                  aria-hidden
                />
                <div className="relative">
                  <h3 className="text-sm font-semibold text-foreground">Collaboration</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {CONTACT_SUPPORT_COLLABORATION}
                  </p>
                </div>
              </div>

              {CONTACT_PUBLIC_EMAIL ? (
                <div className={sideCardClass}>
                  <div className="relative">
                    <h3 className="text-sm font-semibold text-foreground">Email directly</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Prefer your client? Reach me at{' '}
                      <a
                        href={`mailto:${CONTACT_PUBLIC_EMAIL}`}
                        className="font-medium text-primary underline decoration-primary/35 underline-offset-4 transition-[text-decoration-color,opacity] duration-motion-fast ease-motion-out hover:decoration-primary/70"
                      >
                        {CONTACT_PUBLIC_EMAIL}
                      </a>
                      .
                    </p>
                  </div>
                </div>
              ) : null}

              <p className="px-0.5 text-xs leading-relaxed text-foreground/45">
                This form connects securely to the same inbox I use for client work—no ads, no
                resale lists.
              </p>
            </div>
          </div>
        </aside>
      </FadeInView>
    </PublicMarketingPageFrame>
  );
}

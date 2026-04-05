/**
 * Parses plain-text project body from the API into readable paragraphs and
 * renders them with case-study typography and overflow-safe wrapping.
 */

type ProjectCaseStudyProseProps = {
  content: string;
};

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/** Collapses internal newlines to spaces so each block reads as continuous prose. */
function normalizeParagraphBlock(block: string): string {
  return block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Prefer `\n\n` paragraph breaks; if the document has no blank lines, fall back
 * to one paragraph per non-empty line so single-newline CMS content still structures.
 */
function proseBlocksFromPlainText(raw: string): string[] {
  const t = normalizeLineEndings(raw).trim();
  if (!t) return [];

  const byDoubleBreak = t.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  if (byDoubleBreak.length > 1) {
    return byDoubleBreak.map(normalizeParagraphBlock);
  }

  const only = byDoubleBreak[0] ?? t;
  const bySingleLine = only.split('\n').map((line) => line.trim()).filter(Boolean);
  if (bySingleLine.length > 1) {
    return bySingleLine.map((line) => normalizeParagraphBlock(line));
  }

  return [normalizeParagraphBlock(only)];
}

/** Long URLs and unbroken strings wrap without stretching the column (min-w-0 + overflow wrap). */
const proseWordWrap =
  'min-w-0 max-w-full break-words [overflow-wrap:anywhere] hyphens-auto';

export function ProjectCaseStudyProse({ content }: ProjectCaseStudyProseProps) {
  const blocks = proseBlocksFromPlainText(content);
  if (blocks.length === 0) return null;

  return (
    <section
      aria-label="Case study content"
      className="mx-auto mt-14 w-full min-w-0 max-w-prose md:mt-20"
    >
      <div className="space-y-7 md:space-y-8">
        {blocks.map((block, i) => (
          <p
            key={i}
            className={
              i === 0
                ? `${proseWordWrap} text-pretty text-[1.125rem] font-medium leading-[1.78] tracking-[-0.01em] text-text sm:text-xl sm:leading-[1.72]`
                : `${proseWordWrap} text-pretty text-[1.0625rem] leading-[1.82] tracking-[-0.01em] text-foreground/82 sm:text-lg sm:leading-[1.8]`
            }
          >
            {block}
          </p>
        ))}
      </div>
    </section>
  );
}

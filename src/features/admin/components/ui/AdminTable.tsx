import type { HTMLAttributes, ReactNode, TdHTMLAttributes } from 'react';

type TableProps = {
  children: ReactNode;
  className?: string;
  /** Outer chrome (rounded border, surface). Set false when embedding inside another panel. */
  framed?: boolean;
};

type HeadProps = {
  columns: string[];
  /** Per-column alignment; defaults to left. */
  columnAlign?: Array<'left' | 'right'>;
};

type BodyProps = {
  children: ReactNode;
};

type RowProps = HTMLAttributes<HTMLTableRowElement> & {
  children: ReactNode;
  className?: string;
};

type CellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  children?: ReactNode;
  className?: string;
};

function thAlign(i: number, columnAlign?: Array<'left' | 'right'>) {
  const a = columnAlign?.[i] ?? 'left';
  return a === 'right' ? 'text-right' : 'text-left';
}

export function AdminTable({ children, className = '', framed = true }: TableProps) {
  const scroll = (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] text-sm">{children}</table>
    </div>
  );

  if (!framed) {
    return <div className={className}>{scroll}</div>;
  }

  return (
    <div
      className={[
        'overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]',
        className,
      ].join(' ')}
    >
      {scroll}
    </div>
  );
}

export function AdminTableHead({ columns, columnAlign }: HeadProps) {
  return (
    <thead>
      <tr className="border-b border-white/10">
        {columns.map((col, i) => (
          <th
            key={col}
            scope="col"
            className={[
              'px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/60',
              thAlign(i, columnAlign),
            ].join(' ')}
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function AdminTableBody({ children }: BodyProps) {
  return <tbody>{children}</tbody>;
}

export function AdminTableRow({ children, className = '', ...props }: RowProps) {
  return (
    <tr className={['hover:bg-white/[0.03]', className].join(' ')} {...props}>
      {children}
    </tr>
  );
}

export function AdminTableCell({ children, className = '', ...props }: CellProps) {
  return (
    <td
      className={['px-6 py-5 text-sm text-white/80', className].join(' ')}
      {...props}
    >
      {children}
    </td>
  );
}

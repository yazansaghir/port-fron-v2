type Props = {
  isRead: boolean;
};

export function MessageStatusBadge({ isRead }: Props) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        isRead
          ? 'bg-foreground/8 text-foreground/50'
          : 'bg-primary/15 text-primary dark:text-primary',
      ].join(' ')}
    >
      {isRead ? 'Read' : 'Unread'}
    </span>
  );
}

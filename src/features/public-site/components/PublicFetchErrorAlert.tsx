type PublicFetchErrorAlertProps = {
  message: string;
  radius: 'xl' | '2xl';
};

const radiusClass: Record<PublicFetchErrorAlertProps['radius'], string> = {
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

export function PublicFetchErrorAlert({ message, radius }: PublicFetchErrorAlertProps) {
  return (
    <div
      role="alert"
      className={`${radiusClass[radius]} border border-status-danger/25 bg-status-danger/10 px-4 py-3 text-sm text-foreground`}
    >
      {message}
    </div>
  );
}

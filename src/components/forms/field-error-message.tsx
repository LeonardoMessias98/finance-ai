type FieldErrorMessageProps = {
  message?: string;
};

export function FieldErrorMessage({ message }: FieldErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

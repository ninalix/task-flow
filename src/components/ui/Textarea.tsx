type TextareaProps = {
  id: string;
  label: string;
  error?: string;
} & React.ComponentPropsWithRef<"textarea">;

function Textarea({
  id,
  label,
  error,
  className="",
  ref,
  "aria-describedby": describedBy,
  ...rest
}: TextareaProps) {
  const errorId = `${id}-error`;

  const finalDescribedBy = [
    describedBy,
    error ? errorId : undefined,
  ].filter(Boolean).join(" ") || undefined;

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <textarea 
        id={id}
        ref={ref}
        {...rest}
        className={`textarea ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={finalDescribedBy}
      />
      {error && <p id={errorId} className="form-field__error">{error}</p>}
    </div>
  );
}

export default Textarea
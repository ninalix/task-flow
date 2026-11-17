type InputProps = {
  id: string;
  label: string;
  error?: string;
} & React.ComponentPropsWithRef<"input">;

function Input({
  id,
  label,
  error,
  className = "",
  ref,
  "aria-describedby": describedBy,
  ...rest
}: InputProps) {
  const errorId = `${id}-error`;

  const finalDescribedBy = [
    describedBy,
    error ? errorId : undefined,
  ].filter(Boolean).join(" ") || undefined;

  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {rest.required && (
          <span className="form-field__required" aria-hidden="true">
            {" *"}
          </span>
        )}
      </label>
      <input 
        id={id}
        ref={ref}
        {...rest}
        className={`input ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={finalDescribedBy}
      />
      {error && <p id={errorId} className="form-field__error">{error}</p>}
    </div>
  );
}

export default Input
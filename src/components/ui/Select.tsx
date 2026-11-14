type SelectProps = {
  id: string;
  label: string;
  error?: string;
} & React.ComponentPropsWithRef<"select">;

function Select({
  id,
  label,
  error,
  className="",
  ref,
  children,
  "aria-describedby": describedBy,
  ...rest
}: SelectProps) {
  const errorId = `${id}-error`;

  const finalDescribedBy = [
    describedBy,
    error ? errorId : undefined,
  ].filter(Boolean).join(" ") || undefined;

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        ref={ref}
        {...rest}
        className={`select ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={finalDescribedBy}
      >
        {children}
      </select>
      {error && <p id={errorId} className="form-field__error">{error}</p> }
    </div>
  );
}

export default Select
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

  // let finalDescribedBy: string | undefined;

  // if(describedBy && error) {
  //   finalDescribedBy = `${describedBy} ${errorId}`;
  // } else if (describedBy) {
  //   finalDescribedBy = describedBy;
  // } else if (error) {
  //   finalDescribedBy = errorId;
  // }

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input 
        id={id}
        ref={ref}
        {...rest}
        className={`input ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={finalDescribedBy}
      />
      {error && <p id={`${id}-error`} className="form-field__error">{error}</p>}
    </div>
  );
}

export default Input
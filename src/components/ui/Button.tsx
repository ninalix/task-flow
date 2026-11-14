type ButtonProps = {
  variant?: "primary" | "secondary" | "danger";
} & React.ComponentPropsWithRef<"button">;

function Button({
  variant="primary",
  className="",
  children,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button 
      type={rest.type ?? "button"}
      ref={ref}
      className={`button button-${variant} ${className}`.trim()} 
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button
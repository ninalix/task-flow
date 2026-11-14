export type BadgeProps = {
  variant?: "success" | "warning" | "danger" | "neutral"
} & React.ComponentPropsWithRef<"span">;

function Badge({
  variant="neutral",
  className="",
  children,
  ref,
  ...rest
}: BadgeProps) {
  return (
    <span 
      ref={ref} 
      className={`badge badge-${variant} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Badge
export default function Button({
children,
variant = "primary",
size = "md",
type = "button",
onClick,
className = "",
disabled = false,
}) {
return (
<button
type={type}
onClick={onClick}
disabled={disabled}
className={`btn btn-${variant} btn-${size} ${disabled ? "btn-disabled" : ""} ${className}`}
>
{children} </button>
);
}

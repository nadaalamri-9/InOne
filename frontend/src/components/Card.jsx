export default function Card({
  children,
  variant = "glass",
  padding = "md",
  hover = false,
  className = "",
}) {
  return (
    <div
      className={`card card-${variant} card-${padding} ${
        hover ? "card-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
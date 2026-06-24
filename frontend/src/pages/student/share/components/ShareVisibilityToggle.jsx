import { Globe, Lock } from "lucide-react";
const OPTIONS = [
  {
    value: "private",
    icon: Lock,
    title: "Private portfolio",
    description: "Only people you share this private link with can open it.",
  },
  {
    value: "public",
    icon: Globe,
    title: "Public portfolio",
    description: "Anyone with the link can view your published portfolio.",
  },
];

function ShareVisibilityToggle({ visibility, onChange, disabled }) {
  return (
    <div className="share-toggle" role="radiogroup" aria-label="Portfolio visibility">
      {OPTIONS.map(({ value, icon: Icon, title, description }) => {
        const active = visibility === value;

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(value)}
            className={`share-toggle-option share-toggle-${value} ${active ? "is-active" : ""}`}
          >
            <span className="share-toggle-icon">
              <Icon aria-hidden="true" />
            </span>
            <span className="share-toggle-text">
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <span className="share-toggle-check" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

export default ShareVisibilityToggle;

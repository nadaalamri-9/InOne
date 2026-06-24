import { Award, Briefcase, Check, Code2, Download, ExternalLink, FileText, GraduationCap, Link as LinkIcon, Lock, Mail, MapPin, MessageSquare, Phone, Sparkles, User, Users } from "lucide-react";
const icons = {
  user: User,
  sparkles: Sparkles,
  briefcase: Briefcase,
  graduation: GraduationCap,
  award: Award,
  file: FileText,
  message: MessageSquare,
  lock: Lock,
  map: MapPin,
  phone: Phone,
  mail: Mail,
  link: LinkIcon,
  external: ExternalLink,
  download: Download,
  code: Code2,
  users: Users,
  check: Check,
  linkedin: LinkIcon,
  github: Code2,
  globe: LinkIcon,
};

function PortfolioCard({ title, eyebrow, action, children, className = "", id, icon = "sparkles" }) {
  const Icon = icons[icon] || Sparkles;

  return (
    <section id={id} className={`portfolio-card ${className}`.trim()}>
      {(title || eyebrow || action) && (
        <div className="portfolio-card-header">
          <div className="portfolio-card-title-row">
            {title && (
              <span className="portfolio-section-icon" aria-hidden="true">
                <Icon className="portfolio-icon" size={22} strokeWidth={2.2} />
              </span>
            )}
            <div>
              {eyebrow && <p className="portfolio-eyebrow">{eyebrow}</p>}
              {title && <h2>{title}</h2>}
            </div>
          </div>
          {action && <div className="portfolio-card-action">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export default PortfolioCard;

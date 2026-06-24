import { Briefcase, Check } from "lucide-react";
function TargetRolesSection({ profile }) {
  const targetRoles = Array.isArray(profile.targetRoles) ? profile.targetRoles : [];

  return (
    <section className="target-roles-card" id="target-roles">
      <div className="section-title-row">
        <span className="section-icon-box">
          <Briefcase className="portfolio-icon" size={28} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2>Target Roles</h2>
      </div>

      {targetRoles.length > 0 ? (
        <div className="target-roles-list">
          {targetRoles.map((role) => (
            <span className="target-role-pill" key={role}>
              <Check className="portfolio-icon" size={15} strokeWidth={2.2} aria-hidden="true" />
              {role}
            </span>
          ))}
        </div>
      ) : (
        <div className="portfolio-empty-slot">No target roles yet</div>
      )}
    </section>
  );
}

export default TargetRolesSection;

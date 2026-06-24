import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Star,
  UserRound,
  X,
} from "lucide-react";
import ToastMessage from "../../components/ToastMessage";

import {
  getAdminUsers,
  updateAdminUser,
  getStoredEmployeeOfTheMonth,
  saveEmployeeOfTheMonth,
} from "./adminApi";

const ROLE_OPTIONS = ["Student", "Career Coach", "Employer"];
const STATUS_OPTIONS = ["Active", "Inactive"];

function normalizeRole(role = "") {
  const value = String(role).toLowerCase().replace("_", " ").trim();

  if (value === "student") return "Student";
  if (value === "career coach" || value === "coach") return "Career Coach";
  if (value === "employer") return "Employer";
  if (value === "admin") return "Admin";

  return "Student";
}

function getRoleForApi(role = "") {
  const value = normalizeRole(role);

  if (value === "Career Coach") return "coach";
  return value.toLowerCase();
}

function normalizeStatus(user = {}) {
  if (user.status) {
    const value = String(user.status).toLowerCase();

    if (value === "inactive") return "Inactive";
    if (value === "suspended") return "Inactive";
    return "Active";
  }

  if (user.is_active === false || user.isActive === false) return "Inactive";

  return "Active";
}

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getRoleClass(role = "") {
  return String(role).toLowerCase().replace(/\s+/g, "-");
}

function EmployeeMonthCard({ user, selected, onToggle }) {
  const disabled = !(user?.role === "Career Coach" || user?.role === "Employer");

  return (
    <div className="admin-edit-employee-month-card">
      <div className="admin-edit-employee-month-head">
        <span>Employee of the Month</span>
        <button
          type="button"
          className={`admin-edit-employee-month-star ${selected ? "active" : ""}`}
          onClick={() => onToggle(!selected)}
          disabled={disabled}
          aria-label={selected ? "Remove employee of the month" : "Set employee of the month"}
        >
          <Star aria-hidden="true" />
        </button>
      </div>

      <div className="admin-edit-employee-month-user">
        <div className="admin-edit-employee-month-avatar" aria-hidden="true">
          {user?.avatar ? (
            <img src={user.avatar} alt="" />
          ) : (
            <span>{getInitials(user?.name || "Employee")}</span>
          )}
        </div>

        <div>
          <h4>{user?.name || "Employee"}</h4>
          <p>{disabled ? "Available for Employers and Career Coaches only" : user.role}</p>

          <div className="admin-edit-employee-month-stars" aria-hidden="true">
            <Star />
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminEditUserPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [, setUsers] = useState([]);
  const [form, setForm] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getAdminUsers().then((loadedUsers) => {
      setUsers(loadedUsers);

      const found = loadedUsers.find((user) => String(user.id) === String(userId));

      setForm(
        found
          ? {
              id: found.id,
              name:
                found.name ||
                found.full_name ||
                `${found.first_name || ""} ${found.last_name || ""}`.trim() ||
                "",
              email: found.email || "",
              role: normalizeRole(found.role),
              status: normalizeStatus(found),
              city: found.city || found.location || "",
              phone: found.phone || "",
              password: "",
              avatar: found.avatar || found.photoUrl || found.photo_url || "",
              isEmployeeOfTheMonth:
                String(getStoredEmployeeOfTheMonth()?.id) === String(found.id),
              path: found.path || "/admin/users",
            }
          : null
      );
    });
  }, [userId]);

  const pageTitle = useMemo(() => form?.name || "Edit user", [form]);

  function updateField(field, value) {
    setForm((current) => {
      if (!current) return current;

      if (field === "role" && value === "Student") {
        return { ...current, role: value, isEmployeeOfTheMonth: false };
      }

      return { ...current, [field]: value };
    });
  }

  function handleCancel() {
    setToast({ type: "info", text: "Changes cancelled." });
    window.setTimeout(() => navigate("/admin/users"), 650);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form) return;

    try {
      const nameParts = form.name.trim().split(/\s+/);
      const updatedUser = await updateAdminUser(userId, {
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(" ") || "",
        email: form.email.trim(),
        role: getRoleForApi(form.role),
        is_active: form.status !== "Inactive",
        location: form.city.trim(),
        city: form.city.trim(),
        phone: form.phone.trim(),
      });

      if (form.isEmployeeOfTheMonth) {
        saveEmployeeOfTheMonth({
          id: updatedUser?.id || form.id,
          name: form.name,
          role: form.role,
          avatar:
            form.avatar ||
            updatedUser?.avatar ||
            updatedUser?.photoUrl ||
            updatedUser?.photo_url ||
            "",
        });
      } else {
        const currentEmployee = getStoredEmployeeOfTheMonth();

        if (currentEmployee && String(currentEmployee.id) === String(form.id)) {
          saveEmployeeOfTheMonth(null);
        }
      }

      setUsers((prev) =>
        prev.map((u) =>
          String(u.id) === String(userId) ? { ...u, ...updatedUser } : u
        )
      );

      window.dispatchEvent(new Event("account-settings-updated"));
      window.dispatchEvent(new Event("inone-admin-data-updated"));
      setToast({
        type: "success",
        text: `${form.name.trim() || "User"} updated successfully.`,
      });
    } catch (err) {
      setToast({ type: "error", text: err?.message || "Failed to update user." });
    }
  }

  if (!form) {
    return (
      <div className="admin-page">
        <button type="button" className="admin-soft-btn" onClick={() => navigate("/admin/users")}>
          <ArrowLeft size={16} />
          Back
        </button>
        <section className="admin-empty">User not found.</section>
      </div>
    );
  }

  return (
    <div className="admin-page admin-edit-user-page">
      <ToastMessage toast={toast} onClose={() => setToast(null)} />

      <header className="admin-page-header admin-edit-topbar">
        <div className="admin-page-heading admin-edit-heading">
          <button
            type="button"
            className="admin-edit-back"
            onClick={() => navigate("/admin/users")}
            aria-label="Back to users"
          >
            <ArrowLeft aria-hidden="true" />
          </button>

          <div>
            <h1>Edit User</h1>
            <p>Update {pageTitle}'s account information, role, and access status.</p>
          </div>
        </div>

        <div className="admin-edit-actions admin-edit-header-actions">
          <button type="button" className="admin-soft-btn admin-edit-cancel" onClick={handleCancel}>
            <X size={16} />
            Cancel
          </button>
          <button type="submit" form="admin-edit-user-form" className="admin-primary-btn admin-edit-save">
            <Save size={16} />
            Save changes
          </button>
        </div>
      </header>

      <section className="admin-edit-user-card">
        <form id="admin-edit-user-form" className="admin-edit-layout-form" onSubmit={handleSubmit}>
          <section className="admin-edit-panel admin-account-panel" aria-label="Account information">
            <div className="admin-selected-user-inline">
              <div className="admin-selected-avatar-inline" aria-hidden="true">
                {form.avatar ? <img src={form.avatar} alt="" /> : getInitials(form.name)}
              </div>
              <div className="admin-selected-user-copy">
                <span>Selected user</span>
                <h2>{form.name || "User"}</h2>
                <p className="admin-selected-user-email">{form.email || "No email added"}</p>
              </div>
              <span className={`admin-selected-role-pill role-${getRoleClass(form.role)}`}>
                {form.role}
              </span>
            </div>

            <div className="admin-edit-section-title">
              <h3>Account information</h3>
            </div>

            <label className="admin-edit-field">
              <span className="admin-edit-label-with-icon">
                <UserRound className="admin-edit-field-icon" aria-hidden="true" />
                Full name
              </span>
              <input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Full name" />
            </label>

            <label className="admin-edit-field">
              <span className="admin-edit-label-with-icon">
                <Mail className="admin-edit-field-icon" aria-hidden="true" />
                Email
              </span>
              <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="Email" />
            </label>

            <label className="admin-edit-field">
              <span className="admin-edit-label-with-icon">
                <MapPin className="admin-edit-field-icon" aria-hidden="true" />
                City
              </span>
              <input value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="City" />
            </label>

            <label className="admin-edit-field">
              <span className="admin-edit-label-with-icon">
                <Phone className="admin-edit-field-icon" aria-hidden="true" />
                Phone number
              </span>
              <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Phone number" />
            </label>

            <label className="admin-edit-field">
              <span className="admin-edit-label-with-icon">
                <LockKeyhole className="admin-edit-field-icon" aria-hidden="true" />
                Password
              </span>
              <input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} placeholder="Leave empty to keep current password" />
            </label>
          </section>

          <aside className="admin-edit-panel admin-access-panel" aria-label="Role and access">
            <div className="admin-edit-section-title">
              <h3>Role & access</h3>
            </div>

            <label className="admin-edit-field">
              <span className="admin-edit-label-with-icon">
                <ShieldCheck className="admin-edit-field-icon" aria-hidden="true" />
                Role
              </span>

              <select value={form.role} onChange={(event) => updateField("role", event.target.value)}>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-edit-field">
              <span className="admin-edit-label-with-icon">
                <Building2 className="admin-edit-field-icon" aria-hidden="true" />
                Status
              </span>

              <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            {form.role !== "Student" ? (
              <EmployeeMonthCard
                user={form}
                selected={Boolean(form?.isEmployeeOfTheMonth)}
                onToggle={(value) => updateField("isEmployeeOfTheMonth", value)}
              />
            ) : null}
          </aside>
        </form>
      </section>
    </div>
  );
}

export default AdminEditUserPage;

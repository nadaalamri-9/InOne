import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";

import { mediaUrl } from "../../services/api";
import { getAdminDashboardData, getStoredEmployeeOfTheMonth } from "./adminApi";
function getInitials(name) {
  return (
    String(name || "User")
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

function AdminTopStat({ label, value, icon: Icon }) {
  return (
    <article className="admin-visual-stat-card">
      <span className="admin-visual-stat-icon">
        <Icon aria-hidden="true" />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function RolePill({ role }) {
  const key = String(role || "").toLowerCase().replace(/\s+/g, "-");
  return <span className={`admin-role-pill admin-role-${key}`}>{role}</span>;
}

function getRoleCount(data, key, fallback) {
  return data.roleCounts?.[key] ?? data.stats?.[key] ?? fallback;
}

function EmployeeBadge({ active }) {
  return (
    <div className="admin-employee-one-star" aria-label={active ? "Employee of the month selected" : "No employee selected"}>
      <Star aria-hidden="true" className={active ? "admin-star-filled" : "admin-star-muted"} />
    </div>
  );
}




function AdminDashboardPage() {
  const [data, setData] = useState({ users: [], projects: [], stats: {} });

useEffect(() => {
  let isMounted = true;

  function loadDashboard() {
    getAdminDashboardData().then((payload) => {
      const employeeOfTheMonth = getStoredEmployeeOfTheMonth();

      if (isMounted) {
        setData({
          ...payload,
          employeeOfTheMonth,
        });
      }
    });
  }

  loadDashboard();

  window.addEventListener("inone-admin-data-updated", loadDashboard);
  window.addEventListener("storage", loadDashboard);

  return () => {
    isMounted = false;
    window.removeEventListener("inone-admin-data-updated", loadDashboard);
    window.removeEventListener("storage", loadDashboard);
  };
}, []);

  const users = useMemo(() => {
    return (data.users || [])
      .map((user) => ({
        ...user,
        joined: user.joined || "Today",
        avatar: user.avatar || getInitials(user.name),
      }))
      .slice(0, 5);
  }, [data.users]);



  const roleCounts = {
    students: getRoleCount(data, "students", 0),
    coaches: getRoleCount(data, "coaches", 0),
    employers: getRoleCount(data, "employers", 0),
    admins: getRoleCount(data, "admins", 0),
  };

  const platformTotal =
    roleCounts.students +
    roleCounts.coaches +
    roleCounts.employers +
    roleCounts.admins;

  const platformRoles = [
    { key: "students", label: "Students", value: roleCounts.students },
    { key: "coaches", label: "Career Coaches", value: roleCounts.coaches },
    { key: "employers", label: "Employers", value: roleCounts.employers },
    { key: "admins", label: "Admins", value: roleCounts.admins },
  ];

  const dominantRole = platformTotal
    ? [...platformRoles].sort((a, b) => b.value - a.value)[0]
    : { key: "none", label: "No users", value: 0 };

  const dominantPercent = platformTotal
    ? Math.round((dominantRole.value / platformTotal) * 100)
    : 0;

  const studentDeg = platformTotal ? Math.round((roleCounts.students / platformTotal) * 180) : 0;
  const coachDeg = studentDeg + (platformTotal ? Math.round((roleCounts.coaches / platformTotal) * 180) : 0);
  const employerDeg = coachDeg + (platformTotal ? Math.round((roleCounts.employers / platformTotal) * 180) : 0);

  const stats = [
    {
      label: "Total Users",
      value: platformTotal,
      icon: ShieldCheck,
    },
    {
      label: "Students",
      value: roleCounts.students,
      icon: UsersRound,
    },
    {
      label: "Employers",
      value: roleCounts.employers,
      icon: UserRound,
    },
    {
      label: "Career Coaches",
      value: roleCounts.coaches,
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <div className="admin-page admin-dashboard-visual">
      <header className="admin-page-header admin-visual-header">
        <div className="admin-page-heading admin-visual-heading">
          <h1>My dashboard</h1>
          <p>Review and manage student portfolios, users, and platform activity.</p>
        </div>

      </header>

      <section className="admin-visual-stats" aria-label="Admin statistics">
        {stats.map((stat) => (
          <AdminTopStat key={stat.label} {...stat} />
        ))}
      </section>

      <div className="admin-visual-grid">
        <section className="admin-visual-users-card">
          <div className="admin-visual-users-header">
            <h2>Recent Users</h2>
            <Link className="admin-recent-view-link" to="/admin/users">
              View
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="admin-users-table" role="table" aria-label="Recent users">
            <div className="admin-users-table-row admin-users-table-head" role="row">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Joined</span>
            </div>

            {users.length ? (
              users.map((user, index) => (
                <div className="admin-users-table-row" role="row" key={user.id || user.email}>
                  <div className="admin-table-user">
                    <span className={`admin-table-avatar admin-table-avatar-${index % 3}`}>
                      {typeof user.avatar === "string" && user.avatar.startsWith("http") ? (
                        <img src={user.avatar} alt="" />
                      ) : (
                        user.avatar || getInitials(user.name)
                      )}
                    </span>
                    <strong>{user.name}</strong>
                  </div>
                  <span>{user.email}</span>
                  <RolePill role={user.role} />
                  <span>{user.joined}</span>
                </div>
              ))
            ) : (
              <div className="admin-users-table-row admin-users-empty-row" role="row">
                <span>No users from backend yet.</span>
              </div>
            )}
          </div>
        </section>

        <aside className="admin-visual-side">
          <section className="admin-side-widget admin-employee-widget">
            <h2>Employee of the Month</h2>

            <div className="admin-employee-photo">
              {data.employeeOfTheMonth?.avatar || data.employeeOfTheMonth?.photoUrl || data.employeeOfTheMonth?.photo_url ? (
                <img src={mediaUrl(data.employeeOfTheMonth.avatar || data.employeeOfTheMonth.photoUrl || data.employeeOfTheMonth.photo_url)} alt="" />
              ) : (
                <span>{getInitials(data.employeeOfTheMonth?.name || "Employee")}</span>
              )}
            </div>

            <h3>{data.employeeOfTheMonth?.name || "No employee selected yet"}</h3>
            <EmployeeBadge active={Boolean(data.employeeOfTheMonth?.id)} />
            <p className="admin-top-coach-score">
              {data.employeeOfTheMonth?.id
                ? `${data.employeeOfTheMonth.role} · Selected by Admin`
                : "Set one employer or career coach from Edit User."}
            </p>
          </section>

          <section className="admin-side-widget admin-platform-gauge-widget">
            <h2>Platform Users</h2>

            <div
              className="admin-platform-gauge"
              style={{
                "--students-deg": `${studentDeg}deg`,
                "--coaches-deg": `${coachDeg}deg`,
                "--employers-deg": `${employerDeg}deg`,
              }}
            >
              <span aria-hidden="true" />
              <strong>{dominantPercent}%</strong>
            </div>

            <div className="admin-platform-legend">
              {platformRoles.map((role) => (
                <span key={role.key}>
                  <i className={`admin-dot-${role.key}`} />
                  {role.label} <b>{role.value}</b>
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default AdminDashboardPage;

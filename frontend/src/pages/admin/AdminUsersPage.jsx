import { useEffect, useMemo, useState } from "react";
import { Edit3, Search, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import ToastMessage from "../../components/ToastMessage";

import { getAdminUsers, deleteUser } from "./adminApi";
function getRoleKey(role) {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function getStatusKey(status) {
  return String(status || "Active")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function getInitials(name) {
  return (
    String(name || "User")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

function UserAvatar({ user }) {
  if (user.avatar && (String(user.avatar).startsWith("http") || String(user.avatar).startsWith("data:"))) {
    return <img src={user.avatar} alt="" />;
  }

  return user.avatar || getInitials(user.name);
}

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    function loadUsers() {
      getAdminUsers().then(setUsers);
    }

    loadUsers();
    window.addEventListener("inone-admin-data-updated", loadUsers);
    window.addEventListener("storage", loadUsers);

    return () => {
      window.removeEventListener("inone-admin-data-updated", loadUsers);
      window.removeEventListener("storage", loadUsers);
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) =>
      [user.name, user.email, user.role, user.status, user.city, user.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [search, users]);

  async function handleDelete() {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      setToast({ type: "success", text: `${userToDelete.name || "User"} deleted successfully.` });
    } catch (err) {
      setToast({ type: "error", text: err?.message || "Failed to delete user." });
    } finally {
      setUserToDelete(null);
    }
  }

  return (
    <div className="admin-page admin-users-page admin-users-table-page">
      <ToastMessage toast={toast} onClose={() => setToast(null)} />
      <header className="admin-page-header">
        <div className="admin-page-heading">
          <h1>Users</h1>
          <p>Review platform users and open the matching role dashboard.</p>
        </div>

        <div className="admin-header-actions">
          <label className="admin-search-box admin-users-search-box">
            <Search aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users"
            />
          </label>
        </div>
      </header>

      <section className="admin-users-table-card">
        <div className="admin-users-table-header">
          <div>
            <h2>Platform users</h2>
          </div>
        </div>

        <div className="admin-management-table" role="table" aria-label="Platform users">
          <div className="admin-management-table-row admin-management-table-head" role="row">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>

          {filteredUsers.length ? (
            filteredUsers.map((user) => (
              <div className="admin-management-table-row" role="row" key={user.id}>
                <div className="admin-table-user">
                  <span className="admin-table-avatar admin-management-avatar">
                    <UserAvatar user={user} />
                  </span>
                  <strong>{user.name}</strong>
                </div>

                <span className="admin-table-email">{user.email}</span>

                <span className={`admin-badge admin-role-user-badge admin-role-user-${getRoleKey(user.role)}`}>
                  {user.role}
                </span>

                <span className={`admin-badge admin-status-badge admin-status-${getStatusKey(user.status)}`}>
                  {user.status || "Active"}
                </span>

                <span>{user.joined || "Today"}</span>

                <div className="admin-management-actions">
                  <Link className="admin-soft-btn admin-action-btn" to={`/admin/users/${user.id}/edit`}>
                    <Edit3 aria-hidden="true" />
                    Edit
                  </Link>

                  {user.role !== "Admin" ? (
                    <button
                      type="button"
                      className="admin-delete-btn admin-action-btn"
                      onClick={() => setUserToDelete(user)}
                    >
                      <Trash2 aria-hidden="true" />
                      Delete
                    </button>
                  ) : (
                    <span className="admin-action-spacer" aria-hidden="true" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="admin-management-table-row admin-management-empty-row" role="row">
              <span>No users match your search.</span>
            </div>
          )}
        </div>
      </section>

      {userToDelete ? (
        <div className="projects-delete-modal-backdrop admin-user-delete-modal-backdrop" role="presentation">
          <section
            className="projects-delete-modal admin-user-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-delete-modal-title"
          >
            <button
              type="button"
              className="projects-delete-modal-close admin-user-delete-modal-close"
              onClick={() => setUserToDelete(null)}
              aria-label="Close delete confirmation"
            >
              <X className="projects-delete-close-icon" aria-hidden="true" />
            </button>

            <div className="projects-delete-modal-icon-wrap admin-user-delete-icon-wrap">
              <Trash2 className="projects-delete-modal-icon" aria-hidden="true" />
            </div>

            <h2 id="admin-delete-modal-title">Delete this user?</h2>
            <p>Once deleted, this user account and access details will be removed from the platform.</p>

            <div className="projects-delete-preview-card admin-user-delete-preview-card">
              <div className="projects-delete-preview-top">
                <strong>{userToDelete.name || "Unnamed user"}</strong>

                <div className="projects-delete-status-date admin-user-delete-preview-meta">
                  <span className={`admin-badge admin-role-user-badge admin-role-user-${getRoleKey(userToDelete.role)}`}>
                    {userToDelete.role || "User"}
                  </span>
                  <strong>{userToDelete.email || "No email added"}</strong>
                </div>
              </div>
            </div>

            <div className="projects-delete-modal-actions admin-user-delete-modal-actions">
              <button type="button" className="projects-delete-no-btn" onClick={() => setUserToDelete(null)}>
                No
              </button>
              <button type="button" className="projects-delete-yes-btn" onClick={handleDelete}>
                Yes, delete
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default AdminUsersPage;

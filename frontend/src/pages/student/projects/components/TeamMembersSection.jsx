import { useState } from "react";
import { CheckCircle2, Search, Trash2, UserPlus, UsersRound } from "lucide-react";

import EmailIcon from "../../../../assets/Email.svg";
import ProfilePic from "../../../../assets/ProfilePic.svg";
import { makeProjectTempId } from "../services/projectApi";
import { searchUserByEmail } from "../services/usersApi";
const USE_MOCK_USER_SEARCH = false;

function isValidEmail(value) {
  const email = String(value || "").trim();

  if (!email) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeTeamMembers(teamMembers) {
  if (!Array.isArray(teamMembers)) return [];

  return teamMembers.map((member) => ({
    id: member.id ?? null,
    tempId: member.tempId ?? makeProjectTempId(),
    userId: member.userId ?? member.user_id ?? member.memberUserId ?? null,
    name: member.name ?? member.fullName ?? member.full_name ?? "",
    email: member.email ?? member.member_email ?? "",
    photoUrl: member.photoUrl ?? member.photo_url ?? "",
    role: member.role ?? "Student",
  }));
}

function TeamMembersSection({
  teamMembers = [],
  isSoloProject = false,
  onChange,
  onSoloChange,
  onNotify,
  errors = {},
  isEditing,
}) {
  const safeTeamMembers = normalizeTeamMembers(teamMembers);
  const soloProject = Boolean(isSoloProject);

  const [emailInput, setEmailInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [foundUser, setFoundUser] = useState(null);

  const resetSearchResult = () => {
    setFoundUser(null);
    setSearchError("");
  };

  const handleSoloProjectChange = (event) => {
    if (!isEditing) return;

    const checked = event.target.checked;

    onSoloChange?.(checked);
    resetSearchResult();
    setEmailInput("");

    if (checked) {
      onChange?.([]);
      onNotify?.("info", "Solo project");
    } else {
      onNotify?.("info", "Add members by email");
    }
  };

  const searchMember = async () => {
    if (soloProject) return;

    const email = emailInput.trim().toLowerCase();

    setFoundUser(null);
    setSearchError("");

    if (!isValidEmail(email)) {
      setSearchError("Invalid email");
      return;
    }

    const memberAlreadyAdded = safeTeamMembers.some(
      (member) => String(member.email || "").toLowerCase() === email
    );

    if (memberAlreadyAdded) {
      setSearchError("Member already added");
      return;
    }

    try {
      setSearching(true);
      const user = await searchUserByEmail(email, USE_MOCK_USER_SEARCH);

      if (!user) {
        setSearchError("Not found");
        return;
      }

      setFoundUser({
        id: null,
        tempId: makeProjectTempId(),
        userId: user.userId,
        name: user.name || user.email,
        email: user.email,
        photoUrl: user.photoUrl || "",
        role: user.role || "Student",
      });
    } catch (error) {
      console.error(error);

      if (error.status === 400) {
        setSearchError("Cannot add yourself");
      } else {
        setSearchError("Search failed");
      }
    } finally {
      setSearching(false);
    }
  };

  const addFoundMember = () => {
    if (!foundUser) return;

    const memberAlreadyAdded = safeTeamMembers.some(
      (member) =>
        (foundUser.userId && member.userId === foundUser.userId) ||
        String(member.email || "").toLowerCase() ===
        String(foundUser.email || "").toLowerCase()
    );

    if (memberAlreadyAdded) {
      setSearchError("Member already added");
      return;
    }

    onSoloChange?.(false);
    onChange?.([...safeTeamMembers, foundUser]);
    setEmailInput("");
    resetSearchResult();
    onNotify?.("success", "Added");
  };

  const removeTeamMember = (index) => {
    if (!isEditing) return;

    const updatedMembers = safeTeamMembers.filter(
      (_, memberIndex) => memberIndex !== index
    );

    onChange?.(updatedMembers);

    if (updatedMembers.length === 0) {
      onSoloChange?.(true);
    }

    onNotify?.("info", "Removed");
  };

  return (
    <section className="project-section-card team-members-card">
      <h2 className="project-section-title">
        <UsersRound className="project-title-icon" aria-hidden="true" />
        Team members
      </h2>

      <p className="team-members-helper-text">
        Add team members or mark it as a solo project
      </p>

      {isEditing && (
        <label className="team-solo-toggle-row">
          <input
            type="checkbox"
            checked={soloProject}
            onChange={handleSoloProjectChange}
          />
          <span className="team-solo-toggle-box" aria-hidden="true">
            <CheckCircle2 className="team-solo-toggle-icon" />
          </span>
          <span className="team-solo-toggle-text">Solo</span>
        </label>
      )}

      {soloProject ? (
        !isEditing ? (
          <div className="team-members-solo-pill">
            <CheckCircle2 className="team-members-solo-pill-icon" aria-hidden="true" />
            <span>Solo project</span>
          </div>
        ) : null
      ) : (
        <>
          {isEditing && (
            <div className="team-member-search-area">
              <div className="team-member-search-row">
                <div className="team-member-search-input-wrapper">
                  <img src={EmailIcon} alt="" className="team-member-search-icon" />

                  <input
                    type="email"
                    className="team-member-search-input"
                    value={emailInput}
                    onChange={(event) => {
                      setEmailInput(event.target.value);
                      resetSearchResult();
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        searchMember();
                      }
                    }}
                    placeholder="Search by email"
                  />
                </div>

                <button
                  type="button"
                  className="team-member-search-btn"
                  onClick={searchMember}
                  disabled={searching}
                  aria-label={searching ? "Searching student" : "Search student"}
                  title={searching ? "Searching..." : "Search"}
                >
                  <Search className="team-member-search-btn-icon" aria-hidden="true" />
                </button>
              </div>

              {searchError && (
                <span className="team-member-search-error">{searchError}</span>
              )}

              {foundUser && (
                <div className="team-member-result-card">
                  <img
                    src={foundUser.photoUrl || ProfilePic}
                    alt=""
                    className="team-member-result-avatar"
                  />

                  <div className="team-member-result-info">
                    <strong>{foundUser.name}</strong>
                    <span>{foundUser.email}</span>
                  </div>

                  <button
                    type="button"
                    className="team-member-result-add-btn"
                    onClick={addFoundMember}
                  >
                    <UserPlus className="team-member-result-add-icon" aria-hidden="true" />
                    Add
                  </button>
                </div>
              )}
            </div>
          )}

          {safeTeamMembers.length === 0 && (
            <p className="project-empty-state">No team members added yet</p>
          )}

          <div className="team-members-list">
            {safeTeamMembers.map((member, index) => {
              const memberError = errors?.[index] || "";

              return (
                <div
                  className="team-member-row"
                  key={member.userId ?? member.id ?? member.tempId ?? index}
                >
                  <div className="team-member-info-block">
                    <img
                      src={member.photoUrl || ProfilePic}
                      alt=""
                      className="team-member-avatar"
                    />

                    <div className="team-member-text">
                      <strong>{member.name || "Student"}</strong>
                      <span>{member.email}</span>
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      className="team-member-delete-btn"
                      onClick={() => removeTeamMember(index)}
                      title="Delete team member"
                    >
                      <Trash2 className="team-member-delete-icon" aria-hidden="true" />
                    </button>
                  )}

                  {memberError && (
                    <span className="team-member-error">{memberError}</span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

export default TeamMembersSection;

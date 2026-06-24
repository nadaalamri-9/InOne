import { useEffect, useMemo, useState } from "react";
import { FolderKanban, MessageSquareText, Search, UserRound } from "lucide-react";

import { getCoachStudents } from "./coachApi";
function getInitials(name) {
  return (
    String(name || "Student")
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S"
  );
}

function formatDate(value) {
  if (!value) return "Not updated";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function CoachStudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCoachStudents().then(setStudents);
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;

    return students.filter((student) =>
      [student.name, student.email, student.location, student.role]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [search, students]);

  const totalProjects = students.reduce((total, student) => total + student.projectsCount, 0);
  const totalOpenNotes = students.reduce((total, student) => total + student.openFeedbackCount, 0);

  return (
    <div className="coach-page coach-students-page">
      <header className="coach-page-header">
        <div className="coach-page-heading">
          <h1>Students</h1>
          <p>View assigned students, their project progress, and feedback activity.</p>
        </div>

        <div className="coach-header-actions">
          <label className="coach-search-box">
            <Search aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students"
            />
          </label>
        </div>
      </header>

      <section className="coach-grid-3" aria-label="Students overview">
        <article className="coach-stat-card">
          <div className="coach-stat-icon"><UserRound /></div>
          <div><p>Students</p><strong>{students.length}</strong></div>
        </article>
        <article className="coach-stat-card">
          <div className="coach-stat-icon"><FolderKanban /></div>
          <div><p>Projects</p><strong>{totalProjects}</strong></div>
        </article>
        <article className="coach-stat-card">
          <div className="coach-stat-icon"><MessageSquareText /></div>
          <div><p>Open Notes</p><strong>{totalOpenNotes}</strong></div>
        </article>
      </section>

      <section className="coach-card coach-students-table-card">
        <div className="coach-projects-table-header">
          <div>
            <h2>Assigned students</h2>
          </div>
        </div>

        <div className="coach-students-table" role="table" aria-label="Assigned students">
          <div className="coach-students-table-row coach-students-table-head" role="row">
            <span>Student</span>
            <span>Email</span>
            <span>Projects</span>
            <span>Feedback</span>
            <span>Last update</span>
          </div>

          {filteredStudents.length ? (
            filteredStudents.map((student) => (
              <div className="coach-students-table-row" role="row" key={student.id || student.email}>
                <div className="coach-student-cell">
                  <span className="coach-student-avatar">
                    {student.photoUrl ? <img src={student.photoUrl} alt="" /> : getInitials(student.name)}
                  </span>
                  <div>
                    <strong>{student.name}</strong>
                    <small>{student.location}</small>
                  </div>
                </div>

                <span className="coach-student-email">{student.email}</span>

                <div className="coach-student-stat-stack">
                  <strong>{student.projectsCount}</strong>
                  <small>{student.readyCount} ready · {student.publishedCount} published</small>
                </div>

                <div className="coach-student-stat-stack">
                  <strong>{student.feedbackCount}</strong>
                  <small>{student.openFeedbackCount} open</small>
                </div>

                <span>{formatDate(student.lastUpdated)}</span>

              </div>
            ))
          ) : (
            <div className="coach-students-empty">
              No students found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CoachStudentsPage;

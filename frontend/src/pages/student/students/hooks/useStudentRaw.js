import { useEffect, useState } from "react";
import { getStudentRaw } from "../services/studentsApi";

// Loads a student's RAW record (profile + projects) for the portfolio and
// project views. Private students come back with name + visibility only.
export function useStudentRaw(studentId) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setNotFound(false);
        const found = await getStudentRaw(studentId);
        if (!isMounted) return;
        if (!found) setNotFound(true);
        setStudent(found);
      } catch (error) {
        console.error(error);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [studentId]);

  return { student, loading, notFound };
}

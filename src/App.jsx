import { useEffect, useState } from "react";
import axios from "axios";
import Jobs from "./Jobs";
import Students from "./Students";
import Applications from "./Applications";

export default function App() {
  const [tab, setTab] = useState("jobs");
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");

  const loadStudents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/student/get`);
      if (res.data.length > 0 && !studentId) {
        setStudentId(res.data[0].id);
      }
    } catch (e) {
      console.log("Cannot load students");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div className="container">
      <h1>Job &amp; Placement Management System</h1>

      <div className="tabs">
        <button className={tab === "jobs" ? "active" : ""} onClick={() => setTab("jobs")}>
          Jobs
        </button>
        <button className={tab === "students" ? "active" : ""} onClick={() => setTab("students")}>
          Students
        </button>
        <button className={tab === "applications" ? "active" : ""} onClick={() => setTab("applications")}>
          Applications
        </button>
      </div>

      {tab === "jobs" && (
        <div className="card">
          <label>Applying as student: </label>
          <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            {students.length === 0 && <option value="">No students - add one first</option>}
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || "(no name)"} (id {s.id})
              </option>
            ))}
          </select>
        </div>
      )}

      {tab === "jobs" && <Jobs studentId={studentId} />}
      {tab === "students" && <Students students={students} reload={loadStudents} />}
      {tab === "applications" && <Applications />}
    </div>
  );
}
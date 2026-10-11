import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./config";
import Jobs from "./Jobs";
import Students from "./Students";
import Applications from "./Applications";

export default function App() {
  const [tab, setTab] = useState("jobs");
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [status, setStatus] = useState("");

  const loadStudents = async (attempt = 1) => {
    try {
      const res = await axios.get(`${BASE_URL}/student/get`);
      setStudents(res.data);
      setStatus("");
      if (res.data.length > 0) {
        setStudentId((prev) => prev || res.data[0].id);
      }
    } catch (e) {
      console.log("Cannot load students", attempt, e.message, e.response?.status, BASE_URL);
      if (attempt < 6) {
        setStatus("Connecting to server (the free plan can take up to a minute)...");
        setTimeout(() => loadStudents(attempt + 1), 8000);
      } else {
        setStatus("Cannot reach the server. Please refresh the page.");
      }
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

      {status && <p className="error">{status}</p>}

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
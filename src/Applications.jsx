import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/application";
const STATUSES = ["APPLIED", "SHORTLISTED", "INTERVIEW_SCHEDULED", "SELECTED", "REJECTED"];

export default function Applications() {
  const [apps, setApps] = useState([]);

  const load = async () => {
    const res = await axios.get(`${API}/get`);
    setApps(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    await axios.put(`${API}/status/${id}`, null, { params: { status } });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    await axios.delete(`${API}/delete/${id}`);
    load();
  };

  return (
    <div className="card">
      <h2>Applications (Recruiter View)</h2>
      <button onClick={load}>Refresh</button>
      {apps.length === 0 && <p>No applications yet.</p>}
      {apps.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Job</th>
                <th>Company</th>
                <th>Applied On</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id}>
                  <td>{a.student?.name || "(no name)"}</td>
                  <td>{a.job?.title}</td>
                  <td>{a.job?.company}</td>
                  <td>{a.appliedOn}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) => changeStatus(a.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="red" onClick={() => handleDelete(a.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
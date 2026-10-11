import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/student";
const emptyForm = { name: "", email: "", branch: "", cgpa: "", skills: "" };

export default function Students({ students, reload }) {
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and Email are required.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    const data = { ...form, cgpa: form.cgpa === "" ? null : Number(form.cgpa) };
    if (editId) {
      await axios.put(`${API}/update/${editId}`, data);
    } else {
      await axios.post(`${API}/add`, data);
    }
    setForm(emptyForm);
    setEditId(null);
    reload();
  };

  const handleEdit = (s) => {
    setForm({
      name: s.name || "",
      email: s.email || "",
      branch: s.branch || "",
      cgpa: s.cgpa ?? "",
      skills: s.skills || "",
    });
    setEditId(s.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`${API}/delete/${id}`);
      reload();
    } catch (e) {
      alert("Cannot delete this student because they have applications.");
    }
  };

  return (
    <>
      <div className="card">
        <h2>{editId ? "Edit Student" : "Register Student"}</h2>
        <input name="name" placeholder="Name *" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email *" value={form.email} onChange={handleChange} />
        <input name="branch" placeholder="Branch (e.g. ECE)" value={form.branch} onChange={handleChange} />
        <input name="cgpa" type="number" step="0.01" placeholder="CGPA" value={form.cgpa} onChange={handleChange} />
        <input name="skills" placeholder="Skills" value={form.skills} onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSubmit}>{editId ? "Update Student" : "Add Student"}</button>
        {editId && (
          <button
            className="grey"
            onClick={() => {
              setEditId(null);
              setForm(emptyForm);
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <div className="card">
        <h2>Students</h2>
        {students.length === 0 && <p>No students yet.</p>}
        {students.map((s) => (
          <div className="job" key={s.id}>
            <div>
              <h3>{s.name || "(no name)"}</h3>
              <p>
                {s.email} • {s.branch} • CGPA: {s.cgpa}
              </p>
              <p>Skills: {s.skills}</p>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(s)}>Edit</button>
              <button className="red" onClick={() => handleDelete(s.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
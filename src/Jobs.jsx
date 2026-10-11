import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/job";
const APP_API = "http://localhost:8080/application";
const emptyForm = {
  title: "",
  company: "",
  location: "",
  requiredSkills: "",
  salary: "",
};

export default function Jobs({ studentId }) {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");

  const loadJobs = async (search = "") => {
    try {
      const res = await axios.get(`${API}/get`, {
        params: search ? { keyword: search } : {},
      });
      setJobs(res.data);
    } catch (e) {
      setError("Cannot reach the backend. Is it running on port 8080?");
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.company.trim()) {
      setError("Title and Company are required.");
      return;
    }
    setError("");
    if (editId) {
      await axios.put(`${API}/update/${editId}`, form);
    } else {
      await axios.post(`${API}/add`, form);
    }
    setForm(emptyForm);
    setEditId(null);
    loadJobs(keyword);
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      requiredSkills: job.requiredSkills || "",
      salary: job.salary || "",
    });
    setEditId(job.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await axios.delete(`${API}/delete/${id}`);
      loadJobs(keyword);
    } catch (e) {
      alert("Cannot delete this job because students have applied to it.");
    }
  };

  const handleApply = async (jobId) => {
    if (!studentId) {
      alert("Please add a student first, then select the student at the top.");
      return;
    }
    try {
      await axios.post(`${APP_API}/apply`, {
        job: { id: jobId },
        student: { id: Number(studentId) },
      });
      alert("Applied successfully!");
    } catch (e) {
      alert(e.response?.data || "Could not apply.");
    }
  };

  return (
    <>
      <div className="card">
        <h2>{editId ? "Edit Job" : "Post a New Job (Recruiter)"}</h2>
        <input name="title" placeholder="Job Title *" value={form.title} onChange={handleChange} />
        <input name="company" placeholder="Company *" value={form.company} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <input name="requiredSkills" placeholder="Required Skills" value={form.requiredSkills} onChange={handleChange} />
        <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSubmit}>{editId ? "Update Job" : "Add Job"}</button>
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
        <h2>Available Jobs</h2>
        <div className="search">
          <input
            placeholder="Search by job title..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button onClick={() => loadJobs(keyword)}>Search</button>
        </div>

        {jobs.length === 0 && <p>No jobs found.</p>}

        {jobs.map((job) => (
          <div className="job" key={job.id}>
            <div>
              <h3>{job.title}</h3>
              <p>
                {job.company} • {job.location}
              </p>
              <p>Skills: {job.requiredSkills}</p>
              <p>Salary: {job.salary}</p>
            </div>
            <div className="actions">
              <button className="green" onClick={() => handleApply(job.id)}>
                Apply
              </button>
              <button onClick={() => handleEdit(job)}>Edit</button>
              <button className="red" onClick={() => handleDelete(job.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
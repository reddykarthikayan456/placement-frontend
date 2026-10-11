import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "./config";

const API = `${BASE_URL}/student`;
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
    try {
      const data = { ...form, cgpa: form.cgpa === "" ? null : Number(form.cgpa) };
      if (editId) {
        await axios.put(`${API}/update/${editId}`, data);
      } else {
        await axios.post(`${API}/add`, data);
      }
      setForm(emptyForm);
      setEditId(null);
      reload();
    } catch (e) {
      if (e.response) {
        setError("Server error " + e.response.status + ". Check the backend logs.");
      } else {
        setError("Cannot reach the backend. If it is on the free plan, wait a minute and try again.");
      }
    }
  };
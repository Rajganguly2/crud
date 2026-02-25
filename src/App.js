import React, { useState, useEffect } from "react";

function App() {

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: ""
  });

  const [editId, setEditId] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/users");
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await fetch(`http://localhost:5000/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setEditId(null);
    } else {
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
    }

    setFormData({ name: "", age: "", email: "" });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE"
    });
    fetchUsers();
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditId(user.id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>React + MySQL CRUD</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
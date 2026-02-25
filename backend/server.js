const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
  } else {
    console.log("Connected to MySQL");
  }
});

// GET all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

// ADD user
app.post("/users", (req, res) => {
  const { name, age, email } = req.body;
  const sql = "INSERT INTO users (name, age, email) VALUES (?, ?, ?)";
  db.query(sql, [name, age, email], (err, result) => {
    if (err) return res.json(err);
    return res.json("User added");
  });
});

// UPDATE user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, email } = req.body;

  const sql = "UPDATE users SET name=?, age=?, email=? WHERE id=?";
  db.query(sql, [name, age, email, id], (err, result) => {
    if (err) return res.json(err);
    return res.json("User updated");
  });
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id=?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json("User deleted");
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});

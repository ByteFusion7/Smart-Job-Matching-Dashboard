const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Sample data so matches work immediately
let students = [
  { id: "1", name: "Sakshee", skills: ["React", "C++"], gpa: 3.5, workAuth: "Yes" },
  { id: "2", name: "Alice", skills: ["Python", "Machine Learning"], gpa: 3.8, workAuth: "Yes" }
];

let jobs = [
  { id: "101", title: "Frontend Developer", skills: ["React", "CSS"], minGpa: 3.0, workAuth: "Yes" },
  { id: "102", title: "C++ Engineer", skills: ["C++", "STL"], minGpa: 3.2, workAuth: "Yes" },
  { id: "103", title: "Data Scientist", skills: ["Python", "Machine Learning"], minGpa: 3.5, workAuth: "Yes" }
];

// Root route
app.get("/", (req, res) => {
  res.send("Backend is working, Sakshee!");
});

// Add student
app.post("/students", (req, res) => {
  students.push(req.body);
  res.send("Student added");
});

// Add job
app.post("/jobs", (req, res) => {
  jobs.push(req.body);
  res.send("Job added");
});

// Match student to jobs
app.get("/match/:studentId", (req, res) => {
  const student = students.find(s => s.id === req.params.studentId);
  if (!student) return res.status(404).send("Student not found");

  const matches = jobs.map(job => {
    let score = 0;

    // Skills overlap (up to 50 points)
    const overlap = student.skills.filter(s => job.skills.includes(s)).length;
    score += (overlap / job.skills.length) * 50;

    // GPA check (+20 points)
    if (student.gpa >= job.minGpa) score += 20;

    // Work authorization (+30 points)
    if (student.workAuth === job.workAuth) score += 30;

    // Cap at 100
    if (score > 100) score = 100;

    return { job, score: Math.round(score) };
  });

  res.json(matches);
});

// Start server
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});

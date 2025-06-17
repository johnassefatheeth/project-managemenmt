const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect('mongodb+srv://johnassefaforbussines:FYrb4hOVDBySPcEr@cluster0.xrmqg7z.mongodb.net/')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Project Schema
const Project = mongoose.model('Project', {
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  members: [String], // Array of team member names
  milestones: [{
    name: String,
    dueDate: Date,
    status: { type: String, default: 'Not Started' }
  }]
});

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'john-A-pm'; // Replace with a real secret in production

// Signup
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.status(201).send({ message: "User created" });
  } catch (err) {
    res.status(400).send({ error: "Email already exists" });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.send({ token });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// API Routes
app.post('/projects', async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.send(project);
});

app.get('/projects', async (req, res) => {
  const projects = await Project.find();
  res.send(projects);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
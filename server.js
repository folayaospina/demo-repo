const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: 'localhost',
  port: 5445,
  user: 'dev',
  password: 'dev123',
  database: 'tasks_db',
});

// List all tasks
app.get('/tasks', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id');
  res.json(rows);
});

// Create a task
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const { rows } = await pool.query(
    'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
    [title]
  );
  res.status(201).json(rows[0]);
});

// Mark a task as completed
app.patch('/tasks/:id/complete', async (req, res) => {
  const { rows } = await pool.query(
    'UPDATE tasks SET completed = TRUE WHERE id = $1 RETURNING *',
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Task not found' });
  res.json(rows[0]);
});

//List only the pending tasks 
app.get('/tasks/pending', async (req, res) =>{
  const {rows} = await pool.query(
    'SELECT * FROM tasks WHERE completed = FALSE ORDER BY id'
  )
  res.json(rows)
})

app.listen(3000, () => console.log('API ready at http://localhost:3000'));

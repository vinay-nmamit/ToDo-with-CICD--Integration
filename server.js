const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the 'public' folder
const publicPath = path.join(__dirname, 'public');
console.log('Public folder path:', publicPath); // Log the path to check if it's correct
app.use(express.static(publicPath));

// Connect to SQLite database
const db = new sqlite3.Database('./todo.db', (err) => {
    if (err) {
        console.error('Failed to open database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    task TEXT NOT NULL
)`);

// Fetch all tasks
app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Add a new task
app.post('/tasks', (req, res) => {
    const { task } = req.body;
    const id = Date.now().toString();
    db.run('INSERT INTO tasks (id, task) VALUES (?, ?)', [id, task], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id, task });
        }
    });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Task deleted successfully' });
        }
    });
});

// Route for the root ("/") to serve index.html
app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

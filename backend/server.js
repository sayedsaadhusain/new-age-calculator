const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/friends', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM friends ORDER BY name ASC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/friends', async (req, res) => {
    const { name, dob } = req.body;
    if (!name || !dob) {
        return res.status(400).json({ error: 'Name and DOB are required' });
    }
    try {
        const [result] = await db.query('INSERT INTO friends (name, dob) VALUES (?, ?)', [name, dob]);
        res.status(201).json({ id: result.insertId, name, dob });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/friends/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM friends WHERE id = ?', [id]);
        res.json({ message: 'Friend deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

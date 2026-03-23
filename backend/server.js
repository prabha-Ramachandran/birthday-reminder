const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to LOCAL MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/birthdayDB';
mongoose.connect(mongoURI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.log('❌ Error:', err));

// Schema
const birthdaySchema = new mongoose.Schema({
    name: String,
    birthdate: String
});

const Birthday = mongoose.model('Birthday', birthdaySchema);

// ========== ROUTES ==========

// GET all birthdays
app.get('/api/birthdays', async (req, res) => {
    try {
        const birthdays = await Birthday.find();
        res.json(birthdays);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single birthday by ID
app.get('/api/birthdays/:id', async (req, res) => {
    try {
        const birthday = await Birthday.findById(req.params.id);
        if (!birthday) {
            return res.status(404).json({ error: 'Birthday not found' });
        }
        res.json(birthday);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Add new birthday
app.post('/api/birthdays', async (req, res) => {
    try {
        const newBirthday = new Birthday(req.body);
        await newBirthday.save();
        res.status(201).json(newBirthday);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT - Update birthday
app.put('/api/birthdays/:id', async (req, res) => {
    try {
        const updated = await Birthday.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'Birthday not found' });
        }
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE - Remove birthday
app.delete('/api/birthdays/:id', async (req, res) => {
    try {
        const deleted = await Birthday.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Birthday not found' });
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB connection
const mongoURI = 'mongodb+srv://prabha020623_db_user:xUi37zgEhJTrmdIq@birthdaycluster.ghmgagg.mongodb.net/birthdayDB?retryWrites=true&w=majority&appName=BirthdayCluster';

mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error:', err));

// Schema
const birthdaySchema = new mongoose.Schema({
    name: String,
    birthdate: String
});

const Birthday = mongoose.model('Birthday', birthdaySchema);

// API Routes
app.get('/api/birthdays', async (req, res) => {
    try {
        const birthdays = await Birthday.find();
        res.json(birthdays);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/birthdays/:id', async (req, res) => {
    try {
        const birthday = await Birthday.findById(req.params.id);
        if (!birthday) return res.status(404).json({ error: 'Not found' });
        res.json(birthday);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/birthdays', async (req, res) => {
    try {
        const newBirthday = new Birthday(req.body);
        await newBirthday.save();
        res.status(201).json(newBirthday);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/birthdays/:id', async (req, res) => {
    try {
        const updated = await Birthday.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/birthdays/:id', async (req, res) => {
    try {
        await Birthday.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/birthdayDB')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// Birthday Schema
const birthdaySchema = new mongoose.Schema({
    name: String,
    birthdate: String
});

const Birthday = mongoose.model('Birthday', birthdaySchema);

// CREATE - Add new birthday
app.post('/api/birthdays', async (req, res) => {
    try {
        const newBirthday = new Birthday(req.body);
        await newBirthday.save();
        res.status(201).json(newBirthday);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ - Get all birthdays
app.get('/api/birthdays', async (req, res) => {
    try {
        const birthdays = await Birthday.find();
        res.json(birthdays);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE - Edit birthday
app.put('/api/birthdays/:id', async (req, res) => {
    try {
        const updatedBirthday = await Birthday.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedBirthday);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE - Remove birthday
app.delete('/api/birthdays/:id', async (req, res) => {
    try {
        await Birthday.findByIdAndDelete(req.params.id);
        res.json({ message: 'Birthday deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variable for production, or local for development
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/birthdayDB';
mongoose.connect(mongoURI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.log('❌ Error:', err));

const birthdaySchema = new mongoose.Schema({
    name: String,
    birthdate: String
});

const Birthday = mongoose.model('Birthday', birthdaySchema);

app.post('/api/birthdays', async (req, res) => {
    try {
        const newBirthday = new Birthday(req.body);
        await newBirthday.save();
        res.json(newBirthday);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/birthdays', async (req, res) => {
    try {
        const birthdays = await Birthday.find();
        res.json(birthdays);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
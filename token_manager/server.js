global.DEBUG = false;
const express = require('express');
const app = express();
const PORT = 3000;

let tokenCount = 0; // Simple in-memory store for demonstration

app.use(express.json());

// Endpoint to generate a token
app.post('/generate-token', (req, res) => {
    tokenCount++;
    res.json({ success: true, message: 'Token generated successfully.' });
});

// Endpoint to get token count
app.get('/token-count', (req, res) => {
    res.json({ count: tokenCount });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

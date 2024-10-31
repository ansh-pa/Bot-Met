const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const http = require('http');

// Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load responses from JSON file
let responses = {};
fs.readFile('responses.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Could not read responses.json:", err);
        return;
    }
    responses = JSON.parse(data);
});

app.post('/chat', (req, res) => {
    if (!req.body || !req.body.message) {
        return res.status(400).json({ response: "Invalid request format." });
    }

    const userMessage = req.body.message.toLowerCase();
    let botResponse = '';

    for (const category in responses) {
        const questions = responses[category];
        for (const entry of questions) {
            if (userMessage.includes(entry.question.toLowerCase())) {
                botResponse = entry.response;
                break;
            }
        }
        if (botResponse) break;
    }

    if (!botResponse) {
        botResponse = responses.default && responses.default.length > 0 
            ? responses.default[0].response 
            : "I'm sorry, I don't understand.";
    }

    res.json({ response: botResponse });
});

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});







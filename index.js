const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const main = require('./logic/main');  // Import logic from main.js

const port = process.argv[2];

if (!port || isNaN(port) || port <= 0 || port > 65535) {
    console.error('Invalid or missing port number. Please enter a valid number between 1 and 65535.');
} else {
    console.log(`Server will start on port ${port}.`);
}


// Middleware to parse JSON bodiese
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the logic defined in main.js
main.setup(app);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

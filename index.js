const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const main = require('./logic/main');  // Import logic from main.js

const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the logic defined in main.js
main.setup(app);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const express = require('express');
const path = require('path');

require('dotenv').config();

const app = express();

// Serve static files from 'public' (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'src')));

// Serve node_modules (for frontend libraries)
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Serve contract JSON files from build/contracts
app.use('/contracts', express.static(path.join(__dirname, 'build/contracts')));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/index.html'));
});

// app.get('/app.js', (req, res) => {
//     res.sendFile(path.join(__dirname, 'src/app.js'))
// });

// Start the server
app.listen(8080, () => {
    console.log('Server listening on http://localhost:8080');
  });
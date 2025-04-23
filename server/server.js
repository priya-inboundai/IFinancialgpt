// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Root route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Calculator API</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          pre { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Calculator API</h1>
        <p>This is the backend API for the calculator application.</p>
        <h2>Available Endpoints:</h2>
        <ul>
          <li><strong>POST /calculate</strong> - Perform a calculation</li>
          <li><strong>GET /health</strong> - Check API health</li>
        </ul>
        <h2>Example Usage:</h2>
        <pre>
POST /calculate
Content-Type: application/json

{
  "firstOperand": 10,
  "secondOperand": 5,
  "operator": "+"
}
        </pre>
        <p>The frontend application should be running on a different port (typically 5173 with Vite).</p>
      </body>
    </html>
  `);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.post('/calculate', (req, res) => {
  const { firstOperand, secondOperand, operator } = req.body;
  
  if (firstOperand === null || secondOperand === null || !operator) {
    return res.status(400).json({ error: 'Invalid calculation parameters' });
  }
  
  let result;
  
  switch (operator) {
    case '+':
      result = firstOperand + secondOperand;
      break;
    case '-':
      result = firstOperand - secondOperand;
      break;
    case '*':
      result = firstOperand * secondOperand;
      break;
    case '/':
      if (secondOperand === 0) {
        return res.status(400).json({ error: 'Division by zero is not allowed' });
      }
      result = firstOperand / secondOperand;
      break;
    default:
      return res.status(400).json({ error: 'Invalid operator' });
  }
  
  res.json({ result });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// For production deployment - add these lines
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
} else {
  // Development - show API info
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head><title>Calculator API</title></head>
        <body>
          <h1>Calculator API</h1>
          <p>This is the development version of the API.</p>
        </body>
      </html>
    `);
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
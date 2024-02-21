const express = require('express');
const app = express();
const { newToken, tokenCount } = require('./token');

// Serve static files from the public directory
app.use(express.static('public'));
// Harvest fields from a form
app.use(express.urlencoded({ extended: true }));

global.DEBUG = true;

// Serve the index.html file when the root URL is requested
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/count', async (req, res) => {
  var theCount = await tokenCount();
  res.setHeader('Content-type', 'text/html');
  res.write(`<!doctype html><html><head>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      background-color: #f4f4f4;
      margin-top: 375px;
    }
    h2 {
      color: #333;
    }
    a {
      text-decoration: none;
      color: #333;
      padding: 10px 20px;
      border: 1px solid #333;
      border-radius: 5px;
      margin: 10px;
      transition: all 0.3s ease;
  }
    a:hover {
      background-color: #333;
      color: #fff;
    }
  </style>
  </head><body>`);
  res.write(`<h2>Token count is ${theCount}</h2>`);
  res.write(`<a href="http://localhost:3000">[home]</a>`);
  res.write(`</body></html>`);
  res.end();
});


app.get('/new', (req, res) => {
  console.log('new token requested');
  res.sendFile(__dirname + '/public/newtoken.html');
});

app.post('/new', (req, res) => {
  var theToken = newToken(req.body.username);
  res.setHeader('Content-type', 'text/html');
  res.write(`<!doctype html><html><head>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      background-color: #f4f4f4;
      margin-top: 375px;
    }
    h2 {
      color: #333;
    }
    a {
      text-decoration: none;
      color: #333;
      padding: 10px 20px;
      border: 1px solid #333;
      border-radius: 5px;
      margin: 10px;
      transition: all 0.3s ease;
    }
    a:hover {
      background-color: #333;
      color: #fff;
    }
  </style>
  </head><body>`);
  res.write(`<h2>${req.body.username} token is ${theToken}</h2>`);
  res.write(`<a href="http://localhost:3000">[home]</a>`);
  res.write(`</body></html>`);
  res.end();
});

// Start the server
app.listen(3000, () => {
  console.log('Express server started on port 3000');
});
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const DB_PATH = path.join(__dirname, 'db.json');

const server = http.createServer((req, res) => {
  if (req.url === '/user' && req.method === 'GET') {
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Unable to read DB' }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data); // directly send JSON content from file
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/user`);
});
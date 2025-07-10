const http = require('http');

const fs = require('fs');

const path = require('path');

// Utility functions

const readDB = () => JSON.parse(fs.readFileSync('db.json', 'utf-8'));

const writeDB = (data) => fs.writeFileSync('db.json', JSON.stringify(data, null, 2));

// Create HTTP server

const server = http.createServer((req, res) => {

 const method = req.method;

 const url = req.url;

 // GET /users

 if (method === 'GET' && url === '/users') {

  const users = readDB();

  res.writeHead(200, { 'Content-Type': 'application/json' });

  res.end(JSON.stringify(users));

 }

 // POST /users

 else if (method === 'POST' && url === '/users') {

  let body = '';

  req.on('data', chunk => (body += chunk));

  req.on('end', () => {

   const newUser = JSON.parse(body);

   const users = readDB();

   newUser.id = users.length ? users[users.length - 1].id + 1 : 1;

   users.push(newUser);

   writeDB(users);

   res.writeHead(201, { 'Content-Type': 'application/json' });

   res.end(JSON.stringify(newUser));

  });

 }

 // PUT /users/:id

 else if (method === 'PUT' && url.startsWith('/users/')) {

  const id = parseInt(url.split('/')[2]);

  let body = '';

  req.on('data', chunk => (body += chunk));

  req.on('end', () => {

   const updatedData = JSON.parse(body);

   const users = readDB();

   const index = users.findIndex(user => user.id === id);

   if (index === -1) {

    res.writeHead(404, { 'Content-Type': 'application/json' });

    return res.end(JSON.stringify({ error: 'User not found' }));

   }

   users[index] = { ...users[index], ...updatedData };

   writeDB(users);

   res.writeHead(200, { 'Content-Type': 'application/json' });

   res.end(JSON.stringify(users[index]));

  });

 }

 // DELETE /users/:id

 else if (method === 'DELETE' && url.startsWith('/users/')) {

  const id = parseInt(url.split('/')[2]);

  const users = readDB();

  const filteredUsers = users.filter(user => user.id !== id);

  if (users.length === filteredUsers.length) {

   res.writeHead(404, { 'Content-Type': 'application/json' });

   return res.end(JSON.stringify({ error: 'User not found' }));

  }

  writeDB(filteredUsers);

  res.writeHead(200, { 'Content-Type': 'application/json' });

  res.end(JSON.stringify({ message: 'User deleted' }));

 }

 // 404 for other routes

 else {

  res.writeHead(404, { 'Content-Type': 'application/json' });

  res.end(JSON.stringify({ error: 'Route not found' }));

 }

});

// Start server

const PORT = 3000;

server.listen(PORT, () => {

 console.log(`Server running at http://localhost:${PORT}`);

});








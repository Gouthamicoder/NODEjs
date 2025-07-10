const http = require('http');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'emp.json');

// Helper to read the employee database
function readDB() {
  if (!fs.existsSync(dbPath)) return [];
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data || '[]');
}

// Helper to write to the database
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Get all employees
  if (method === 'GET' && url === '/employees') {
    const employees = readDB();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(employees));
  }

  // Add new employee
  else if (method === 'POST' && url === '/employees') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newEmp = JSON.parse(body);
        const employees = readDB();

        // Give a unique id
        newEmp.id = Date.now().toString();
        employees.push(newEmp);
        writeDB(employees);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Employee added', data: newEmp }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }
 else if (method === 'PUT' && url.startsWith('/employees/')) {
  const id = url.split('/')[2];
  let body = '';

  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const updatedData = JSON.parse(body);
      const employees = readDB();
      const index = employees.findIndex(emp => emp.id === id);

      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Employee not found' }));
        return;
      }

      // Update the existing employee data
      employees[index] = { ...employees[index], ...updatedData };
      writeDB(employees);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Employee updated', data: employees[index] }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
}
  // Delete employee by id
  else if (method === 'DELETE' && url.startsWith('/employees/')) {
    const id = url.split('/')[2];
    let employees = readDB();
    const originalLength = employees.length;
    employees = employees.filter(emp => emp.id !== id);

    if (employees.length === originalLength) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Employee not found' }));
    } else {
      writeDB(employees);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `Employee ${id} deleted` }));
    }
  }

  // Handle unknown route
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

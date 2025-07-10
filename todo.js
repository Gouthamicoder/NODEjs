const http = require("http");
const fs = require("fs");
const url = require("url");

const PORT = 3000;
const DB_FILE = "./todos.json";

function readDB() {
  const data = fs.readFileSync(DB_FILE, "utf8");
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
  const method = req.method;

  // GET /todos
  if (pathParts[0] === "todos" && method === "GET" && pathParts.length === 1) {
    const db = readDB();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(db.todos));
  }

  // GET /todos/1
  else if (pathParts[0] === "todos" && method === "GET" && pathParts.length === 2) {
    const id = parseInt(pathParts[1]);
    const db = readDB();
    const todo = db.todos.find(t => t.id === id);
    if (todo) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(todo));
    } else {
      res.writeHead(404);
      res.end("Todo not found");
    }
  }

  // POST /todos
  else if (pathParts[0] === "todos" && method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const db = readDB();
      const newTodo = JSON.parse(body);
      newTodo.id = Date.now(); // Simple ID
      db.todos.push(newTodo);
      writeDB(db);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newTodo));
    });
  }

  // PUT /todos/1
  else if (pathParts[0] === "todos" && method === "PUT" && pathParts.length === 2) {
    const id = parseInt(pathParts[1]);
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const updatedData = JSON.parse(body);
      const db = readDB();
      const index = db.todos.findIndex(t => t.id === id);
      if (index !== -1) {
        db.todos[index] = { ...db.todos[index], ...updatedData };
        writeDB(db);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(db.todos[index]));
      } else {
        res.writeHead(404);
        res.end("Todo not found");
      }
    });
  }

  // DELETE /todos/1
  else if (pathParts[0] === "todos" && method === "DELETE" && pathParts.length === 2) {
    const id = parseInt(pathParts[1]);
    const db = readDB();
    const index = db.todos.findIndex(t => t.id === id);
    if (index !== -1) {
      const deleted = db.todos.splice(index, 1);
      writeDB(db);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(deleted[0]));
    } else {
      res.writeHead(404);
      res.end("Todo not found");
    }
  }

  // Fallback
  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const express = require('express');

const server = express();
const users = ["Jean", "Teste", "Jamila"]

function checkUser(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User not exists" });
  }
  req.user = user;
  next();
}

server.use(express.json());
server.use((req, res, next) => {//Global middleware
  console.time("request time");
  console.log(`HTTP ${req.method}; URL: ${req.url}`);
  // res.status(401);
  // res.send({"status": 401, "message": "Unauthorized"});
  next();
  console.timeEnd("request time");
});

server.get('/users', (request, response) => {
  return response.json(users);
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post('/users', checkUser, (req, res) => {
  const body = req.body;
  users.push(body.name);
  return res.json(users);
});

server.put('/users/:index', checkUserInArray, checkUser, (req, res) => {
  const { index } = req.params;
  const body = req.body;
  users[index] = body.name;

  return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
});

server.listen(3000);
console.log("Server running...");
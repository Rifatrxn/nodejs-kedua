// server.js - Todo List simpel, simpan di todos.json (tanpa database)
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'todos.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function loadTodos() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return [];
  }
}
function saveTodos(todos) {
  fs.writeFileSync(DB_FILE, JSON.stringify(todos, null, 2));
}

// Ambil semua
app.get('/api/todos', (req, res) => res.json(loadTodos()));

// Tambah
app.post('/api/todos', (req, res) => {
  const { judul } = req.body;
  if (!judul) return res.status(400).json({ error: 'Judul wajib diisi' });
  const todos = loadTodos();
  const todo = { id: Date.now(), judul, selesai: false };
  todos.push(todo);
  saveTodos(todos);
  res.status(201).json(todo);
});

// Toggle selesai / belum
app.put('/api/todos/:id', (req, res) => {
  const todos = loadTodos();
  const t = todos.find(x => String(x.id) === req.params.id);
  if (!t) return res.status(404).json({ error: 'Tidak ditemukan' });
  t.selesai = !t.selesai;
  saveTodos(todos);
  res.json(t);
});

// Hapus
app.delete('/api/todos/:id', (req, res) => {
  const todos = loadTodos().filter(x => String(x.id) !== req.params.id);
  saveTodos(todos);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Jalan di http://localhost:${PORT}`));

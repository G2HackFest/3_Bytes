import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Mock database
const users = [];
const products = [];
const messages = [];

app.use(express.json());
app.use(express.static('public'));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ username: user.username, role: user.role }, 'secret_key');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Product routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', authenticateToken, (req, res) => {
  if (req.user.role !== 'farmer') {
    return res.status(403).json({ error: 'Only farmers can create listings' });
  }
  const product = { ...req.body, farmer: req.user.username };
  products.push(product);
  res.status(201).json(product);
});

// Message routes
app.post('/api/messages', authenticateToken, (req, res) => {
  const message = {
    ...req.body,
    from: req.user.username,
    timestamp: new Date()
  };
  messages.push(message);
  res.status(201).json(message);
});

app.get('/api/messages', authenticateToken, (req, res) => {
  const userMessages = messages.filter(m => 
    m.from === req.user.username || m.to === req.user.username
  );
  res.json(userMessages);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
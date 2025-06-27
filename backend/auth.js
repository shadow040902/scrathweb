const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

const SECRET = process.env.JWT_SECRET || 'your_secret_key';

const users = [
  { username: 'admin', password: bcrypt.hashSync('123456', 8) }
];

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });

  const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// Middleware xác thực token
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không có token' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token không hợp lệ' });
    req.user = decoded;
    next();
  });
}

// Ví dụ API cần xác thực
router.get('/profile', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
const express = require('express');
const cors = require('cors');
const session = require('express-session'); // Thêm dòng này
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const path = require('path');
const uri = "mongodb://localhost:27017/?directConnection=true";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Thêm cấu hình session
app.use(session({
  secret: 'your_secret_key', // đổi thành chuỗi bí mật của bạn
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, '../public')));

const dbName = "dangkydb";

async function main() {
  await client.connect();
  const db = client.db(dbName);
  const registrations = db.collection('dangky_hocvien');

  // Middleware kiểm tra đăng nhập admin
  function requireAdmin(req, res, next) {
    if (req.session && req.session.admin) {
      next();
    } else {
      if (req.path === '/admin.html') {
        return res.redirect('/login.html');
      }
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }
  }

  // API đăng nhập admin
  app.post('/api/admin-login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const db = client.db(dbName);
      const admins = db.collection('admin');
      const admin = await admins.findOne({ username, password });
      if (admin) {
        req.session.admin = true;
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
  });

  // API đăng xuất admin
  app.post('/api/admin-logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // Bảo vệ các API admin
  app.get('/api/registrations', requireAdmin, async (req, res) => {
    try {
      const all = await registrations.find().toArray();
      res.json(all);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
  });

  app.delete('/api/registrations/:id', requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      await registrations.deleteOne({ _id: new ObjectId(id) });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
  });

  app.put('/api/registrations/:id', requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      await registrations.updateOne({ _id: new ObjectId(id) }, { $set: data });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
  });

  // Bảo vệ truy cập file admin.html
  app.get('/admin.html', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
  });

  // Các API không cần đăng nhập
  app.post('/api/register', async (req, res) => {
    try {
      const data = req.body;
      data.createdAt = new Date();
      await registrations.insertOne(data);
      res.json({ success: true, message: 'Đăng ký thành công!' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
  });

  app.post('/api/contact', async (req, res) => {
    try {
      const data = req.body;
      data.createdAt = new Date();
      const db = client.db(dbName);
      const contacts = db.collection('contacts');
      await contacts.insertOne(data);
      res.json({ success: true, message: 'Gửi liên hệ thành công!' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
  });

  app.get('/', (req, res) => {
    res.send('Backend server is running!');
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
  });
}
main();
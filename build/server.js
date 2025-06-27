const express = require('express');
const path = require('path');
const app = express();

const publicPath = path.join(__dirname, 'app01', 'public');
app.use(express.static(publicPath));

// Trang chủ (tùy chọn, nếu muốn chuyển hướng về index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
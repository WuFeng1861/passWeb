const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

const BASE_PATH = '/passweb';

router.get('/login', (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      return res.redirect(`${BASE_PATH}/dashboard`);
    } catch (err) {
      res.clearCookie('token');
    }
  }
  res.render('login', { error: null, basePath: BASE_PATH });
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await db.get('admin', { username, password });
    
    if (admin) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24小时
      });
      res.redirect(`${BASE_PATH}/dashboard`);
    } else {
      res.render('login', { error: '用户名或密码错误', basePath: BASE_PATH });
    }
  } catch (err) {
    console.error('登录错误:', err);
    res.render('login', { error: '系统错误，请稍后重试', basePath: BASE_PATH });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect(`${BASE_PATH}/login`);
});

module.exports = router;
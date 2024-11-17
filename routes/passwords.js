const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const BASE_PATH = '/passweb';

router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const passwords = await db.all('passwords');
    res.render('dashboard', { passwords, basePath: BASE_PATH });
  } catch (err) {
    console.error('获取密码列表错误:', err);
    res.status(500).send('系统错误，请稍后重试');
  }
});

router.post('/add-password', requireAuth, async (req, res) => {
  try {
    const { site, username, password } = req.body;
    await db.run('INSERT_PASSWORD', { site, username, password });
    res.status(200).json({ message: '密码添加成功' });
  } catch (err) {
    console.error('添加密码错误:', err);
    res.status(500).json({ error: '系统错误，请稍后重试' });
  }
});

router.post('/edit-password', requireAuth, async (req, res) => {
  try {
    const { id, site, username, password } = req.body;
    await db.run('UPDATE_PASSWORD', { id, site, username, password });
    res.status(200).json({ message: '密码更新成功' });
  } catch (err) {
    console.error('更新密码错误:', err);
    res.status(500).json({ error: '系统错误，请稍后重试' });
  }
});

router.post('/delete-password/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.run('DELETE_PASSWORD', { id: Number(id) });
    res.status(200).json({ message: '密码删除成功' });
  } catch (err) {
    console.error('删除密码错误:', err);
    res.status(500).json({ error: '系统错误，请稍后重试' });
  }
});

module.exports = router;
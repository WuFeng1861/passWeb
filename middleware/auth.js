const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-jwt-secret-key'; // 在生产环境中应该使用环境变量

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  const BASE_PATH = '/passweb';

  if (!token) {
    return res.redirect(`${BASE_PATH}/login`);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('token');
    res.redirect(`${BASE_PATH}/login`);
  }
};

module.exports = { requireAuth, JWT_SECRET };
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwords');

const app = express();
const port = 52099;
const BASE_PATH = '/passweb';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes with base path
app.get(BASE_PATH, (req, res) => {
  res.redirect(`${BASE_PATH}/login`);
});

// Mount routes with base path
app.use(BASE_PATH, authRoutes);
app.use(BASE_PATH, passwordRoutes);

app.listen(port, () => {
  console.log(`Password manager running at http://localhost:${port}${BASE_PATH}`);
});
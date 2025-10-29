const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes/userRoutes');

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// Routes
app.get("/", (req, res) => {
  res.send(
    `<marquee>
      <h1>${process.env.DEV_MODE} server side running properly</h1>
    </marquee>`
  );
});

app.use("/api/user", userRoutes);

module.exports = app;
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');//
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { handlerError } = require('./middlewares/handlerError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const { limiter, DB_ADDRESS } = require('./config');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});
app.use(limiter);
app.use(bodyParser.json());
app.use(helmet());
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(handlerError);

app.listen(PORT);

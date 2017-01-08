import bodyParser from 'body-parser';
import express from 'express';

import methodOverride from 'method-override';
import mongoose from './util/mongoose.util.js';
import morgan from 'morgan';

/*
router
 */
import authRouter from './auth/auth.router.js';
import mapRouter from './map/map.router.js';
import userRouter from './user/user.router.js';

const app = express();

const PORT = process.env.PORT || config.SERVER.PORT;

mongoose.connect();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

app.use('/auth', authRouter);
app.use('/map', mapRouter);
app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`Vinyl api server listening on port ${PORT}!`);
});

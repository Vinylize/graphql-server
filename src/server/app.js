import express from 'express';
import bodyParser from 'body-parser';
import mongoose from './util/mongoose.util.js';
import config from 'config';
import userRouter from './user/user.router.js';
import mapRouter from './map/map.router.js';

const app = express();


const PORT = process.env.PORT || config.SERVER.PORT;

mongoose.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use('/user', userRouter);
app.use('/map', mapRouter);

app.listen(PORT, () => {
  console.log(`Pingsters api server listening on port ${PORT}!`);
});

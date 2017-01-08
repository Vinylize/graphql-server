import express from 'express';
import jwtUtil from '../util/jwt.util';
import ConnectionController from './connection.controller';

const router = express.Router();

router.get('/connection', jwtUtil.apiProtector, connectionController.getMyConnections);

export default router;

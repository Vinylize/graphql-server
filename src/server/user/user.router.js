import express from 'express';
import UserController from './user.controller';
import jwtUtil from '../util/jwt.util';

const router = express.Router();

router.get('/me', jwtUtil.apiProtector, UserController.me);

router.get('/id/:_id', jwtUtil.apiProtector,  UserController.getById);

router.get('/coordinate/:_id', jwtUtil.apiProtector, UserController.getCoordinateById);

router.put('/coordinate', jwtUtil.apiProtector, UserController.updateMyCoordinate);

export default router;

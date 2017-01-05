import express from 'express';
import UserController from './user.controller';
import jwtUtil from '../util/jwt.util';

const router = express.Router();

router.get('/:id', jwtUtil.apiProtector,  UserController.getById);

router.get('/', jwtUtil.apiProtector, UserController.getAll);

router.post('/login', UserController.getToken);

router.post('/signup', UserController.createUser);

export default router;

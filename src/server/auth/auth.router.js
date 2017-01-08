import express from 'express';
import AuthController from './auth.controller';
import jwtUtil from '../util/jwt.util';

const router = express.Router();
router.post('/signup', AuthController.createUser);

router.post('/login', AuthController.getToken);

router.post('/phone',  AuthController.requestPhoneValidiation);

router.put('/phone', AuthController.checkPhoneValidiation);

router.get('/promotion', AuthController.checkPromotionCode);

router.post('/promotion', AuthController.submitPromotionCode);

export default router;

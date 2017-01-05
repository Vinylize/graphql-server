import express from 'express';
import jwtUtil from '../util/jwt.util';
import MapController from './map.controller';

const router = express.Router();

router.get('/enteredUser', jwtUtil.apiProtector, MapController.getEnteredUser);

export default router;
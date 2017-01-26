import express from 'express';
import jwtUtil from '../util/jwt.util';
import MapController from './map.controller';

const router = express.Router();

// get users in device screen.
router.get('/user', MapController.getEnteredUser);

// update user's position in background mode.
router.put('/coordinate', jwtUtil.apiProtector, MapController.updateMyCoordinate);

export default router;

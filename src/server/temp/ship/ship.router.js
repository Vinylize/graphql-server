import express from 'express';
import jwtUtil from '../util/jwt.util';
import ShipController from './ship.controller';

const router = express.Router();

// Get all of my ship
router.get('/all', jwtUtil.apiProtector, PortController.getMyShips);
// Get my latest ship
router.get('/latest', jwtUtil.apiProtector, PortController.getMyLatestShip);
// Get my ship by id
router.get('/:connectionId', jwtUtil.apiProtector, ShipController.getShipById);

// Choose port and start ship
router.post('/start', jwtUtil.apiProtector, ShipController.startShip);
// End ship
router.post('/end', jwtUtil.apiProtector, ShipController.endShip);

export default router;

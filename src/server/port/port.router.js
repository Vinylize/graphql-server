import express from 'express';
import jwtUtil from '../util/jwt.util';
import PortController from './port.controller';

const router = express.Router();

// Get all of my port
router.get('/all', jwtUtil.apiProtector, PortController.getMyPorts);
// Get my latest port
router.get('/latest', jwtUtil.apiProtector, PortController.getMyLatestPort);
// Get port by id
router.get('/:connectionId', jwtUtil.apiProtector, PortController.getMyPortById);
// get coordinate of connection
/// TODO : This feature can be replaced to Socket.io
router.get('/coordinate/:connectionId', jwtUtil.apiProtector, PortController.getShipCoordinate);

//Create port by config
router.post('/', jwtUtil.apiProtector, PortController.createPort);
// Publish port and wait for ship
/// TODO : This feature It can be replaced to Socket.io
router.post('/open', jwtUtil.apiProtector, PortController.openPort);
// emergency close port.
/// TODO : This feature It can be replaced to Socket.io
router.post('/close', jwtUtil.apiProtector, PortController.closePort);

export default router;

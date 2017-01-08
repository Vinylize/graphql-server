import express from 'express';
import jwtUtil from '../util/jwt.util';
import ReportController from './report.controller';

const router = express.Router();

// Submit report
router.post('/', jwtUtil.apiProtector, ReportController.reportUser);

export default router;

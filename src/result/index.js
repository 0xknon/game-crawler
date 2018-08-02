
import express from 'express';
import { fetchResult, fetchMatchDate, fetchOneResult } from './crawler';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());

router.route('/fetch/:region/:date/:place/:matchNum').get(fetchOneResult);

router.route('/fetch').get(fetchResult);

router.route('/matchDate').get(fetchMatchDate);

export default router;
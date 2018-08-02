
import express from 'express';
import { fetchTwitchGame } from './crawler';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());

router.route('/fetch').get(fetchTwitchGame);



export default router;
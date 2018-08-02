
import express from 'express';
import { fetchMatch } from './crawler';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());

router.route('/fetch').get(fetchMatch);



export default router;
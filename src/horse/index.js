
import express from 'express';
import { fetchResultFromJC } from './crawler';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());

router.route('/fetch').get(fetchResultFromJC);



export default router;
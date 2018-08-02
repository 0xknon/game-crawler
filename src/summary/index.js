
import express from 'express';
import { getDistinctMatchID, getResult, verifyResultWithMatchNum } from './controller';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());

router.route('/distinct_match').get(getDistinctMatchID);

router.route('/result').get(getResult);

router.route('/result/verify').get(verifyResultWithMatchNum);


export default router;
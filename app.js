import express from 'express';
const app = express();


import router from './src'; //importing route


app.use('/', router);

/* Deprecated 
import  horse from './routes/horse';
import  rider  from './routes/rider';
import  trainer from './routes/trainer';
import  match from './routes/match';
import  result from './routes/result';

app.get('/', function (req, res) {
  res.send('Hello World!')
})


app.get('/horse/fetch', horse.fetchHorseFromJC);

app.get('/rider/fetch', rider.fetchRiderFromJC);

app.get('/trainer/fetch', trainer.fetchTrainerDetailFromJC);

app.get('/match/fetch', match.fetchMatchFromJC);

*/


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
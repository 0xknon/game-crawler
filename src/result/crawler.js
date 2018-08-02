// import cheerio from 'cheerio';
// import request from 'request';
// import rp from 'request-promise';
// import async from 'async';
// import iconv from 'iconv-lite';

// import { getValueInTag, nthIndexOf, getDateStringFromDB, asyncRequests } from '../functions';
// import { parseResultTable, parseNumOfMatch } from './parser'
// import { DynamoDBClient, dynamodb } from '../config/aws'
// import { isDebug } from '../config/config'

// //const string for match date
// const matchDateSelectStartStr = "<select name=\"raceDateSelect\" id=\"raceDateSelect\">";
// const matchDateSelectEndStr = "</select>";

// const matchDateOptionStartStr = "<option value=\'";
// const matchDateOptionEndStr = "\'";

// const urlPath = 'http://racing.hkjc.com/racing/Info/meeting/Results/english/';

// /****** Fetch Result Tacble *******/
// export const fetchResult = function(req, res) {

//     getDateStringFromDB((data) => {

//         let dateStringList = data.Items; 

        
//         let urlList = [];
//         dateStringList.forEach((item, index) => {
//             let dateString = item.DateString;
//             let date = item.Date;
//             let numOfMatch = item.numOfMatch;

//             urlList.push({
//                 date, 
//                 url: urlPath + dateString,
//                 numOfMatch
//             });
//         });

//         let output = [];
//         let count = 0 ;
//         console.log('urlList: '+JSON.stringify(urlList));

//         asyncRequests(urlList, 5, (url, date) => {
//             return fetch(url).then(function(body) {
//                 let matchNum = url.substring(url.lastIndexOf('/')+1);
//                 parseResultTable(date, matchNum, body);

//             }).catch(function(err) {
//                 console.log(url, err);
//             });
//         }).then(function(res) {
//             // all requests done here
//             //res.send(output);
//         }).catch((err) => {
//             console.log(err);
//         });
//     });
// };

// const fetch = (url) => {
//     return rp(url).then(function(body) {
//         let rowStartStr1 = "<tr class=\"trBgGrey\">";
//         if (!body.includes(rowStartStr1)) {
//             //console.log('retry...');
//             return fetch(url);
//         } else {
//             return body;
//         }

//     }).catch(function(err) {
//         console.log(err);
//     });
// }


// export const fetchOneResult = function(req, res) {
//     let region = req.params.region
//     let date = req.params.date
//     let place = req.params.place
//     let matchNum = req.params.matchNum

//     let suffix = region+'/'+date+'/'+place+'/'+matchNum;
//     let url = urlPath+suffix;
//     fetch(url).then((body) => {
//         let matchNum = url.substring(url.lastIndexOf('/')+1);

//         parseResultTable(date, matchNum, body, (result) => {
//             res.send(result);
//         });
//     });
// }
  

// /**
//  * 
//  * @param {*} req 
//  * @param {*} res 
//  * 
//  * @description fetch Match date 
//  */
// export const fetchMatchDate = function(req, res) {
//     const url = 'http://racing.hkjc.com/racing/Info/meeting/Results/english/Local/20160328/ST/';
//     request(url, function(error, response, body) {
//         let matchDateList = [];

//         let textStr = body.substring(
//             body.indexOf(matchDateSelectStartStr) + matchDateSelectStartStr.length, 
//             body.indexOf(matchDateSelectEndStr)
//         );
        
//         let tableStr = textStr;

//         while(tableStr.includes(matchDateOptionStartStr)) {
//             tableStr = tableStr.substring(tableStr.indexOf(matchDateOptionStartStr) + matchDateOptionStartStr.length);
//             let DateString = tableStr.substring(0, tableStr.indexOf(matchDateOptionEndStr));

//             if (!DateString.includes('Simulcast')) {
//                 fetch(urlPath + DateString)
//                 .then(function(body) {
//                     // count number of match on that date
//                     return parseNumOfMatch(body);
//                 })
//                 .then((numOfMatch) => {
//                     var params = {
//                         TableName: "MatchDate",
//                         Item:{
//                             Date: getValueInTag(DateString, "/", "/"),
//                             DateString,
//                             numOfMatch
//                         }
//                     };
            
//                     DynamoDBClient.put(params, function(err, data) {
//                         if (err) {
//                             console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//                         } else {
//                             console.log("Added item:", JSON.stringify(params.Item));
//                         }
//                     });
//                 });

//                 matchDateList.push(DateString);
//             }

//         }
//         res.send(matchDateList);

//     });
// }



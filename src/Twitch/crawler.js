import cheerio from 'cheerio';
import request from 'request';
import iconv from 'iconv-lite';
import { getValueInTag } from '../functions';


//There are 2 types of row start string
const rowStartStr1 = "<tr class=\"font13 tdAlignC trBgWhite\">";
const rowStartStr2 = "<tr class=\"font13 tdAlignC trBgGrey1\">";
const rowEndStr = "</tr>";

const colNameList = [
    "HorseNo",
    "Last6Runs",
    "Colour",
    "Horse",
    "BrandNo",
    "Wt",
    "Jockey",
    "OverWt",
    "Draw",
    "Trainer",
    "Rtg",
    "Rtg+/-",
    "DeclaratedHorseWt",
    "VsDeclaratedWt+/-",
    "Best Time",
    "Age",
    "WFA",
    "Sex",
    "SeasonStakes",
    "Priority",
    "Gear",
    "Owner",
    "Sire",
    "DamImportCat"
]



export const fetchTwitchGame = function(req, res) {
	console.log('Fetching Match from JC....');
	console.log('Fetching ' + url);

    const url = 'https://www.twitch.tv/directory';
    request(url, function(error, response, body) {

        res.send(body);
        
    });
};
    
const parseMatchTable = (textStr, callback = null) => {

    let textStrSize = textStr.length;
    let result = [];
    
    for (let i=0; i < textStrSize; i++){

        if (textStr[i].includes(rowStartStr1) || textStr[i].includes(rowStartStr2)) {
            let colIndex = 0;

            let row = {};
            
            while ( !textStr[i].includes(rowEndStr) ) {
                i++;
                let value = getValueInTag(textStr[i], ">", "<");
                if (value != null || value != undefined) {

                    console.log(colNameList[colIndex] + " : " + value);
                    row[colNameList[colIndex]] = value;

                    colIndex++;
                }
            }
            result.push(row);
        }
    }
    if (callback != null) {
        callback(result);
    }
}


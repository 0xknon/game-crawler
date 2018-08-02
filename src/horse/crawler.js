import cheerio from 'cheerio';
import request from 'request';
import iconv from 'iconv-lite';


const tableStartStr = "<table class=\"tableBorderBlue tdAlignC\" border=\"0\">";
const tableEndStr = "</table>";

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



export const fetchResultFromJC = function(req, res) {
    console.log('Fetching Result from JC....');
    const url = 'http://www.hkjc.com/chinese/racing/horse.asp?horseno=';
	console.log('Fetching ' + url);

	request(url, function(error, response, body) {

        //console.log(body);
        
        let textStr = body.split('\n');
        parseMatchTable(textStr, (result) => {
            res.send(result);
        });
	});
};

const parseMatchTable = (textStr, callback = null) => {

    let textStrSize = textStr.length;
    let result = [];
    
    for (let i=0; i < textStrSize; i++){
    //for (let i=resultTableStartIndex; i < resultTableEndIndex; i++){

        if (textStr[i].includes(rowStartStr1) || textStr[i].includes(rowStartStr2)) {
            let colIndex = 0;

            let row = {};
            
            while ( !textStr[i].includes(rowEndStr) ) {
                i++;
                let value = getValueInTag(textStr[i], ">", "<");
                if (value != null || value != undefined) {

                    //console.log(colNameList[colIndex] + " : " + value);
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

const getValueInTag = (line, startTag, endTag) => {
    //console.log(line);
    let value = line.substring(line.indexOf(startTag) + 1);
    if (value.indexOf(endTag) != -1) {
        value = value.substring(0, value.indexOf(endTag));
        return value
    } else {
        return null;
    }

}
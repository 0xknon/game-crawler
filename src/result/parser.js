  
import { DynamoDBClient, dynamodb } from '../config/aws'
import { getValueInTag, nthIndexOf, getDateStringFromDB, asyncRequests } from '../functions';
import { isDebug } from '../config/config'


//const string for result table
//There are 2 types of row start string
const retryStr = "Network or system busy, please try again later. Sorry for the inconveniences caused.";
const rowStartStr1 = "<tr class=\"trBgGrey\">";
const rowStartStr2 = "<tr class=\"trBgWhite\">";
const rowEndStr = "</tr>";
const tableEndStr = "<font size=\"2\">";
const valueStartStr = "<td ";
const valueEndStr = "</td>";

//const string for counting match date
const matchNumberStartStr = "<td nowrap=\"nowrap\" class=\"racingTitle\" style=\"text-align:right;\">";
const matchNumberEndStr = "</tr>";
const matchNumberTagStr = "<td nowrap=\"nowrap\" style=\"text-align:center;\" width=\"24px\">";


const colNameList = [
    "Plc",                      //Place
    "HorseNo",
    "HorseURL",
    "Horse",
    "JockeyURL",
    "Jockey",
    "TrainerURL",
    "Trainer",
    "ActualWt",
    "DeclaredHorseWt",
    "Draw",
    "LBW",                      // 頭馬距離
    "RunningPosition",
    "FinishTime",
    "WinOdds" 
]

/**
 * 
 * @param {*} body 
 * 
 * @description Parse number of match on that date
 */
export const parseNumOfMatch = (body) => {
    let NumOfMatch = 0;

    let matchNumPart = body.substring(body.indexOf(matchNumberStartStr));
    matchNumPart = matchNumPart.substring(0, matchNumPart.indexOf(matchNumberEndStr));
    while (matchNumPart.includes(matchNumberTagStr)) {
        matchNumPart = matchNumPart.substring(matchNumPart.indexOf(matchNumberTagStr) + matchNumberTagStr.length);
        if (matchNumPart.substring(0,5) != "&nbsp") {
            NumOfMatch++;
        }
    }
    return NumOfMatch;
}


/**
 * 
 * @param {*} date 
 * @param {*} matchNo 
 * @param {*} textStr 
 * @param {*} callback 
 * 
 * @description 
 * Parse result table of Local match (e.g. Local/20171101/ST) and 
 * put the result into DB
 * 
 * 
 */
export const parseResultTable = (date, matchNo, textStr, callback = null) => {
    
    
        let textStrSize = textStr.length;
        var result = [];
        
        let rowStartStr1Index = textStr.indexOf(rowStartStr1);
        let rowStartStr2Index = textStr.indexOf(rowStartStr2);
        
        if (rowStartStr1Index > rowStartStr2Index) {
            textStr = textStr.substring(
                rowStartStr2Index
            );
        } else {
            textStr = textStr.substring(
                rowStartStr1Index
            );
        }
        textStr = textStr.substring(0, nthIndexOf(textStr, tableEndStr, 1));
    
        let tableStr = textStr;
        isDebug && console.log("<==============================================>");
    
        while(tableStr.includes(rowStartStr2) || tableStr.includes(rowStartStr1)) {
            //let rowRecord = {};
            let rowRecord = [];
            let rowStartStr1Index = tableStr.indexOf(rowStartStr1);
            let rowStartStr2Index = tableStr.indexOf(rowStartStr2);
            
            //Check next start string
            if (rowStartStr1Index == -1) {
                tableStr = tableStr.substring(
                    rowStartStr2Index + rowStartStr2.length
                );
            } else if (rowStartStr2Index == -1) {
                tableStr = tableStr.substring(
                    rowStartStr1Index + rowStartStr1.length
                );
            } else if (rowStartStr1Index > rowStartStr2Index) {
                tableStr = tableStr.substring(
                    rowStartStr2Index + rowStartStr2.length
                );
            } else {
                tableStr = tableStr.substring(
                    rowStartStr1Index + rowStartStr1.length
                );
            }
    
            //HTML code in one <tr> tags
            let errTableStr = tableStr;  
            let rowStr = tableStr.substring(0, nthIndexOf(tableStr, rowEndStr, 2));
            let errRowStr = rowStr;                 //Prepare this for output when err
            let valueIndex = 0;
            
            while(rowStr.includes(valueStartStr)) {
                rowStr = rowStr.substring(rowStr.indexOf(valueStartStr) + valueStartStr.length);
                let value = getValueInTag(rowStr, ">", "</td");
    
                //case 1: contain url
                if (value.includes("<a href=\"")) { 
                    value = value.substring(value.indexOf("<a href=\"") + "<a href=\"".length);
    
                    // Get url string
                    let URLValue = value.substring(0, value.indexOf("\""));
                    
                    //rowRecord[colNameList[valueIndex]] = URLValue;
                    rowRecord.push(URLValue);
                    
    
                    // Get the name value
                    let nameValue = getValueInTag(value, ">", "<");
                    
                    //rowRecord[colNameList[valueIndex]] = nameValue;
                    rowRecord.push(nameValue);
                    
                }
                //case 2: contain table 
                else if (value.includes("<table")) {     
    
                    let runningPosArr = [];
                    //it must include one more <td tag  

                    let runningPosStr = rowStr.substring(0, rowStr.indexOf("</table>"));
                    isDebug && console.log('runningPosStr: '+runningPosStr); 


                    while(runningPosStr.includes(valueStartStr)) {
                        runningPosStr = runningPosStr.substring(runningPosStr.indexOf("<td") + "<td".length);   
                        let position = getValueInTag(runningPosStr, ">", "<");  //rowStr.substring(value.indexOf(">") + ">".length);
                        isDebug && console.log('position: '+position); 
                        runningPosArr.push(position);
                    }

                    rowStr = rowStr.substring(rowStr.indexOf("</table>") + "</table>".length);  
                    isDebug && console.log('rowStr: '+rowStr); 
                    
                    //rowRecord[colNameList[valueIndex]] = value;
                    rowRecord.push(runningPosArr);
                    isDebug && console.log('runningPosArr: ' + JSON.stringify(runningPosArr)); 
                    
                } else {
                    
                    //rowRecord[colNameList[valueIndex]] = value;
                    rowRecord.push(value);
                    
                }
            }
    
            let row = {};
            for (let i = 0; i < rowRecord.length; i++) {
                row[colNameList[i]] = rowRecord[i];
            }
            
            row.ID = date+"_"+matchNo;
            row.date = date;
            row.matchNo = matchNo;
            
            result.push(row);
            
            var params = {
                TableName: "Result",
                Item: row,
            };
            
            DynamoDBClient.put(params, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    console.log("Input: ", JSON.stringify(params));
                    //console.log(tableStr);
                } else {
                    //console.log("Added item:", JSON.stringify(row));
                }
            });
    
            isDebug && console.log("<==============================================>");
        }
    
        if (callback != null) {
            callback(result);
        }
    
    }
    
    
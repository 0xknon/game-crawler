
import {DynamoDBClient, dynamodb} from './config/aws'


/**
 * 
 * @param {*} line 
 * @param {*} startTag 
 * @param {*} endTag 
 * 
 * @description get Value between defined tags
 * 
 */
export const getValueInTag = (line, startTag, endTag) => {
    //console.log(line);
    let value = line.substring(line.indexOf(startTag) + 1);
    if (value.indexOf(endTag) != -1) {
        value = value.substring(0, value.indexOf(endTag));
        return value
    } else {
        return null;
    }

}

/**
 * 
 * @param {*} string 
 * @param {*} subString 
 * @param {*} occurrence 
 * 
 * @description get index of the nth occurence of substring 
 * 
 */
export const nthIndexOf = (string, subString, occurrence) => {
    var first_index = string.indexOf(subString);
    var length_up_to_first_index = first_index + 1;

    if (occurrence == 1) {
        return first_index;
    } else {
        var string_after_first_occurrence = string.slice(length_up_to_first_index);
        var next_occurrence = nthIndexOf(string_after_first_occurrence, subString, occurrence - 1);

        if (next_occurrence === -1) {
            return -1;
        } else {
            return length_up_to_first_index + next_occurrence;  
        }
    }
}

/**
 * 
 * @param {*} callback 
 * 
 * @description get the dateString list from the DB
 * 
 */
export const getDateStringFromDB = (callback = null) => {
    
    var params = {
        TableName: "MatchDate",
    };


    DynamoDBClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to scan item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            if (callback != null) {
                callback(data);
            }
        }
    });
}



export const asyncRequests = (urlList, maxInFlight, fn) => {
    return new Promise((resolve, reject) => {
        let index = 0;
        let inFlight = 0;

        function next() {
            while (inFlight < maxInFlight && index < urlList.length) {
                ++inFlight;

                let currentIndex = index;
                index = index + 1;

                let url = urlList[currentIndex].url;
                let date = urlList[currentIndex].date;
                let numOfMatch = urlList[currentIndex].numOfMatch;

                console.log(date);
                console.log(numOfMatch);
                for (let matchNum = 1; matchNum <= numOfMatch; matchNum++) {
                    var params = {
                        Key: {
                            ID: {
                                S: date+"_"+matchNum
                            },
                            HorseNo: {
                                S: "1"
                            },
                        }, 
                        TableName: "Result"
                    };
                    dynamodb.getItem(params, function(err, data) {
                        if (err) 
                            console.log(err, err.stack); // an error occurred
                        else {
                            if (isEmptyObject(data)) {
                                console.log('Fetch: '+date+"_"+matchNum);
                                fn(url + '/' + matchNum, date).then(result => {
                                    --inFlight;
                                    next();
                                }).catch(err => {
                                    --inFlight;
                                    console.log(err);
                                    // purposely eat the error and let the rest of the processing continue
                                    // if you want to stop further processing, you can call reject() here
                                    next();
                                });
                            }
                        }
                      
                    });
                }
            }
            if (inFlight === 0) {
                // all done
                resolve();
            }
        }
        next();
    });
}

function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}
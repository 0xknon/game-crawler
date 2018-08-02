
import { DynamoDBClient, dynamodb } from '../config/aws'

export const getDistinctMatchID = (req, res) => {
    
    var params = {
        TableName: "Result",
    };


    DynamoDBClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to scan item. Error JSON:", JSON.stringify(err, null, 2));
        } 

        console.log(data);
        let items = data.Items;
        let output = getDistinct(items);
        res.send(output.sort());
    });
}

const getDistinct = (items) => {
    var temp = {};
    for (var i = 0; i < items.length; i++) {
        temp[items[i].ID] = true;
    }
    var output = [];
    for (var k in temp) {
        output.push(k);
    }
    return output;
}

export const getResult = (req, res) => {
    
    var params = {
        TableName: "Result",
    };


    DynamoDBClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to scan item. Error JSON:", JSON.stringify(err, null, 2));
        } 

        let items = data.Items;
        
        res.send(items);
    });
}

export const verifyResultWithMatchNum = (req, res) => {
    var params = {
        ProjectionExpression: "ID",
        TableName: "Result",
    };

    DynamoDBClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to scan item. Error JSON:", JSON.stringify(err, null, 2));
        } 

        let items = data.Items;
        let idList = getDistinct(items);

        
        var output = {};
        for (var i = 0; i < idList.length; i++) {
            if (output[idList[i].substring(0,8)] == undefined) {
                output[idList[i].substring(0,8)] = 1;
            } else {
                output[idList[i].substring(0,8)] = output[idList[i].substring(0,8)] + 1;
            }
        }
        
        res.send(output);
    });
}
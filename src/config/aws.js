
import AWS from 'aws-sdk';


AWS.config.accessKeyId = "AKIAJ32RNAAMFUQ2SSAQ";
AWS.config.secretAccessKey = "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";
AWS.config.region = "ap-northeast-1";

export var DynamoDBClient = new AWS.DynamoDB.DocumentClient();
export var dynamodb = new AWS.DynamoDB();
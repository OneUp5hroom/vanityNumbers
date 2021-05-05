'use strict';
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    
    var params = {
        TableName: "voiceFoundry-VanityNumbers-Results",
        IndexName: "sortedNumbers",
        KeyConditionExpression : "#key = :number",
        ExpressionAttributeNames:{
            "#key": "dateId"
        },
        ExpressionAttributeValues: {
            ":number": 0
        },
        ProjectionExpression: "parentNumber, vanityNumber, word, dateAdded",
        ScanIndexForward: false
    };
    
    const returnedItems = await getItems(params);
    
    const uniqueItems = new Set();
    returnedItems.Items.forEach(e => {
        uniqueItems.add(e.parentNumber);
    });
    console.log(uniqueItems);
    return;
};

function getItems(params) {
    try {
        const data = docClient.query(params).promise();
        return data;
    } catch (e) {
        return e;
    }
}
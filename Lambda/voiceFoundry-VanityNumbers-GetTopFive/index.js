'use strict';
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    let topFive = [];
    let outputArray = [];
    const uniqueItems = new Set();
    
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
    
    returnedItems.Items.forEach(e => {
        uniqueItems.add(e.parentNumber);
    });
    const itorator = uniqueItems.values();
    for (let i = 0; i < 5; i++) {
        topFive.push(itorator.next().value);
    }
    returnedItems.Items.forEach(e => {
        if (topFive.includes(e.parentNumber)) {
            outputArray.push(e);
        }
    }); 
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://okay.alcandev.com",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(outputArray),
    };
    return response;
};

function getItems(params) {
    try {
        const data = docClient.query(params).promise();
        return data;
    } catch (e) {
        return e;
    }
}
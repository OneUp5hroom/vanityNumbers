'use strict';
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    let phoneNumber;
    let items = [];

    phoneNumber = event.phoneNumber;
    if (phoneNumber === undefined || phoneNumber.length < 7) {
        phoneNumber = event['Details']['Parameters']['phoneNumber'];
    }
    console.log('phoneNumber');
    console.log(phoneNumber);
    if (phoneNumber === undefined || phoneNumber.length < 7) {
        var resultMap = {
            message: 500
        };
        callback(null, resultMap);
        return;
    }

    phoneNumber = formatNumber(phoneNumber);

    const params = {
        TableName: "voiceFoundry-VanityNumbers-Results",
        IndexName: "parentNumber-index",
        KeyConditionExpression : "#key = :number",
        ExpressionAttributeNames:{
            "#key": "parentNumber"
        },
        ExpressionAttributeValues: {
            ":number": phoneNumber
        },
        ScanIndexForward: false
    };
    const returnedItems = await getItems(params);
    console.log(returnedItems);
    // get top two vanity numbers based on the sort key wordLength
    for (let i = 0; i < 2; i++) {
        items.push(returnedItems.Items[i].vanityNumber);
    }
    var resultMap = {
        items: items,
        message: 200
    };

    callback(null, resultMap);
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
function formatNumber(phoneNumber) {
    if (phoneNumber.length >= 11) {
        phoneNumber = phoneNumber.slice(-10);
    }
    return {
        "trimmedNumber": phoneNumber.trim().replace(/\+/g,'').replace(/-/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\s/g,'').slice(-7),
        "fullNumber": phoneNumber.trim().replace(/\+/g,'').replace(/-/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\s/g,'')
    };
}
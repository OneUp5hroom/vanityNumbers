'use strict';
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    let phoneNumber;
    let item1;
    let item1word;
    let item2;
    let item2word;
    let resultMap;
    let webSource;

    console.log(event);
    // Websource & test parameters
    phoneNumber = event.queryStringParameters.phoneNumber;
    webSource = event.queryStringParameters.webSource;

    if (phoneNumber === undefined || phoneNumber.length < 7) {
        phoneNumber = event['Details']['Parameters']['phoneNumber'];
    }
    if (phoneNumber === undefined || phoneNumber.length < 7) {
        // incorrect parameter defined, return 500
        resultMap = {
            message: 500
        };
        callback(null, resultMap);
        return;
    }

    phoneNumber = formatNumber(phoneNumber).fullNumber;
    console.log('phoneNumber');
    console.log(phoneNumber);
    const params = {
        TableName: "voiceFoundry-VanityNumbers-Results",
        IndexName: "parentNumberIndex",
        KeyConditionExpression : "#key = :number",
        ExpressionAttributeNames:{
            "#key": "parentNumber"
        },
        ExpressionAttributeValues: {
            ":number": String(phoneNumber)
        },
        ScanIndexForward: false
    };
    const returnedItems = await getItems(params);
    console.log(returnedItems);
    if (returnedItems.Items === undefined || returnedItems.Items.length < 1) {
        if (webSource !== undefined && webSource === 'true') {
            let obj = {"none": "none"}
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "http://okay.alcandev.com",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                body: JSON.stringify(obj),
            };
            return response;
        }
        // no records found
        resultMap = {
            message: 404
        };

        callback(null, resultMap);
        return;
    } else {
        // get top two vanity numbers based on the sort key wordLength
        for (let i = 0; i < 2; i++) {
            if (i === 0) {
                item1word = returnedItems.Items[i].word;
                item1 = returnedItems.Items[i].ssmlVanityNumber;
            } else {
                item2word = returnedItems.Items[i].word;
                item2 = returnedItems.Items[i].ssmlVanityNumber;
            }
        }
        // return all vanity numbers for web source
        if (webSource !== undefined && webSource === 'true') {
            resultMap = [];
            returnedItems.Items.forEach(e => {
                let obj = {
                    word: e.word,
                    vanityNumber: e.vanityNumber,
                    parentNumber: e.parentNumber
                };
                resultMap.push(obj);
            });
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "http://okay.alcandev.com",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                body: JSON.stringify(resultMap),
            };
            return response;
        } else {
            resultMap = {
                item1word: item1word,
                item1: item1,
                item2word: item2word,
                item2: item2,
                message: 200
            };
        }
        callback(null, resultMap);
        return;
    }
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
    let obj = {
        "trimmedNumber": phoneNumber.trim().replace(/'/g,'').replace(/\+/g,'').replace(/-/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\s/g,'').slice(-7),
        "fullNumber": phoneNumber.trim().replace(/'/g,'').replace(/\+/g,'').replace(/-/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\s/g,'')
    };
    
    if (obj['fullNumber'].length >= 11) {
        console.log('edit phone length');
        obj['fullNumber'] = obj['fullNumber'].slice(-10);
        console.log(obj['fullNumber']);
    }
    return obj;
}
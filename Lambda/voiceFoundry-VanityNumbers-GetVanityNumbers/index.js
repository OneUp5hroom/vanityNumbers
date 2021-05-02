'use strict';
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    let phoneNumber;

    phoneNumber = event.phoneNumber;
    if (phoneNumber === undefined || phoneNumber.length < 7) {
        phoneNumber = event['Details']['Parameters']['phoneNumber'];
    }
    console.log('phoneNumber');
    console.log(phoneNumber);
   
      
    var resultMap = {
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
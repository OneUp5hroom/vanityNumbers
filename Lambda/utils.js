const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

function findWords(letters) {
    let output = []
    for (let i = 0; i < letters.length; i++) {
        const params = {
            TableName: "voiceFoundry-VanityNumbers-Dictionary",
            IndexName: "dictionaryIndex",
            KeyConditionExpression : "#key = betgins_with($key, :letter)",
            ExpressionAttributeNames:{
                "#key": "word"
            },
            ExpressionAttributeValues: {
                ":letter": letters[i]
            }
        }
        const values = await getItems(params);
        console.log('***values***');
        console.log(values);
    }
}

async function getItems(params) {
    try {
        const data = await docClient.query(params).promise();
        return data;
    } catch (e) {
        return e;
    }
}

async function returnFirstNumber(phoneNumber) {
    return phoneNumber.trim().replace('-','').slice(-7).substr(0,1);
}

async function parseParams(number) {
    const params = {
        TableName: "voiceFoundry-VanityNumbers-NumPair",
        KeyConditionExpression : "#key = :number",
        ExpressionAttributeNames:{
            "#key": "Number"
        },
        ExpressionAttributeValues: {
            ":number": number
        }
    }
    return params;
}

module.exports = {
    findWords,
    getItems,
    returnFirstNumber,
    parseParams
}
const utils = require('./utils.js');
const AWS = require('aws-sdk');

exports.handler = async (event) => {
    let words = [];
    console.log(event);
    const phoneNumber = event.phoneNumber;
    const number = await parseInt(await utils.returnFirstNumber(phoneNumber));
    const params = await parseParams(number);
    try {
        const data = await utils.getItems(params);
        words = await findWords(data.Items[0].Characters.values);
    } catch (e) {
        return { error: e }
    }
}
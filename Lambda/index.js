const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const phoneNumber = event.phoneNumber;
    const numbers = await formatNumber(phoneNumber);
    let objectArray = [];
    let params;
    for (let i = 0; i < numbers.length; i++) {
        const params = {
            TableName: "voiceFoundry-VanityNumbers-NumPair",
            KeyConditionExpression : "#key = :number",
            ExpressionAttributeNames:{
                "#key": "Number"
            },
            ExpressionAttributeValues: {
                ":number": parseInt(numbers[i])
            }
        };
        let data = await getItems(params);
        let object = {number: numbers[i], letters: data.Items[0].Characters.values}
        console.log(object);
        objectArray.push(object);
    }
    let wordArray = [];
    for (let i = 0; i < 3; i++) {
        const wordQuery = {
            TableName: "voiceFoundry-VanityNumbers-Dictionary",
            IndexName: "FirstLetter",
            KeyConditionExpression: "#FirstLetter = :Letter",
            FilterExpression: "(#SecondLetter = :Second \
                                or #SecondLetter = :SecondTwo \
                                or #SecondLetter = :SecondThree) \
                                and (#ThirdLetter = :Third \
                                or #ThirdLetter = :ThirdTwo \
                                or #ThirdLetter = :ThirdThree) \
                                and (#FourthLetter = :Fourth \
                                or #FourthLetter = :FourthTwo \
                                or #FourthLetter = :FourthThree) \
                                and (#FifthLetter = :Fifth \
                                or #FifthLetter = :FifthTwo \
                                or #FifthLetter = :FifthThree) \
                                and (#SixthLetter = :Six \
                                or #SixthLetter = :SixTwo \
                                or #SixthLetter = :SixThree) \
                                and (#SeventhLetter = :Seven \
                                or #SeventhLetter = :SevenTwo \
                                or #SeventhLetter = :SevenThree)",
            ExpressionAttributeNames: {
                "#FirstLetter": "FirstLetter",
                "#SecondLetter": "SecondLetter",
                "#ThirdLetter": "ThirdLetter",
                "#FourthLetter": "FourthLetter",
                "#FifthLetter": "FifthLetter",
                "#SixthLetter": "SixthLetter",
                "#SeventhLetter": "SeventhLetter"
            },
            ExpressionAttributeValues: {
                ":Letter": objectArray[0].letters[i],
                ":Second": objectArray[1].letters[0],
                ":SecondTwo": objectArray[1].letters[1],
                ":SecondThree": objectArray[1].letters[2],
                ":Third": objectArray[2].letters[0],
                ":ThirdTwo": objectArray[2].letters[1],
                ":ThirdThree": objectArray[2].letters[2],
                ":Fourth": objectArray[3].letters[0],
                ":FourthTwo": objectArray[3].letters[1],
                ":FourthThree": objectArray[3].letters[2],
                ":Fifth": objectArray[4].letters[0],
                ":FifthTwo": objectArray[4].letters[1],
                ":FifthThree": objectArray[4].letters[2],
                ":Six": objectArray[5].letters[0],
                ":SixTwo": objectArray[5].letters[1],
                ":SixThree": objectArray[5].letters[2],
                ":Seven": objectArray[6].letters[0],
                ":SevenTwo": objectArray[6].letters[1],
                ":SevenThree": objectArray[6].letters[2]
            }
        };
        const values = await getItems(wordQuery);
        if (values.Items.length > 0 && values.Items != undefined) {
            wordArray.push(values);
        }
    }
    console.log('----wordArray----');
    console.log(wordArray);
return;











    try {
        const data = await getItems(params);
        console.log('---ReturnedItems---');
        console.log(data.Items[0].Characters.values);
        const letters = data.Items[0].Characters.values;
        for (let i = 0; i < letters.length; i++) {
            console.log(letters[i]);
            const params = {
                TableName: "voiceFoundry-VanityNumbers-Dictionary",
                IndexName: "FirstLetter",
                KeyConditionExpression: "#FirstLetter = :Letter",
                ExpressionAttributeNames: {
                    "#FirstLetter": "FirstLetter"
                },
                ExpressionAttributeValues: {
                    ":Letter": letters[i]
                }
                
                
            };
            const values = await getItems(params);
            console.log('***values***');
            console.log(values);
        }
        
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "http://alcandev.com",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(data),
        };
        return response;
    } catch (e) {
        return { error: e }
    }
}

function getItems(params) {
    try {
        const data = docClient.query(params).promise();
        return data;
    } catch (e) {
        return e;
    }
}

async function formatNumber(phoneNumber, index) {
    return phoneNumber.trim().replace('-','').slice(-7);
}

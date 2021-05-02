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
        objectArray.push(object);
    }
    let wordArray = [];
    let upperBound;

    for (let a = 0; a < objectArray.length; a++) {
        if (objectArray[a].number === '0') {
            objectArray = objectArray.splice(a + 1,objectArray.length);
            break;
        }
    }
    console.log('[[objectArray]]');
    console.log(objectArray);
    if (objectArray.length < 3) {
        return "Error: No Viable Solution due to 0 in number"
    } else {
        upperBound = objectArray.length - 2;
    }

    for (let o = 0; o < upperBound; o++) {
        for (let i = 0; i < 3; i++) {
            // There is probably a better way to do this.
            let three;
            let threeTwo;
            let threeThree;
            let four;
            let fourTwo;
            let fourThree;
            let five;
            let fiveTwo;
            let fiveThree;
            let six;
            let sixTwo;
            let sixThree;
            let seven;
            let sevenTwo;
            let sevenThree;


            if (objectArray[o+2] !== undefined) {
                three = objectArray[o+2].letters[0] 
            } else {
                three = null;
            }
            if (objectArray[o+2] !== undefined) {
                threeTwo = objectArray[o+2].letters[1];
            } else {
                threeTwo = null;
            }
            if (objectArray[o+2] !== undefined) {
                threeThree = objectArray[o+2].letters[2];
            } else {
                threeThree = null;
            }
            if (objectArray[o+3] !== undefined) {
                four = objectArray[o+3].letters[0] 
            } else {
                four = null;
            }
            if (objectArray[o+3] !== undefined) {
                fourTwo = objectArray[o+3].letters[1];
            } else {
                fourTwo = null;
            }
            if (objectArray[o+3] !== undefined) {
                fourThree = objectArray[o+3].letters[2];
            } else {
                fourThree = null;
            }
            if (objectArray[o+4] !== undefined) {
                five = objectArray[o+4].letters[0];
            } else {
                five = null;
            }
            if (objectArray[o+4] !== undefined) {
                fiveTwo = objectArray[o+4].letters[1];
            } else {
                fiveTwo = null;
            }
            if (objectArray[o+4] !== undefined) {
                fiveThree = objectArray[o+4].letters[2];
            } else {
                fiveThree = null;
            }
            if (objectArray[o+5] !== undefined) {
                six = objectArray[o+5].letters[0];
            } else {
                six = null;
            }
            if (objectArray[o+5] !== undefined) {
                sixTwo = objectArray[o+5].letters[1];
            } else {
                sixTwo = null;
            }
            if (objectArray[o+5] !== undefined) {
                sixThree = objectArray[o+5].letters[2];
           } else {
                sixThree = null;
           }
           if (objectArray[o+6] !== undefined) {
                seven = objectArray[o+6].letters[0];
            } else {
                seven = null;
            }
            if (objectArray[o+6] !== undefined) {
                sevenTwo = objectArray[o+6].letters[1];
           } else {
                sevenTwo = null;
           }
           if (objectArray[o+6] !== undefined) {
                sevenThree = objectArray[o+6].letters[2];
            } else {
                sevenThree = null;
            }
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
                                    or #FourthLetter = :FourthThree \
                                    or attribute_not_exists(#FourthLetter)) \
                                    and (#FifthLetter = :Fifth \
                                    or #FifthLetter = :FifthTwo \
                                    or #FifthLetter = :FifthThree \
                                    or attribute_not_exists(#FifthLetter)) \
                                    and (#SixthLetter = :Six \
                                    or #SixthLetter = :SixTwo \
                                    or #SixthLetter = :SixThree \
                                    or attribute_not_exists(#SixthLetter)) \
                                    and (#SeventhLetter = :Seven \
                                    or #SeventhLetter = :SevenTwo \
                                    or #SeventhLetter = :SevenThree\
                                    or attribute_not_exists(#SeventhLetter))",
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
                    ":Letter": objectArray[o].letters[i],
                    ":Second": objectArray[o+1].letters[0],
                    ":SecondTwo": objectArray[o+1].letters[1],
                    ":SecondThree": objectArray[o+1].letters[2],
                    ":Third": three,
                    ":ThirdTwo": threeTwo,
                    ":ThirdThree": threeThree,
                    ":Fourth": four,
                    ":FourthTwo": fourTwo,
                    ":FourthThree": fourThree,
                    ":Fifth": five,
                    ":FifthTwo": fiveTwo,
                    ":FifthThree": fiveThree,
                    ":Six": six,
                    ":SixTwo": sixTwo,
                    ":SixThree": sixThree,
                    ":Seven": seven,
                    ":SevenTwo": sevenTwo,
                    ":SevenThree": sevenThree
                }
            };
            const values = await getItems(wordQuery);
            if (values.Items.length > 0 && values.Items !== undefined) {
                values.Items.forEach(element => {wordArray.push(element.word)});
            }
        }
    }



    console.log('----wordArray----');
    console.log(wordArray);
    return;




    const wordQuery = {
        TableName: "voiceFoundry-VanityNumbers-Dictionary",
        IndexName: "FirstLetter",
        KeyConditionExpression: "#FirstLetter = :Letter",
        FilterExpression: "(#SecondLetter = :Second) \
                            and (#ThirdLetter = :Third) \
                            and (#FourthLetter = :Fourth) \
                            and (attribute_not_exists(#FifthLetter)) \
                            and (attribute_not_exists(#SixthLetter)) \
                            and (attribute_not_exists(#SeventhLetter))",
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
            ":Letter": "D",
            ":Second": "O",
            ":Third": "G",
            ":Fourth": "S"
        }
    };








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

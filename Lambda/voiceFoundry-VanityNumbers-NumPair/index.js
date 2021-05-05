'use strict';
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    // Placeholders for numbers or characters
    let firstNumber;
    let secondNumber;
    let thirdNumber;
    let fourthNumber;
    let fifthNumber;
    let sixthNumber;
    let seventhNumber;

    // Variables for the original phone number
    let firstNumberOrig;
    let secondNumberOrig;
    let thirdNumberOrig;
    let fourthNumberOrig;
    let fifthNumberOrig;
    let sixthNumberOrig;
    let seventhNumberOrig;

    // Variables to hold each character a number can be assigned. 
    // This seems a bit rediculous, but it makes the query for matching words significantly faster. 
    let two;
    let twoTwo;
    let twoThree;
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

    // Creating our object array to hold our first database response holding our number / character assignments.
    let objectArray = [];
    let wordArray = [];
    let upperBound;
    let storedPosition;
    let startingPosition = 7;
    let currentPosition;
    let phoneNumber;
    let resultMap;

    phoneNumber = event.phoneNumber;
    if (phoneNumber === undefined || phoneNumber.length < 7) {
        phoneNumber = event['Details']['Parameters']['phoneNumber'];
    }
    // format to remove all dashes and parentheses
    const result = formatNumber(phoneNumber);
    const numbers = result.trimmedNumber;
    const fullFormattedNumber = result.fullNumber;

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
        let object = {number: numbers[i], letters: data.Items[0].Characters.values};

        // setting number variables to be used later for remapping the words to the phone number.
        switch (i) {
            case 0:
                firstNumberOrig = numbers[i];
                break;
            case 1:
                secondNumberOrig = numbers[i];
                break;
            case 2:
                thirdNumberOrig = numbers[i];
                break;
            case 3:
                fourthNumberOrig = numbers[i];
                break;
            case 4:
                fifthNumberOrig = numbers[i];
                break;
            case 5:
                sixthNumberOrig = numbers[i];
                break;
            case 6:
                seventhNumberOrig = numbers[i];
                break;
            default: 
        }
        objectArray.push(object);
    }


    // START 0s and 1s Event Handling
    for (let a = 0; a < objectArray.length; a++) {
        // 0s and 1s do not have assigned letters, 
        // for now I am simply shortening the available words to the end of the number based on the position of the 0 or the 1. 
        // future improvements would be to be able to strattle the 0 or 1 with two words or use them in creative ways like having 1s be "L" in a word or 0 be "o".
        // this inevitably would be a business process decision for the customer to make when we went to impliment a solution (how they want it to work).
        if (objectArray[a].number === '0' || objectArray[a].number === '1') {
            storedPosition = a + 1;
        }
    }
    if (storedPosition !== undefined && storedPosition > 0) {
        objectArray = objectArray.splice(storedPosition,objectArray.length);
        startingPosition = startingPosition - storedPosition;
    }
    // END 0s and 1s Event Handling

    if (objectArray.length < 3) {
        resultMap = {
            message: 404
        };
        callback(null, resultMap);
        return;
    } else {
        upperBound = objectArray.length - 2;
    }
    
    // Loop through the available Digits
    for (let o = 0; o < upperBound; o++) {
        currentPosition = startingPosition - o;
        
        // Loop through the three available letters for the digit.
        for (let i = 0; i < 3; i++) {
            // There is probably a better way to do this... but I needed to filter on if the
            // index existed in the array to avoid errors on undefined. 
            // using ?? was not working as I am used to so I broke it out into basic if/else statements.

            if (objectArray[o+1] !== undefined) {
                two = objectArray[o+1].letters[0];
            } else {
                two = null;
            }
            if (objectArray[o+1] !== undefined) {
                twoTwo = objectArray[o+1].letters[1];
            } else {
                twoTwo = null;
            }
            if (objectArray[o+1] !== undefined) {
                twoThree = objectArray[o+1].letters[2];
            } else {
                twoThree = null;
            }
            if (objectArray[o+2] !== undefined) {
                three = objectArray[o+2].letters[0];
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
                four = objectArray[o+3].letters[0];
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

            // Query for matching words (Database exported from scrabble dictionary)
            // it is very important to use the attribute_not_exists() function so words shorter than the available phone number length can be found. 
            // If the customer preferred to only show vanity numbers at the very end of the number we could look at removing this, but available matches would drop significantly.
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
                    ":Second": two,
                    ":SecondTwo": twoTwo,
                    ":SecondThree": twoThree,
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
                values.Items.forEach(element => {
                    let date = new Date();
                    switch (currentPosition) {
                        case 7:
                            if (element.word[0]) { firstNumber = element.word[0] } else { firstNumber = firstNumberOrig }
                            if (element.word[1]) { secondNumber = element.word[1] } else { secondNumber = secondNumberOrig }
                            if (element.word[2]) { thirdNumber = element.word[2] } else { thirdNumber = thirdNumberOrig }
                            if (element.word[3]) { fourthNumber = element.word[3] } else { fourthNumber = fourthNumberOrig }
                            if (element.word[4]) { fifthNumber = element.word[4] } else { fifthNumber = fifthNumberOrig }
                            if (element.word[5]) { sixthNumber = element.word[5] } else { sixthNumber = sixthNumberOrig }
                            if (element.word[6]) { seventhNumber = element.word[6] } else { seventhNumber = seventhNumberOrig }
                            break;
                        case 6:
                            firstNumber = firstNumberOrig;
                            if (element.word[0]) { secondNumber = element.word[0] } else { secondNumber = secondNumberOrig }
                            if (element.word[1]) { thirdNumber = element.word[1] } else { thirdNumber = thirdNumberOrig }
                            if (element.word[2]) { fourthNumber = element.word[2] } else { fourthNumber = fourthNumberOrig }
                            if (element.word[3]) { fifthNumber = element.word[3] } else { fifthNumber = fifthNumberOrig }
                            if (element.word[4]) { sixthNumber = element.word[4] } else { sixthNumber = sixthNumberOrig }
                            if (element.word[5]) { seventhNumber = element.word[5] } else { seventhNumber = seventhNumberOrig }
                            break;
                        case 5: 
                            firstNumber = firstNumberOrig;
                            secondNumber = secondNumberOrig;
                            if (element.word[0]) { thirdNumber = element.word[0] } else { thirdNumber = thirdNumberOrig }
                            if (element.word[1]) { fourthNumber = element.word[1] } else { fourthNumber = fourthNumberOrig }
                            if (element.word[2]) { fifthNumber = element.word[2] } else { fifthNumber = fifthNumberOrig }
                            if (element.word[3]) { sixthNumber = element.word[3] } else { sixthNumber = sixthNumberOrig }
                            if (element.word[4]) { seventhNumber = element.word[4] } else { seventhNumber = seventhNumberOrig }
                            break;
                        case 4: 
                            firstNumber = firstNumberOrig;
                            secondNumber = secondNumberOrig;
                            thirdNumber = thirdNumberOrig;
                            if (element.word[0]) { fourthNumber = element.word[0] } else { fourthNumber = fourthNumberOrig }
                            if (element.word[1]) { fifthNumber = element.word[1] } else { fifthNumber = fifthNumberOrig }
                            if (element.word[2]) { sixthNumber = element.word[2] } else { sixthNumber = sixthNumberOrig }
                            if (element.word[3]) { seventhNumber = element.word[3] } else { seventhNumber = seventhNumberOrig }
                            break;
                        case 3: 
                            firstNumber = firstNumberOrig;
                            secondNumber = secondNumberOrig;
                            thirdNumber = thirdNumberOrig;
                            fourthNumber = fourthNumberOrig;
                            if (element.word[0]) { fifthNumber = element.word[0] } else { fifthNumber = fifthNumberOrig }
                            if (element.word[1]) { sixthNumber = element.word[1] } else { sixthNumber = sixthNumberOrig }
                            if (element.word[2]) { seventhNumber = element.word[2] } else { seventhNumber = seventhNumberOrig }
                            break;
                        default: 
                            break;
                    }
                    // Selecting First five returns, since this function starts with the longest words and then 
                    // decreases this will allow for the top 5 "Best" vanity numbers to be chosen. 
                    if (wordArray.length < 5) {
                        wordArray.push({
                            // way to get a unique Id without having to worry about checking the db first, use epoch time in miliseconds. 
                            PutRequest: {
                                Item: {
                                    Id: date.getTime() + Math.floor(Math.random() * 50),
                                    dateAdded: date.getTime(),
                                    dateId: 0,
                                    word: element.word,
                                    firstNumber: firstNumber,
                                    secondNumber: secondNumber,
                                    thirdNumber: thirdNumber,
                                    fourthNumber: fourthNumber,
                                    fifthNumber: fifthNumber,
                                    sixthNumber: sixthNumber,
                                    seventhNumber: seventhNumber,
                                    wordLength: element.word.length,
                                    vanityNumber: fullFormattedNumber.slice(0,3) + '-' + firstNumber + secondNumber + thirdNumber + '-' + fourthNumber + fifthNumber + sixthNumber + seventhNumber,
                                    parentNumber: fullFormattedNumber,
                                    ssmlVanityNumber: '<speak><prosody rate=\"65%\"><say-as interpret-as=\"spell-out\">' + fullFormattedNumber.slice(0,3) + firstNumber + secondNumber + thirdNumber + fourthNumber + fifthNumber + sixthNumber + seventhNumber + '</say-as></prosody></speak>'
                                }
                            }
                        });
                    }
                });
            }
        }
    }
    let batchWrite = {
        RequestItems: {
            "voiceFoundry-VanityNumbers-Results" : []
        }
    };
    if (wordArray.length <= 0 || wordArray === undefined) {
        // could not find any word matches for the provided number
        resultMap = {
            message: 404
        };
        callback(null, resultMap);
        return;
    }
    wordArray.forEach(item => {
        batchWrite.RequestItems['voiceFoundry-VanityNumbers-Results'].push(item);
    });
    try {
        await docClient.batchWrite(batchWrite).promise();
        console.log("---ALL GOOD---");
      } catch (e) {
        console.log(e.message);
      }
    
    resultMap = {
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
    let obj = {
        "trimmedNumber": phoneNumber.trim().replace(/\+/g,'').replace(/-/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\s/g,'').slice(-7),
        "fullNumber": phoneNumber.trim().replace(/\+/g,'').replace(/-/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\s/g,'')
    };
    if (obj['fullNumber'].length >= 11 ) {
        obj['fullNumber'] = obj['fullNumber'].slice(-10);
    }
    return obj;
}
TODO Create Documentation








# Project Requirements
## Mid-Level Development Project
```
We expect you to build this out as you would a production project for a client, only on a small scale (tests, error handling, etc). Where you don't have the time to implement something, add comments to your code or documentation on how you would have changed or added to your implementation in the "real world".
Deliverables
1.	Git Repo with all code and documentation
2.	BONUS - a working Amazon Connect phone number to test in your environment :-)
Exercise
1.	Create a Lambda that converts phone numbers to vanity numbers and save the best 5 resulting vanity numbers and the caller's number in a DynamoDB table. "Best" is defined as you see fit - explain your thoughts.
2.	Create an Amazon Connect contact flow that looks at the caller's phone number and says the 3 vanity possibilities that come back from the Lambda function.
3.	BONUS - Build a deployment package with AWS SAM, AWS CDK, or CloudFormation to allow a user, or assignment reviewer, to deploy your solution into their own AWS Account/Amazon Connect instance. (The contact flow can be imported manually, but include instructions!)
4.	SUPER BONUS - a web app that displays the vanity numbers from the last 5 callers.
5.	Writing and Documentation
1.	Record your reasons for implementing the solution the way you did, struggles you faced and problems you overcame.
2.	What shortcuts did you take that would be a bad practice in production?
3.	What would you have done with more time? We know you have a life. :-)
4.	BONUS - Please include an architecture diagram.
```


# Dev Log:
- 4/28/2021
    - 7:47pm - Accept Challenge from Belinda Nadalin
    - 8:00pm - Create Code Repo https://git-codecommit.us-east-1.amazonaws.com/v1/repos/amazonConnect-VanityNumbers
    - 8:30pm - Create two DynamoDB tables, one to map phone number to available characters and another to house a dictionary of possible words. Using a scrabble dictionary and using PowerShell to filter out any words over 7 characters Long (Maximum a US phone number can have excluding the country code and area code) or under 4 characters because we at least want the last four for a good vanity number.
        - voiceFoundry-VanityNumbers-NumPair
            - Schema

            |Number|Characters|
            |:----:|:---------|
            |   2  | {"A", "B", "C"} |
            
        - voiceFoundry-VanityNumbers-Dictionary
            - Schema
            
            |Id|Word|
            |:----:|:---------|
            |   0  | "ABANDON" |
            |   1   | "ABDOMEN" |
    - 10:48pm - Sorting of applicable words is completed and stored locally in a JSON file, need to bulk import into DynamoDB tomorrow.

- 4/29/2021    
    - 7:30am - Attempting to learn DynamoDB bulk import before work hours start.
    - EOD - I gave up on bulk import and just let a script upload data for a few hours one by one, had a day job to get to :). All Dictionary items are now in the DynamoDB. 

- 4/30/2021 
    - (Note: My current Employer has 9/80 schedules, meaning we work 9 hours a day and then get every other friday off. I lucked out and this is my 9/80 friday! Meaning my only goals for today are School and this project. I am coming up on finals for Calc 1 so I have to finish that homework / study time before I can really get started on this sadly... this is more fun than Calculus! lol)

    - 9:00am Goal Setting before starting on Calculus. Today is lambda day, time to build the functions for interacting with the DynamoDB service.
        - Goals for today 
            - Complete Lambda functions for calculating the Vanity Numbers
                - Get number matches from DynamoDB Table voiceFoundry-VanityNumbers-NumPair.
                - Query DynamoDB table voiceFoundry-VanityNumbers-Dictionary for possible word matches.
            - Create new DynamoDB table to store results
                - Create Lambda functions for puts and gets on this database.
    - 9:11am Calculus Time!
    - 3:00pm Starting on Lambda Functions
    - EOD - Lambda function for generating the vanity number is mostly working. The majority of the issues I have been having are with DynamoDB and finding an economical way to pull words out of my dictionary database. I have settled on a Global Secondary Index based on a column that is the first letter of each word. I will let the Index run over night. See FixDynamoDB.ps1 for adding the FirstLetter Column.         
    - voiceFoundry-VanityNumbers-Dictionary
        - New Schema
            
        |Id|FirstLetter (GSI)|Word|
        |:----:|:---:|:---------|
        |   0  | A | "ABANDON" |
        |   1  | A | "ABDOMEN" |

- 5/1/2021
    - 7:36AM The Global Secondary Index worked for allowing me to pull all words with my desired starting letter, this is a big win. The downside is my database of words is too large to be reasonably used. Currently I have 72,997 words available in my dictionary. I plan to cull my data down to include ONLY words with 7 characters instead of anything between 4 and 7 characters as it is now. Hopefully that will bring the word count down enough that we can efficiently look through applicable words in Lambda. ___I would have preffered to keep it where the vanity numbers were not locked to "full length" vanity numbers, but with my limited time I believe this is the best route. I hope it does not bite me in the end with not having enough words to match every possible combination of numbers!___
    - 9:30AM Culling completed new total count of available words is: 32,899... next idea to keep memory use low in Lambda is to break each remaining word out into individual characters, that way I can query the DB in loops and only pull out words that are actual matches instead of pulling large data sets down into lambda and then iterating over them. This may or may not work out, but I can have it run while I am off doing other things (have a baby shower to go to for a friend this morning). See CharacterBreakOut.ps1.
    - 9:46AM Found my Culling messed up my indexing, having to fix that... see fixIndex.ps1
    - 1:38pm realized in testing that 0's do not have any letters assigned to them on a touchtone phone, meaning I will need to have error handling to cover phone numbers that have 0's in the last 7 digits of the number.
    - 2:45pm lambda funciton is working, but limiting my returns to 7 character "full" vanity numbers is very limiting to the results, especially with the 0's issue. To Fulfill returning a top 3 or 5 numbers I will need to add more options to the dictionary. Meaning the work I did earlier to Cull the number of results is actually hurting results... I will need to go back to the full dictionary, but keep the current schema. (NewDictionaryIngest.ps1)
        - New Schema

        |Id|FirstLetter | Second Letter | Third Letter |Word|
        |:----:|:---:|:---:|:---:|:---------|
        |   0  | H | A | T | "HAT" |
    
    - 8:27pm Finally got the filtering out 0 working and pulling smaller words from dynamoDB. the use of attribute_not_exists() was a crucial piece and using null will not work as expected in dynamoDB. Currently the Lambda function will pull words in the middle of the phone number, for example if the number is 1-800-350-3647 one result would be 1-800-350-DOG7. I do not really like this, but at this time I need to move on. ___If I find I have more time later on this is one thing I would like to fix.___ 
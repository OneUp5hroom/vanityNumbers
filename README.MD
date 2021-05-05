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

# Project Documentation
### Deliverables
1. Git Repo with all code and documentation: AWS Code Commit [Link](https://console.aws.amazon.com/codesuite/codecommit/repositories/amazonConnect-VanityNumbers/browse?region=us-east-1)
2. Working Amazon Connect phone Number: 1 (214) 25-OKAY-3 / 1 (214) 256-5293.
### Exercise
1. Lambda Functions:
    - voiceFoundry-VanityNumbers-GetVanityNumbers
        - Description: Gets created vanity numbers from the results dynamoDB table. 
    - voiceFoundry-VanityNumbers-NumPair
        - Description: Creates vanity numbers based on phoneNumber input variable.
    - voiceFoundry-VanityNumbers-GetTopFive
        - Description: Gets the last five parentNumbers in the results dynamoDB table and returns their data.
2. Amazon Connect: Contact Flow Completed.
    - TODO add docs for this ***TODO***
3. BONUS: CloudFormation: ***TODO***
    - I was unable to complete this step, it was something I was already not confident I could complete in an efficient manor because it would have been my first CloudFormation document. One limitation of my current role is this task is offloaded to the Cloud DevOps folks so I do not have experience with it. In the end I was hopeful that I would have the time to complete this step, if not purely for my own education, but I ran out of time. This is on the list of things I would have liked to finish if I had more time. 
4. BONUS: WebSite:
    - URL: okay.alcandev.com
    - AngularCLI v11.2.10 /node.js v16.0.0 
5. Finalize Documentation and make public ***TODO***
    - BONUS: Architecture Diagram. ***TODO***

6. Write the story ***TODO***



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
    - EOD tomorrow I will need to figure out plugging the words back into the number in the Lambda function and returning that to the final DynamoDB table. After that is complete we should be off to the races. 
- 5/2/2021
    - 7:30am Need to finish mapping the found words to the proper placement in the phone number and returning the vanity numbers to the customer.
    - 11:00am Lambda function is complete and working properly. Time to start on Amazon Connect.
    - 2:00pm base Amazon Contact Flow is working as expected, need to create a Lambda function to read from the database of submitted items so the contact flow can read the results back to the customer.
    - EOD, got distracted with life and was not able to make as much progress as I would have liked. The call center is up and the call flow is working to the point of generating new vanity numbers and reading the top two back to the customer. The call flows quickly became overwhelming to look at and my next task for myself will be to break them out into multiple flows so they are easier to follow. 
- 5/3/2021
    - 7:42am Because today is Monday I will have to try to make a lot of progress in a very short amount of time this evening. I will need to reserve at least one day for cleaning up documentation so I hope I will have enough time to deliver a complete project. 
    - 6:35pm Testing is going well, I am not liking how things are sounding when the vanity numbers are read out. Researching it looks like the only way for me to hear the numbers in an acceptable way would be to integrate SSML into my database entry. This will take modifying the lambda code.. again. While editing I discovered an issue with letter placement in the Lambda code anyways, so I will need to fix that. 
    - 8:42pm Fixed Vanity Number placement in word, and added SSML integration. I think we are at a good place for the contact flow. I would like to integrate LEX into the contact flow, but I do not think I will have the time. Instead I will try to knock off some more bonus items.
    - 8:49PM while testing I admit it is a bit weird on the reading of the vanity numbers, I am going to add where it will read the word first, then the number to help it be less jarring. 
    - 8:56PM Updates to the call flow are complete, I think I am getting the hang of this.
- 5/4/2021
    - Started working on the website, API Gateway and updated lambda calls. Hurdle of how to pull last five items sorted by date submitted. Only way I found to do this is to set a column in dynamoDB called dateId that is set to 0 for all objects. this way I can query on it and sort by dateAdded (the timestamp of when it was generated.)
- 5/5/2021
    - The website is working for the most part, it still needs a ton of work... including making it mobile compatible.. it really only works on desktop browsers for the time being... but for these purposes it will have to be good enough since I have to finish documentation tonight!
    - While trying to keep everything in AWS, I decided to use their CodeCommit service instead of my typical github / AzureDevOps. Looks like this is addding an additional challenge I'll need to figure out since you cannot make a CodeCommit repo public. I will have to figure out how to migrate this repo, with history, over to github.
    - That ended up being really easy (thank goodness) my repo has been updated to github. 
    
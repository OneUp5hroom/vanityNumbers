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
    - 8:30pm - Create two DynamoDB tables, one to map phone number to available characters and another to house a dictionary of possible words. Using a scrabble dictionary and using PowerShell to filter out any words over 7 characters Long (Maximum a US phone number can have excluding the country code and area code)
        - voiceFoundry-VanityNumbers-NumPair
            - Schema
            |Number|Characters|
            |------|----------|
            |   2  | {"A", "B", "C"} |

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
    - URL: [okay.alcandev.com](http://okay.alcandev.com)
    - AngularCLI v11.2.10 /node.js v16.0.0 
5. Finalize Documentation and make public ***TODO***
    - BONUS: Architecture Diagram. ***TODO***

# Documentation
### Network Diagram
![NetworkDiagram](https://user-images.githubusercontent.com/29815567/117234444-9fce9300-adea-11eb-8ea5-02ab71a50c1a.png)


### Amazon API Gateway

### Website
- URL: [okay.alcandev.com](http://okay.alcandev.com)

            - Infrastructure: 
            - Code Deployment: AWS S3 bucket
            - API: AWS API Gateway
            - Compute: AWS Lambda (Node 14.x)
            - Database: AWS DynamoDB

            Code Base:
            - GitHub Repo: https://github.com/OneUp5hroom/vanityNumbers
            - Angular CLI: 11.2.10
            - Node: 16.0.0
            - OS: win32 x64
            - @angular-devkit/architect       0.1102.10
            - @angular-devkit/build-angular   0.1102.10
            - @angular-devkit/core            11.2.10
            - @angular-devkit/schematics      11.2.10
            - @angular/cli                    11.2.10
            - @schematics/angular             11.2.10
            - @schematics/update              0.1102.10
            - rxjs                            6.6.7
            - typescript                      4.1.5
### Lambda Functions
    - voiceFoundry-VanityNumbers-GetVanityNumbers
        - Description: Gets created vanity numbers from the results dynamoDB table. 
    - voiceFoundry-VanityNumbers-NumPair
        - Description: Creates vanity numbers based on phoneNumber input variable.
    - voiceFoundry-VanityNumbers-GetTopFive
        - Description: Gets the last five parentNumbers in the results dynamoDB table and returns their data.
### DynamoDB Tables
- voiceFoundry-VanityNumbers-Dictionary
    - Stores the dictionary of words that can be possible matches with entered phone numbers.
    - 74,290 words are contained in this Dictionary.
    - Schema

    |Id|Word|FirstLetter|SecondLetter|ThirdLetter|FourthLetter|FifthLetter|SixthLetter|SeventhLetter
    |:----:|:---------|:--|:--|:--|:--|:--|:--|:--|
    |   0  | "ABANDON" | "A" | "B" | "A" | "N" | "D" | "O" | "N" |

- voiceFoundry-VanityNumbers-NumPair
    - Stored available character matches for the phone dialpad.
    - Schema

    |Number|Characters|
    |:----:|:---------|
    |   2  | {"A", "B", "C"} |

- voiceFoundry-VanityNumbers-Results
    - Stores matched Numbers with thir vanity results
    - Schema

    |Id|wordLength|dateAdded|dateId|firstNumber|secondNumber|thirdNumber|fourthNumber|fifthNumber|sixthNumber|seventhNumber|parentNumber|ssmlVanityNumber|vanityNumber|word|
    |--|----------|---------|------|-----------|------------|-----------|------------|-----------|-----------|-------------|------------|----------------|------------|----|
    |00|4         |1620235398822|0 |F|L|O|W|E|R|S|8003569377|\<speak\>\<prosody rate\=\"65%\"\>\<say-as interpret-as\=\"spell-out\"\>800FLOWERS\<\/say-as\>\<\/prosody\>\<\/speak\>|800-FLO-WERS|FLOWERS|

### Amazon Connect
    - Amazon Connect phone Number: 1 (214) 25-OKAY-3 / 1 (214) 256-5293.
    - See [Contact Flow Diagrams](./AmazonConnectDiagrams.md)

### Retrospective

#### Final Thoughts (TL;DR)
This project ended up being much more of a brain teaser than I initially expected, but I learned a lot about AWS resources that I have never played with before. I had challenges this week that ranged from data issues, to logic problems, to the general struggle of learning a new tool. Yet, in the end, I was able to produce a product that I can be proud of... it is in no way ready for production! Thank you for providing this challenge, I had a ton of fun with it and I hope you like my fake company "OKAY Industries". (The name was chosen because the phone number Amazon Connect generated came out with "1-214-25OKAY3" when I ran it through my lambda function.)

#### Project Constraints
My initial approach to the problem was to try to put some constraints around what would make for a minimally viable product. Typically this would be a meeting or two.. or five.. with the customer. Since this was just an exercise I decided to try to form these constraints on my own. I decided that my constraints would be that this application would only provide words that are longer than 4 characters and no more than 7 characters. This seemed like a good fit for a phone number and overall was within the normal for vanity numbers I found on Google. 
    
#### The Data
After setting constraints my next step was to build my dataset. For this portion of the project I pulled heavily from my experience in data analytics / visualization. In hindsight, my past experience caused a lot of issues with this project because the majority of my experience with data is in relational databases. 

To start on the data I had to find a source, and the only easily ingestible source I found was a simple list of words taken from the board game Scrabble - [Data Source](https://raw.githubusercontent.com/jmlewis/valett/master/scrabble/sowpods.txt). After gathering the data I placed it in my first dynamoDB table with a very basic Schema... I bet you can see here, that this caused major issues as I started to build queries for dynamoDB.
- voiceFoundry-VanityNumbers-Dictionary
	- Schema

  |Id|Word|
  |:----:|:---------|
  |   0  | "ABANDON" |
  |   1   | "ABDOMEN" |

Next I prepared a simple dynamoDB table to map a phone keypad to the available letters for each number. This table did not change much throughout the project after it's initial creation.
- voiceFoundry-VanityNumbers-NumPair
	- Schema

  |Number|Characters|
  |:----:|:---------|
  |   2  | {"A", "B", "C"} |
  
Using a combination of queries from the NumPair table and the Dictionary table I started to build out my first function to generate the desired vanity numbers. While building these queries I quickly found issues with response time from my Dictionary database, which was sitting at 72,997 items. At the time I believed the reason for my slow query time was I had too many items in my database. This thought started me down a road of what felt like never ending rebuilds of the Dictionary database table trying to remove unneeded words. In the end I had a small table of ONLY 7 letter words with my item count being 32,899. __This was my first real struggle__. Long story short, after burning through 4 of my 7 available days for this project just on data and building my queries, I finally had something that worked and worked well. I extended my dictionary table's schema to work better with how queries run in DynamoDB and was able to rebuild my dictionary one final time to where it is today. (74,290 items). This schema change plus adding a global secondary index on the FirstLetter column made it possible to pull down vanity number matches in under 3 seconds (usually). I also increased my library count by increasing my scope to include three letter words.

- voiceFoundry-VanityNumbers-Dictionary
	- Final Schema

  |Id|Word|FirstLetter|SecondLetter|ThirdLetter|FourthLetter|FifthLetter|SixthLetter|SeventhLetter
  |:----:|:---------|:--|:--|:--|:--|:--|:--|:--|
  |   0  | "ABANDON" | "A" | "B" | "A" | "N" | "D" | "O" | "N" |
  
#### Lambda
Data issues aside, Lambda provided plenty of its own challenges. For this project I created a total of 3 lambda scripts, but looking back on it __if I were to do it again or had more time__ I would split my main function out into multiple scripts.
- voiceFoundry-VanityNumbers-GetVanityNumbers
	- Description: Gets created vanity numbers from the results dynamoDB table. 
- voiceFoundry-VanityNumbers-NumPair
	- Description: Creates vanity numbers based on phoneNumber input variable.
- voiceFoundry-VanityNumbers-GetTopFive
	- Description: Gets the last five parentNumbers in the results dynamoDB table and returns their data.

My biggest struggle when it came to these lambda functions was in the NumPair function, figuring out how to keep the DynamoDB query fast, but also being able to handle the data on the return and accurately place the matched words in the phone number __was a real challenge__. I had several instances where the vanity number should have been 907-350-5KON, but it ended up placing the word incorrectly as 907 35K-ON66. Working through the logic puzzle of how to fix this issue took a long time, but it was satisfying in the end when I got it working. I am not the most confident in my solution to this issue, if this were to go into production it would need extensive testing as I continued to find bugs with it as I moved forward with development.

#### Contact Flow
Amazon connect is a completely new part of AWS to me, and it was a fun technology to dip my toes into. The first thing I did for this part of the project is pull up Pluralsight, I consider Pluralsight my secret weapon and will probably keep a subscription for the rest of my career. After a surprisingly short tutorial, I was off to the races in creating my contact flow. I honestly did not run into many challenges with contact flows other than figuring out how to use SSML, how to work with parameters, and the fact that the single contact flow I started with became unmanageable quickly! The biggest improvement I made here was completely remaking the contact flow as modularized pieces. Each contact flow calling the next instead of having the full workflow crammed into one. 

#### Website
The last thing I was able to accomplish for this project was building a quick and messy serverless Angular/Node.JS website to display the results of the contact flow. __This website has a LOT of things that would need to be cleaned up before going to production__. I was running low on time when I finally got to the point of being able to work on the website, but luckily I had several advantages in this department. I had already created and tested my lambda functions. I also had an available domain to use in Route53. Using the AngularCLI, I was able to generate a quick site and publish it with minimal functionality. I will admit I increased the scope a bit on the website from just displaying the last five numbers to adding a lookup page as well. This wasn't too difficult since it leveraged existing functions. I think it makes the website much more usable because you can generate vanity numbers from the website using the lookup.

#### Git
The only remaining hurdle I had on my last day of development was one that was quite unexpected. I had not understood when I first created my repo using AWS CodeCommit that CodeCommit repos cannot be public, meaning I could not share this documentation / repo with anyone without adding them to my personal IAM. Luckily, moving my repo with all of the history was quite easy and following this tutorial worked like a charm! [Link](https://www.atlassian.com/git/tutorials/git-move-repository).

#### Conclusion
In the end I am very proud of what I was able to create in a week and I am very happy with this vetting process. I've always felt like in person code tests while three people you don't know are watching you is not a great way to really test a person's abilities. Thank you for the opportunity to participate in this challenge, I have learned way more than I thought I would going into it. My only real regret was not being able to get to building out the CloudFormation template, I have no experience in CloudFormation because our DevOps team at my employer handles those for us. When I started I also wanted to add Lex into my project to take advantage of NLP, but sadly I ran out of time before being able to do that too.

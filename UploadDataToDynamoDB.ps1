# Script Uploads db items one by one.
# If this would be intended to be used long term with repeated uses
# I would have implimented runspaces with batch uploads in DynamoDB.

# If this were intended to be used by a client, for repeated uploads to DynamoDB from a csv or json file
# I would have implimented a Lambda script (probably in python) to monitor an S3 bucket and when a file
# Is uploaded to the S3 bucket the Lambda script automatically process it into DynamoDB.

# In the end all I am trying to say is PowerShell was my first language, so it is my easiest go to
# when in a time crunch while keeping in mind that this is purely for my own use and this script is not intended to be used by a customer.

# Another note, if you are wanting to test this script you will need to set up credentials in IAM and save them in a profile locally. 
# Set-AWSCredentials -AccessKey AKIA0123456787EXAMPLE -SecretKey wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY -StoreAs MyNewProfile
#                                ^^ This is not my key or secret key, this is an exerpt from AWS's documentation on the AWS.Tools for PowerShell Module. 

$awsCredential = Get-AWSCredential -ProfileName profilename
$region = [Amazon.RegionEndpoint]::GetBySystemName('us-east-1')
$client = New-Object -TypeName Amazon.DynamoDBv2.AmazonDynamoDBClient -ArgumentList $region
$table = [Amazon.DynamoDBv2.DocumentModel.Table]::LoadTable($client, "voiceFoundry-VanityNumbers-Dictionary")
#                        vv Gets local location, only really works if you are running the file from powershell.. if you wanted to copy paste this code you will have to manually modify this path to match the right location of your JSON file. 
$json = Get-Content "$(Get-Location)\wordDictionary.json" | ConvertFrom-JSON

foreach ($item in $json.Dictionary) {
    $subJson = $item | ConvertTo-Json

    $document = [Amazon.DynamoDBv2.DocumentModel.Document]::FromJson($subJson)
    try {
        $table.PutItem($document)
    } catch {
        # When Write capacity units are hit, chill out for 5 minutes and retry. This is only hit in mid-large data sets. 
        # Even with 72k words being uploaded this was only it a few times. (at 15 Write Capacity Units)... when the DynamoDB was set to 5 capactiy units it was hit about every 4.5k words.
        Write-Host "Having to Sleep: $(Get-Date)"
        start-sleep -Seconds 300
        $table.PutItem($document)
    }
}
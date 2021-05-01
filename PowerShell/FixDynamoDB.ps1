$awsCredential = Get-AWSCredential -ProfileName profilename
$region = [Amazon.RegionEndpoint]::GetBySystemName('us-east-1')
$client = New-Object -TypeName Amazon.DynamoDBv2.AmazonDynamoDBClient -ArgumentList $region
$table = [Amazon.DynamoDBv2.DocumentModel.Table]::LoadTable($client, "voiceFoundry-VanityNumbers-Dictionary")

for ($i = 0; $i -le 72998; $i ++) {
    $stuff = $table.GetItem($i)
    $newKey = $stuff['word'].value[0]
    $newJSON = "{`"Id`": $i,`"FirstLetter`": `"$newKey`",`"word`": `"$($stuff['word'])`"}"
    Write-Host "$NewJSON" -foregroundcolor yellow
    $document = [Amazon.DynamoDBv2.DocumentModel.Document]::FromJson($newJSON)
    try {
        $table.UpdateItem($document)
    } catch {
        # When Write capacity units are hit, chill out for 5 minutes and retry. This is only hit in mid-large data sets. 
        # Even with 72k words being uploaded this was only it a few times. (at 15 Write Capacity Units)... when the DynamoDB was set to 5 capactiy units it was hit about every 4.5k words.
        Write-Host "Having to Sleep: $(Get-Date)"
        start-sleep -Seconds 300
        $table.UpdateItem($document)
    }
}

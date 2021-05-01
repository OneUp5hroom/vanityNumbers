$awsCredential = Get-AWSCredential -ProfileName profilename
$region = [Amazon.RegionEndpoint]::GetBySystemName('us-east-1')
$client = New-Object -TypeName Amazon.DynamoDBv2.AmazonDynamoDBClient -ArgumentList $region
$table = [Amazon.DynamoDBv2.DocumentModel.Table]::LoadTable($client, "voiceFoundry-VanityNumbers-Dictionary")

# The reason I am going in reverse is so as I delete Items my indexes do not change.
for ($i = 72996; $i -ge 0; $i--) {
    $stuff = $table.GetItem($i)
    $word = $stuff['word'].value
    Write-Host "word: $word, Length: $($word.length)" -foregroundcolor yellow
    if ($word.length -ne 7) {  
        Write-Host "word: $word, Action: Deleted" -foregroundcolor red
        try {
            $table.DeleteItem($i)
        } catch {
            # When Write capacity units are hit, chill out for 5 minutes and retry. This is only hit in mid-large data sets. 
            # Even with 72k words being uploaded this was only it a few times. (at 15 Write Capacity Units)... when the DynamoDB was set to 5 capactiy units it was hit about every 4.5k words.
            Write-Host "Having to Sleep: $(Get-Date)"
            start-sleep -Seconds 300
            $table.DeleteItem($i)
        }
    }
    Write-Host "word: $word, Action: Ignore" -foregroundcolor Green
}
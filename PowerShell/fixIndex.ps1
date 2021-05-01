$awsCredential = Get-AWSCredential -ProfileName profilename
$region = [Amazon.RegionEndpoint]::GetBySystemName('us-east-1')
$client = New-Object -TypeName Amazon.DynamoDBv2.AmazonDynamoDBClient -ArgumentList $region
$table = [Amazon.DynamoDBv2.DocumentModel.Table]::LoadTable($client, "voiceFoundry-VanityNumbers-Dictionary")

$nextIndex = 0;
for ($i = 0; $i -lt 72997; $i ++) {
    $stuff = $null
    $stuff = $table.GetItem($i)
    if ($stuff) {
        $object = [PSCustomObject]@{
            Id = $nextIndex;
            word = $stuff['word'].value
        }
        $JSON = $object | ConvertTo-JSON
        Write-Host $JSON -foregroundcolor Yellow
        $document = [Amazon.DynamoDBv2.DocumentModel.Document]::FromJson($JSON)
        if ($stuff['Id'].value -ne $nextIndex) {
            try {
                $table.PutItem($document)
                $table.DeleteItem($i)
            } catch {
                # When Write capacity units are hit, chill out for 5 minutes and retry. This is only hit in mid-large data sets. 
                Write-Host "Having to Sleep: $(Get-Date)"
                start-sleep -Seconds 300
                $table.PutItem($document)
                $table.DeleteItem($i)
            }
        }
        $nextIndex++
    }
}
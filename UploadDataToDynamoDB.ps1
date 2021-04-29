$awsCredential = Get-AWSCredential -ProfileName profilename
$region = [Amazon.RegionEndpoint]::GetBySystemName('us-east-1')
$client = New-Object -TypeName Amazon.DynamoDBv2.AmazonDynamoDBClient -ArgumentList $region
$table = [Amazon.DynamoDBv2.DocumentModel.Table]::LoadTable($client, "voiceFoundry-VanityNumbers-Dictionary")
$json = Get-Content 'C:\Users\1\Documents\dev\amazonConnect-VanityNumbers\wordDictionary.json'
$test = $json[0..13].trim(',') + "`n]`n}"
$document = [Amazon.DynamoDBv2.DocumentModel.Document]::FromJson($test)
$table.PutItem($document)
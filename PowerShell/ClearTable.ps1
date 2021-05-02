$awsCredential = Get-AWSCredential -ProfileName profilename
$region = [Amazon.RegionEndpoint]::GetBySystemName('us-east-1')
$client = New-Object -TypeName Amazon.DynamoDBv2.AmazonDynamoDBClient -ArgumentList $region
$table = [Amazon.DynamoDBv2.DocumentModel.Table]::LoadTable($client, "voiceFoundry-VanityNumbers-Dictionary")

for ($i = 32899; $i -ge 0; $i--) {
    $table.DeleteItem($i)
}
$awsCredential = Get-AWSCredential -ProfileName profilename
$region = [Amazon.RegionEndpoint]::GetBySystemName('us-east-1')
$client = New-Object -TypeName Amazon.DynamoDBv2.AmazonDynamoDBClient -ArgumentList $region
$table = [Amazon.DynamoDBv2.DocumentModel.Table]::LoadTable($client, "voiceFoundry-VanityNumbers-Dictionary")

$standardWordLength = 7;
for ($i = 0; $i -lt 32899; $i++) {
    $stuff = $table.GetItem($i)
    for ($j = 0; $j -lt $standardWordLength; $j++) {
        switch ($j) {
            0{$column = 'FirstLetter'}
            1{$column = 'SecondLetter'}
            2{$column = 'ThirdLetter'}
            3{$column = 'FourthLetter'}
            4{$column = 'FifthLetter'}
            5{$column = 'SixthLetter'}
            6{$column = 'SeventhLetter'}
        }
        $null = New-Variable -Name $column -value $stuff['word'].value[$j]
    }
    $word = $stuff['word'].value
    $object = $null
    $object = [PSCustomObject]@{
        Id = $i;
        word = $word;
        FirstLetter = $FirstLetter;
        SecondLetter = $SecondLetter;
        ThirdLetter = $ThirdLetter;
        FourthLetter = $FourthLetter;
        FifthLetter = $FifthLetter;
        SixthLetter = $SixthLetter;
        SeventhLetter = $SeventhLetter;
    }
    $JSON = $object | ConvertTo-JSON
    $null = Remove-Variable FirstLetter, SecondLetter, ThirdLetter, FourthLetter, FifthLetter, SixthLetter, SeventhLetter
    Write-Host "$JSON" -foregroundcolor yellow
    $document = [Amazon.DynamoDBv2.DocumentModel.Document]::FromJson($JSON)

    try {
        $table.UpdateItem($document)
    } catch {
        # When Write capacity units are hit, chill out for 5 minutes and retry. This is only hit in mid-large data sets. 
        Write-Host "Having to Sleep: $(Get-Date)"
        start-sleep -Seconds 300
        $table.UpdateItem($document)
    }
}
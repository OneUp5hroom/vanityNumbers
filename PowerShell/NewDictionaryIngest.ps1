$list = (Invoke-WebRequest 'https://raw.githubusercontent.com/jmlewis/valett/master/scrabble/sowpods.txt' -UseBasicParsing).content.split("`n")

$useFulWords = @()
Foreach ($item in $list) {
    $item = $item.trim()
    if ($item.length -ge 3 -AND $item.length -le 7) {
        $useFulWords += $item
    }
}


$awsCredential = Get-AWSCredential -ProfileName profilename
$region = [Amazon.RegionEndpoint]::GetBySystemName('us-east-1')
$client = New-Object -TypeName Amazon.DynamoDBv2.AmazonDynamoDBClient -ArgumentList $region
$table = [Amazon.DynamoDBv2.DocumentModel.Table]::LoadTable($client, "voiceFoundry-VanityNumbers-Dictionary")

$i = 0;
foreach ($word in $useFulWords) {
    for ($j = 0; $j -lt $word.length; $j++) {
        switch ($j) {
            0{$column = 'FirstLetter'}
            1{$column = 'SecondLetter'}
            2{$column = 'ThirdLetter'}
            3{$column = 'FourthLetter'}
            4{$column = 'FifthLetter'}
            5{$column = 'SixthLetter'}
            6{$column = 'SeventhLetter'}
        }
        $null = New-Variable -Name $column -value $word[$j]
    }
    $object = $null
    $object = [PSCustomObject]@{
        Id = $i;
        word = $word;
        FirstLetter = $FirstLetter;
        SecondLetter = $SecondLetter;
        ThirdLetter = $ThirdLetter;
    }
    if ($FourthLetter) {
        $object | Add-Member -MemberType NoteProperty -Name "FourthLetter" -Value $FourthLetter
    }
    if ($FifthLetter) {
        $object | Add-Member -MemberType NoteProperty -Name "FifthLetter" -Value $FifthLetter
    }
    if ($SixthLetter) {
        $object | Add-Member -MemberType NoteProperty -Name "SixthLetter" -Value $SixthLetter
    }
    if ($SeventhLetter) {
        $object | Add-Member -MemberType NoteProperty -Name "SeventhLetter" -Value $SeventhLetter
    }
    $JSON = $object | ConvertTo-JSON
    $null = Remove-Variable FirstLetter, SecondLetter, ThirdLetter, FourthLetter, FifthLetter, SixthLetter, SeventhLetter -ErrorAction SilentlyContinue
    Write-Host "$JSON" -foregroundcolor yellow
    $document = [Amazon.DynamoDBv2.DocumentModel.Document]::FromJson($JSON)

    try {
       $table.PutItem($document)
    } catch {
        # When Write capacity units are hit, chill out for 5 minutes and retry. This is only hit in mid-large data sets. 
        Write-Host "Having to Sleep: $(Get-Date)"
        start-sleep -Seconds 300
        $table.PutItem($document)
    }
    $i++
}
param(
  [string]$DataFile = "src/data/dynastyData.ts",
  [string]$OutputDir = "public/buildings-web",
  [string]$MapFile = "src/data/buildingImageMap.generated.ts",
  [string]$CreditFile = "src/data/buildingImageCredits.generated.ts",
  [switch]$ForceRefresh
)

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

if (!(Test-Path -LiteralPath $DataFile)) {
  throw "Data file not found: $DataFile"
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$headers = @{
  "User-Agent" = "ChinaArchitectureDatasetBot/1.0 (academic-project)"
}

function Parse-BuildingEntries {
  param([string]$RawText)

  $result = New-Object System.Collections.Generic.List[object]
  $seen = @{}

  $patternGet = 'getBuildingImage\("([^"]+)",\s*"([^"]+)"\)'
  $matchesGet = [regex]::Matches($RawText, $patternGet, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  foreach ($m in $matchesGet) {
    $name = $m.Groups[1].Value.Trim()
    $query = $m.Groups[2].Value.Trim()
    if (!$name -or $seen.ContainsKey($name)) { continue }
    $seen[$name] = $true
    $result.Add([pscustomobject]@{
      name = $name
      query = $query
    })
  }

  return $result
}

function Read-ExistingMap {
  param(
    [string]$MapPath,
    [string]$ImageRootDir
  )

  $existing = @{}
  if (!(Test-Path -LiteralPath $MapPath)) {
    return $existing
  }

  $rawMap = Get-Content -Path $MapPath -Raw -Encoding UTF8
  $pairMatches = [regex]::Matches($rawMap, '"([^"]+)"\s*:\s*"([^"]+)"')
  foreach ($m in $pairMatches) {
    $name = $m.Groups[1].Value
    $relPath = $m.Groups[2].Value
    $fileName = [IO.Path]::GetFileName($relPath)
    if (!$fileName) { continue }
    $fullPath = Join-Path $ImageRootDir $fileName
    if (Test-Path -LiteralPath $fullPath) {
      $existing[$name] = "/buildings-web/$fileName"
    }
  }
  return $existing
}

function Read-ExistingCredits {
  param([string]$CreditPath)

  $existing = @{}
  if (!(Test-Path -LiteralPath $CreditPath)) {
    return $existing
  }

  $raw = Get-Content -Path $CreditPath -Raw -Encoding UTF8
  $entryRegex = [regex]'\{\s*name:\s*"([^"]+)",\s*source:\s*"([^"]+)",\s*license:\s*"([^"]+)",\s*url:\s*"([^"]+)"\s*\}'
  $matches = $entryRegex.Matches($raw)
  foreach ($m in $matches) {
    $existing[$m.Groups[1].Value] = [pscustomobject]@{
      name = $m.Groups[1].Value
      source = $m.Groups[2].Value
      license = $m.Groups[3].Value
      url = $m.Groups[4].Value
    }
  }
  return $existing
}

function Get-ExtensionFromUrl {
  param([string]$ImageUrl)
  try {
    $ext = [IO.Path]::GetExtension(([uri]$ImageUrl).AbsolutePath).ToLowerInvariant()
  } catch {
    $ext = ".jpg"
  }
  if ($ext -notin @(".jpg", ".jpeg", ".png", ".webp")) {
    $ext = ".jpg"
  }
  return $ext
}

function New-AsciiImageName {
  param(
    [int]$Index,
    [string]$ImageUrl
  )
  $ext = Get-ExtensionFromUrl -ImageUrl $ImageUrl
  return ("building-{0:D3}{1}" -f $Index, $ext)
}

function Invoke-JsonApi {
  param([string]$Url)
  return Invoke-RestMethod -Uri $Url -Headers $headers -TimeoutSec 45
}

function Search-CommonsImage {
  param([string]$Keyword)

  if (!$Keyword) { return $null }
  $q = [uri]::EscapeDataString($Keyword)
  $url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=$q&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1600&format=json"

  $res = Invoke-JsonApi -Url $url
  if (-not $res.query.pages) { return $null }

  $pages = $res.query.pages.PSObject.Properties.Value
  foreach ($page in $pages) {
    if (-not $page.imageinfo) { continue }
    $ii = $page.imageinfo[0]
    $imgUrl = if ($ii.thumburl) { $ii.thumburl } else { $ii.url }
    if (-not $imgUrl) { continue }
    if ($imgUrl -match '\.svg($|\?)') { continue }

    $license = $ii.extmetadata.LicenseShortName.value
    if (-not $license) { $license = "Unknown" }

    return [pscustomobject]@{
      source = "Wikimedia Commons"
      url = $imgUrl
      license = $license
      pageTitle = $page.title
      query = $Keyword
    }
  }

  return $null
}

function Search-OpenverseImage {
  param([string]$Keyword)

  if (!$Keyword) { return $null }
  $q = [uri]::EscapeDataString($Keyword)
  $url = "https://api.openverse.org/v1/images/?q=$q&license_type=commercial&page_size=8"

  $res = Invoke-JsonApi -Url $url
  if (-not $res.results) { return $null }

  foreach ($item in $res.results) {
    $imgUrl = $item.url
    if (-not $imgUrl) { continue }
    if ($imgUrl -match '\.svg($|\?)') { continue }

    $license = $item.license
    if ($item.license_version) {
      $license = "$license $($item.license_version)"
    }
    if (-not $license) { $license = "Unknown" }

    return [pscustomobject]@{
      source = "Openverse"
      url = $imgUrl
      license = $license
      pageTitle = $item.title
      query = $Keyword
    }
  }

  return $null
}

function Resolve-ImageCandidate {
  param([string[]]$Keywords)

  foreach ($k in $Keywords) {
    try {
      $commons = Search-CommonsImage -Keyword $k
      if ($commons) { return $commons }
    } catch {
      Start-Sleep -Milliseconds 1200
    }
    Start-Sleep -Milliseconds 700
  }

  foreach ($k in $Keywords) {
    try {
      $openverse = Search-OpenverseImage -Keyword $k
      if ($openverse) { return $openverse }
    } catch {
      Start-Sleep -Milliseconds 1200
    }
    Start-Sleep -Milliseconds 700
  }

  return $null
}

function Write-MapFile {
  param(
    [hashtable]$Map,
    [string]$TargetPath
  )

  $lines = @()
  $lines += "export const buildingImageMap: Record<string, string> = {"
  foreach ($key in ($Map.Keys | Sort-Object)) {
    $value = $Map[$key]
    $lines += "  `"$key`": `"$value`","
  }
  $lines += "};"
  Set-Content -Path $TargetPath -Value ($lines -join "`r`n") -Encoding UTF8
}

function Escape-TS {
  param([string]$Value)
  if ($null -eq $Value) { return "" }
  return $Value.Replace("\", "\\").Replace('"', '\"')
}

function Write-CreditFile {
  param(
    [System.Collections.ArrayList]$Credits,
    [string]$TargetPath
  )

  $lines = @()
  $lines += "export type BuildingImageCredit = {"
  $lines += "  name: string;"
  $lines += "  source: string;"
  $lines += "  license: string;"
  $lines += "  url: string;"
  $lines += "};"
  $lines += ""
  $lines += "export const buildingImageCredits: BuildingImageCredit[] = ["
  foreach ($c in ($Credits | Sort-Object name)) {
    $name = Escape-TS $c.name
    $source = Escape-TS $c.source
    $license = Escape-TS $c.license
    $url = Escape-TS $c.url
    $lines += "  { name: `"$name`", source: `"$source`", license: `"$license`", url: `"$url`" },"
  }
  $lines += "];"

  Set-Content -Path $TargetPath -Value ($lines -join "`r`n") -Encoding UTF8
}

$rawData = Get-Content -Path $DataFile -Raw -Encoding UTF8
$entries = Parse-BuildingEntries -RawText $rawData
if ($entries.Count -eq 0) {
  throw "No building image entries found in $DataFile"
}

$existingMap = Read-ExistingMap -MapPath $MapFile -ImageRootDir $OutputDir
$existingCredits = Read-ExistingCredits -CreditPath $CreditFile

$finalMap = @{}
$finalCredits = New-Object System.Collections.ArrayList
$downloadedCount = 0
$keptCount = 0
$missed = New-Object System.Collections.Generic.List[string]

$existingFiles = Get-ChildItem -Path $OutputDir -File -ErrorAction SilentlyContinue
$maxIndex = 0
foreach ($f in $existingFiles) {
  if ($f.BaseName -match '^building-(\d+)$') {
    $v = [int]$Matches[1]
    if ($v -gt $maxIndex) { $maxIndex = $v }
  }
}
$nextIndex = $maxIndex + 1

foreach ($entry in $entries) {
  $name = $entry.name
  $query = $entry.query

  if (!$ForceRefresh -and $existingMap.ContainsKey($name)) {
    $finalMap[$name] = $existingMap[$name]
    if ($existingCredits.ContainsKey($name)) {
      [void]$finalCredits.Add($existingCredits[$name])
    } else {
      [void]$finalCredits.Add([pscustomobject]@{
        name = $name
        source = "Unknown"
        license = "Unknown"
        url = ""
      })
    }
    $keptCount++
    continue
  }

  $keywords = New-Object System.Collections.Generic.List[string]
  $keywords.Add($name)
  if ($query -and $query -ne $name) { $keywords.Add($query) }
  if ($query) {
    $compact = ($query -replace '\s+', '')
    if ($compact -and $compact -ne $query -and $compact -ne $name) { $keywords.Add($compact) }
  }
  # Add an English query variant to improve hit rate on international datasets.
  if ($query) {
    $englishHint = $query -replace '[^\u0000-\u007F]', ' '
    $englishHint = ($englishHint -replace '\s+', ' ').Trim()
    if ($englishHint -and $englishHint -notin $keywords) { $keywords.Add($englishHint) }
  }

  $candidate = $null
  try {
    $candidate = Resolve-ImageCandidate -Keywords $keywords
  } catch {
    $candidate = $null
  }

  if (!$candidate) {
    if ($existingMap.ContainsKey($name)) {
      $finalMap[$name] = $existingMap[$name]
      if ($existingCredits.ContainsKey($name)) {
        [void]$finalCredits.Add($existingCredits[$name])
      } else {
        [void]$finalCredits.Add([pscustomobject]@{
          name = $name
          source = "Unknown"
          license = "Unknown"
          url = ""
        })
      }
      $keptCount++
      Write-Host "KEEP OLD: $name"
    } else {
      $missed.Add($name) | Out-Null
      Write-Host "MISS: $name"
    }
    continue
  }

  $fileName = New-AsciiImageName -Index $nextIndex -ImageUrl $candidate.url
  $targetPath = Join-Path $OutputDir $fileName

  try {
    Invoke-WebRequest -Uri $candidate.url -Headers $headers -OutFile $targetPath -TimeoutSec 90
    $finalMap[$name] = "/buildings-web/$fileName"
    [void]$finalCredits.Add([pscustomobject]@{
      name = $name
      source = $candidate.source
      license = $candidate.license
      url = $candidate.url
    })
    $downloadedCount++
    $nextIndex++
    Write-Host "OK: $name -> $fileName [$($candidate.source)]"
  } catch {
    # Commons may reject frequent requests; fallback to Openverse on download failure.
    $openverseCandidate = $null
    foreach ($k in $keywords) {
      try {
        $openverseCandidate = Search-OpenverseImage -Keyword $k
        if ($openverseCandidate) { break }
      } catch {
        Start-Sleep -Milliseconds 900
      }
      Start-Sleep -Milliseconds 600
    }

    if ($openverseCandidate) {
      $ovrFileName = New-AsciiImageName -Index $nextIndex -ImageUrl $openverseCandidate.url
      $ovrTargetPath = Join-Path $OutputDir $ovrFileName
      try {
        Invoke-WebRequest -Uri $openverseCandidate.url -Headers $headers -OutFile $ovrTargetPath -TimeoutSec 90
        $finalMap[$name] = "/buildings-web/$ovrFileName"
        [void]$finalCredits.Add([pscustomobject]@{
          name = $name
          source = $openverseCandidate.source
          license = $openverseCandidate.license
          url = $openverseCandidate.url
        })
        $downloadedCount++
        $nextIndex++
        Write-Host "OK: $name -> $ovrFileName [$($openverseCandidate.source)]"
        Start-Sleep -Milliseconds 900
        continue
      } catch {
        # fall through to old/miss handling
      }
    }

    if ($existingMap.ContainsKey($name)) {
      $finalMap[$name] = $existingMap[$name]
      if ($existingCredits.ContainsKey($name)) {
        [void]$finalCredits.Add($existingCredits[$name])
      } else {
        [void]$finalCredits.Add([pscustomobject]@{
          name = $name
          source = "Unknown"
          license = "Unknown"
          url = ""
        })
      }
      $keptCount++
      Write-Host "KEEP OLD: $name"
    } else {
      $missed.Add($name) | Out-Null
      Write-Host "FAIL: $name :: $($_.Exception.Message)"
    }
  }

  Start-Sleep -Milliseconds 900
}

Write-MapFile -Map $finalMap -TargetPath $MapFile
Write-CreditFile -Credits $finalCredits -TargetPath $CreditFile

Write-Host "Entries:    $($entries.Count)"
Write-Host "Downloaded: $downloadedCount"
Write-Host "Kept old:   $keptCount"
Write-Host "Missed:     $($missed.Count)"
Write-Host "Map file:   $MapFile"
Write-Host "Credit file:$CreditFile"

if ($missed.Count -gt 0) {
  Write-Host "Missed names:"
  foreach ($name in $missed) {
    Write-Host " - $name"
  }
}



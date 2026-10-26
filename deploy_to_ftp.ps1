$ftpServer = "ftp://ftpupload.net/htdocs"
$ftpUser = "icei_43258042"
$ftpPass = "nPToq8DBLps7"
$localDir = "e:\sample women cloth store\deploy_aeonfree"

function Ensure-FtpDirectory {
    param([string]$targetUri)
    try {
        $req = [System.Net.FtpWebRequest]::Create($targetUri)
        $req.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
        $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $req.UseBinary = $true
        $req.KeepAlive = $false
        $resp = $req.GetResponse()
        $resp.Close()
        Write-Host "Created remote dir: $targetUri"
    } catch {
        # Directory might already exist, ignore error
    }
}

function Upload-File {
    param([string]$localFile, [string]$remoteUri)
    Write-Host "Uploading $localFile -> $remoteUri"
    try {
        $req = [System.Net.FtpWebRequest]::Create($remoteUri)
        $req.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
        $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $req.UseBinary = $true
        $req.KeepAlive = $false
        
        $fileBytes = [System.IO.File]::ReadAllBytes($localFile)
        $req.ContentLength = $fileBytes.Length
        
        $stream = $req.GetRequestStream()
        $stream.Write($fileBytes, 0, $fileBytes.Length)
        $stream.Close()
        
        $resp = $req.GetResponse()
        $resp.Close()
        Write-Host "SUCCESS: $localFile" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: $_" -ForegroundColor Red
    }
}

# 1. Ensure remote directories exist
Ensure-FtpDirectory "$ftpServer/api"
Ensure-FtpDirectory "$ftpServer/data"

# 2. Upload all files recursively
$files = Get-ChildItem -Path $localDir -Recurse -File
foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($localDir.Length + 1).Replace("\", "/")
    $targetRemoteUri = "$ftpServer/$relativePath"
    Upload-File -localFile $file.FullName -remoteUri $targetRemoteUri
}

Write-Host "ALL DEPLOYMENTS FINISHED!" -ForegroundColor Cyan

# Servidor local para probar Comparandia (Windows, sin instalar nada).
#   powershell -ExecutionPolicy Bypass -File tools\serve.ps1
# Con -Dev, además permite compilar desde http://localhost:8770/__src/tools/build.html
param(
  [string]$Root = (Join-Path $PSScriptRoot '..\dist'),
  [string]$Src = (Join-Path $PSScriptRoot '..'),
  [int]$Port = 8770,
  [switch]$Dev
)
$Root = [IO.Path]::GetFullPath($Root)
$Src = [IO.Path]::GetFullPath($Src)
if (-not (Test-Path $Root)) { New-Item -ItemType Directory -Path $Root | Out-Null }
$mime = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.mjs'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.svg'='image/svg+xml'; '.json'='application/json'; '.webmanifest'='application/manifest+json'; '.xml'='application/xml; charset=utf-8'; '.txt'='text/plain; charset=utf-8'; '.png'='image/png'; '.webp'='image/webp'; '.jpg'='image/jpeg' }
$utf8 = New-Object Text.UTF8Encoding $false

function Resolve-Inside([string]$base, [string]$rel) {
  $full = [IO.Path]::GetFullPath((Join-Path $base $rel))
  if ($full.StartsWith($base, [StringComparison]::OrdinalIgnoreCase)) { return $full } else { return $null }
}

$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "Comparandia en http://localhost:$Port/  (raíz: $Root)"
if ($Dev) { Write-Host "Compilar: http://localhost:$Port/__src/tools/build.html" }

while ($l.IsListening) {
  $c = $l.GetContext()
  $req = $c.Request; $res = $c.Response
  try {
    $p = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
    if ($Dev -and $req.HttpMethod -eq 'POST' -and $p -eq '__clean') {
      if ((Split-Path $Root -Leaf) -eq 'dist') { Get-ChildItem $Root -Force | Remove-Item -Recurse -Force }
      $res.StatusCode = 204
    }
    elseif ($Dev -and $req.HttpMethod -eq 'POST' -and $p -eq '__build') {
      $target = [Uri]::UnescapeDataString($req.Headers['X-Path'])
      $out = Resolve-Inside $Root $target
      if (-not $out -or $target -match '\.\.') { $res.StatusCode = 400 }
      else {
        $reader = New-Object IO.StreamReader($req.InputStream, [Text.Encoding]::UTF8)
        $body = $reader.ReadToEnd(); $reader.Close()
        $dir = Split-Path $out -Parent
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        [IO.File]::WriteAllText($out, $body, $utf8)
        $res.StatusCode = 204
      }
    }
    else {
      $base = $Root
      if ($p.StartsWith('__src/')) { $base = $Src; $p = $p.Substring(6) }
      $f = Resolve-Inside $base $p
      if ($f -and (Test-Path $f -PathType Container)) { $f = Join-Path $f 'index.html' }
      if ($f -and -not (Test-Path $f -PathType Leaf) -and -not [IO.Path]::GetExtension($f)) {
        $alt = Join-Path $f 'index.html'
        if (Test-Path $alt -PathType Leaf) { $res.StatusCode = 301; $res.RedirectLocation = '/' + $p.TrimEnd('/') + '/'; $res.Close(); continue }
      }
      if ($f -and (Test-Path $f -PathType Leaf)) {
        $b = [IO.File]::ReadAllBytes($f)
        $e = [IO.Path]::GetExtension($f).ToLower()
        $res.ContentType = $(if ($mime[$e]) { $mime[$e] } else { 'application/octet-stream' })
        $res.Headers.Add('Cache-Control', 'no-store')
        if ($req.HttpMethod -ne 'HEAD') { $res.OutputStream.Write($b, 0, $b.Length) }
      } else {
        $res.StatusCode = 404
        $nf = Join-Path $Root '404.html'
        if (Test-Path $nf) { $b = [IO.File]::ReadAllBytes($nf); $res.ContentType = 'text/html; charset=utf-8'; $res.OutputStream.Write($b, 0, $b.Length) }
      }
    }
  } catch { $res.StatusCode = 500 }
  $res.Close()
}

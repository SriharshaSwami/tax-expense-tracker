Add-Type -AssemblyName System.Drawing

$imagePath = "c:\Users\sriha\OneDrive\Desktop\tax-expense-planner\frontend\public\favicon.png"
$outputPath = "c:\Users\sriha\OneDrive\Desktop\tax-expense-planner\frontend\public\favicon-rounded.png"

$img = [System.Drawing.Image]::FromFile($imagePath)
$bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)

$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)

$radius = $img.Width / 4
if ($radius -gt 100) { $radius = 100 }

$rect = New-Object System.Drawing.Rectangle(0, 0, $img.Width, $img.Height)
$path = New-Object System.Drawing.Drawing2D.GraphicsPath

$path.AddArc($rect.X, $rect.Y, $radius, $radius, 180, 90)
$path.AddArc($rect.Width - $radius, $rect.Y, $radius, $radius, 270, 90)
$path.AddArc($rect.Width - $radius, $rect.Height - $radius, $radius, $radius, 0, 90)
$path.AddArc($rect.X, $rect.Height - $radius, $radius, $radius, 90, 90)
$path.CloseFigure()

$brush = New-Object System.Drawing.TextureBrush($img)
$g.FillPath($brush, $path)

$img.Dispose()
$g.Dispose()

$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Add-Type -AssemblyName System.Drawing

$imagePath = "c:\Users\sriha\OneDrive\Desktop\tax-expense-planner\frontend\src\assets\finpulse-logo.png"

$img = [System.Drawing.Image]::FromFile($imagePath)
$bmp = New-Object System.Drawing.Bitmap($img)

$bgColor = $bmp.GetPixel(0, 0)
$bmp.MakeTransparent($bgColor)

$img.Dispose()
$bmp.Save($imagePath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

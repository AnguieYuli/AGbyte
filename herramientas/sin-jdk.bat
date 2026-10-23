@echo off
rem Explica como instalar el JDK y, si se puede, lo instala con winget.
echo.
echo  No encontre el JDK de Java 17 o mas nuevo en este PC.
echo  AGbyte en Java necesita el JDK (el kit para programar en Java, gratis).
echo.
where winget >nul 2>nul
if errorlevel 1 goto :manual
choice /c SN /m " Quieres que lo instale ahora (Eclipse Temurin JDK 21)"
if errorlevel 2 goto :manual
winget install --id EclipseAdoptium.Temurin.21.JDK -e --accept-package-agreements --accept-source-agreements
call "%~dp0buscar-jdk.bat"
if defined JDK exit /b 0
echo.
echo  Si la instalacion termino bien, cierra esta ventana y vuelve a abrir el archivo .bat.
exit /b 1

:manual
echo.
echo  Descargalo de https://adoptium.net/es/temurin/releases/?version=21
echo  (Windows x64, archivo .msi). Al instalar, activa "Set JAVA_HOME variable".
echo  Luego vuelve a abrir este archivo.
start "" "https://adoptium.net/es/temurin/releases/?version=21"
exit /b 1

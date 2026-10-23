@echo off
setlocal
title AGbyte (Java)
cd /d "%~dp0"
call "herramientas\buscar-jdk.bat"
if not defined JDK call "herramientas\sin-jdk.bat"
if not defined JDK (
  pause
  exit /b 1
)
echo Usando Java %JDKMAJ%: %JDK%
echo Compilando AGbyte...
call "herramientas\compilar.bat"
if errorlevel 1 goto :error
echo Abriendo AGbyte...
start "" "%JDK%\bin\javaw.exe" -jar "build\jar\AGbyte.jar" %*
exit /b 0

:error
echo.
echo Algo fallo al compilar. Toma una captura de esta ventana y enviasela a Claude.
pause
exit /b 1

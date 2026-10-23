@echo off
setlocal
title Crear AGbyte (Java)
cd /d "%~dp0"
echo.
echo  ==== Crear AGbyte.exe (version Java) ====
echo.
call "herramientas\buscar-jdk.bat"
if not defined JDK call "herramientas\sin-jdk.bat"
if not defined JDK (
  pause
  exit /b 1
)
echo Usando Java %JDKMAJ%: %JDK%
if not exist "%JDK%\bin\jpackage.exe" (
  echo Este JDK no trae jpackage. Instala el JDK 21 de https://adoptium.net/es/temurin/releases/?version=21
  pause
  exit /b 1
)
echo.
echo Cerrando AGbyte (Java) si estaba abierto...
if exist "dist\AGbyte\AGbyte.exe" taskkill /im AGbyte.exe /f >nul 2>nul
echo.
echo [1/3] Compilando...
call "herramientas\compilar.bat"
if errorlevel 1 goto :error
echo.
echo [2/3] Creando AGbyte.exe con su propio Java ^(1-2 minutos^)...
set "MODS=java.se,jdk.httpserver,jdk.compiler,jdk.zipfs,jdk.charsets"
"%JDK%\bin\java.exe" --list-modules 2>nul | findstr /b /c:"jdk.crypto.ec@" >nul && set "MODS=%MODS%,jdk.crypto.ec"
if exist "dist\AGbyte" rmdir /s /q "dist\AGbyte"
"%JDK%\bin\jpackage.exe" --type app-image --name AGbyte --input "build\jar" --main-jar AGbyte.jar --main-class pe.agbyte.AGbyteANYU --icon agbyte.ico --dest dist --app-version 1.0.0 --vendor AGbyte --description "AGbyte - aprende a programar" --add-modules %MODS% --jlink-options "--strip-debug --no-man-pages --no-header-files" --java-options "-Dfile.encoding=UTF-8"
if errorlevel 1 goto :error
if not exist "dist\AGbyte\AGbyte.exe" goto :error
echo.
echo [3/3] Creando el acceso directo "AGbyte (Java)" en tu Escritorio...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$d=[Environment]::GetFolderPath('Desktop'); $s=(New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path $d 'AGbyte (Java).lnk')); $s.TargetPath=(Resolve-Path 'dist\AGbyte\AGbyte.exe').Path; $s.WorkingDirectory=(Resolve-Path 'dist\AGbyte').Path; $s.IconLocation=(Resolve-Path 'dist\AGbyte\AGbyte.exe').Path + ',0'; $s.Save()"
echo.
echo Listo. AGbyte.exe esta en la carpeta dist\AGbyte (no lo saques de esa carpeta:
echo junto a el estan las pantallas y su propio Java). En tu Escritorio tienes el acceso "AGbyte (Java)".
start "" "dist\AGbyte\AGbyte.exe"
pause
exit /b 0

:error
echo.
echo Algo fallo. Toma una captura de esta ventana y enviasela a Claude.
pause
exit /b 1

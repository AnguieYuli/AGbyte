@echo off
rem Compila AGbyte con el JDK de la variable JDK y crea build\jar\AGbyte.jar
set "SRC=src\main\java\pe\agbyte"
if exist "build" rmdir /s /q "build"
mkdir "build\classes" "build\jar"
"%JDK%\bin\javac.exe" --release 17 -encoding UTF-8 -d "build\classes" "%SRC%\AGbyteANYU.java" "%SRC%\EjecutorANYU.java" "%SRC%\GoogleLoginANYU.java" "%SRC%\JsonANYU.java" "%SRC%\ServidorANYU.java" "%SRC%\SistemaANYU.java" "%SRC%\VentanaANYU.java"
if errorlevel 1 exit /b 1
xcopy /e /i /q /y "src\main\resources" "build\classes" >nul
if errorlevel 1 exit /b 1
"%JDK%\bin\jar.exe" --create --file "build\jar\AGbyte.jar" --main-class pe.agbyte.AGbyteANYU -C "build\classes" .
if errorlevel 1 exit /b 1
if not exist "build\jar\AGbyte.jar" exit /b 1
exit /b 0

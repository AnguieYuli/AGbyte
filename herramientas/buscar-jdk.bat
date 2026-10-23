@echo off
rem Busca el JDK (Java 17 o mas nuevo, con javac) mas reciente de este PC.
rem Deja su carpeta en JDK y su version en JDKMAJ. Si no hay ninguno, JDK queda vacio.
set "JDK="
set "JDKMAJ=0"
if defined JAVA_HOME call :probar "%JAVA_HOME%"
for %%R in ("%ProgramFiles%\Eclipse Adoptium" "%ProgramFiles%\Java" "%ProgramFiles%\Microsoft" "%ProgramFiles%\Zulu" "%ProgramFiles%\Amazon Corretto" "%ProgramFiles%\BellSoft" "%ProgramFiles%\Semeru" "%USERPROFILE%\.jdks") do (
  if exist "%%~R\" for /d %%D in ("%%~R\*") do call :probar "%%~D"
)
for /f "delims=" %%J in ('where javac 2^>nul') do call :probar "%%~dpJ.."
if %JDKMAJ% LSS 17 set "JDK="
exit /b 0

:probar
if not exist "%~1\bin\javac.exe" exit /b 0
set "V="
"%~1\bin\javac.exe" -version > "%TEMP%\agbyte-javac.txt" 2>&1
for /f "usebackq tokens=1,2" %%A in ("%TEMP%\agbyte-javac.txt") do if "%%A"=="javac" set "V=%%B"
del "%TEMP%\agbyte-javac.txt" >nul 2>nul
if not defined V exit /b 0
set "M="
for /f "delims=." %%M in ("%V%") do set "M=%%M"
if not defined M exit /b 0
if "%M%"=="1" exit /b 0
if %M% GTR %JDKMAJ% (
  set "JDK=%~f1"
  set "JDKMAJ=%M%"
)
exit /b 0

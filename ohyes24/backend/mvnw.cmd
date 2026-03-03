@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
pushd "%SCRIPT_DIR%"

if not exist ".mvn\wrapper\maven-wrapper.jar" (
  echo maven-wrapper.jar not found. Please restore backend/.mvn/wrapper/maven-wrapper.jar
  popd
  exit /b 1
)

set "JAVACMD=java"
if defined JAVA_HOME set "JAVACMD=%JAVA_HOME%\bin\java"

"%JAVACMD%" "-Dmaven.multiModuleProjectDirectory=." -classpath ".mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
set "EXITCODE=%ERRORLEVEL%"

popd
endlocal & exit /b %EXITCODE%

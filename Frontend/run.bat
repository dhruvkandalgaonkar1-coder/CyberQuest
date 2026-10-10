@echo off
cd /d "%~dp0"
py -3 server.py
if errorlevel 1 (
    echo.
    echo Could not start CyberQuest. Make sure Python 3 is installed and port 8000 is available.
    pause
)

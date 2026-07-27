@echo off
echo ========================================
echo   Campus Companion Setup Script
echo ========================================

echo.
echo Installing client dependencies...
cd client
if exist package.json (
    npm install
    if %errorlevel% neq 0 (
        echo Failed to install client dependencies
        pause
        exit /b 1
    )
    echo Client dependencies installed successfully!
) else (
    echo package.json not found in client directory
)

echo.
echo Installing server dependencies...
cd ..\server
if exist package.json (
    npm install
    if %errorlevel% neq 0 (
        echo Failed to install server dependencies
        pause
        exit /b 1
    )
    echo Server dependencies installed successfully!
) else (
    echo package.json not found in server directory
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the development servers:
echo.
echo 1. Server (in terminal 1):
echo    cd server
echo    npm run dev
echo.
echo 2. Client (in terminal 2):
echo    cd client
echo    npm run dev
echo.
echo Don't forget to:
echo - Set up your .env file in the server directory
echo - Install and start MongoDB
echo - Configure Cloudinary for file uploads
echo.
echo Check README.md for detailed setup instructions.
echo.
pause
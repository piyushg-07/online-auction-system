@echo off
REM =====================================
REM Configuration - change these paths to match your project structure.
set VENV_PATH=C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\QuotationAnalysis\venv
set FLASK_APP_DIR=C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\QuotationAnalysis
set REACT_APP_DIR=C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\client
set NODE_APP_DIR=C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\server
set max_retry=3
REM =====================================

REM ---------- Check if winget is installed ----------
where winget >nul 2>&1
if errorlevel 1 (
    echo winget is not available on this system.
    echo Please install the Windows Package Manager (winget) from the Microsoft Store or update Windows.
    pause
    exit /b
) else (
    echo winget is installed.
)

REM ---------- Check if Python is installed ----------
set retry=0
:check_python_winget
where python >nul 2>&1
if errorlevel 1 (
    if %retry% GEQ %max_retry% (
        echo Failed to install Python after %max_retry% attempts. Please install Python manually.
        pause
        exit /b
    )
    echo Python is not installed. Installing Python via winget... (Attempt %retry% of %max_retry%)
    winget install --id=Python.Python.3 -e --silent
    set /a retry+=1
    timeout /t 5 /nobreak >nul
    goto check_python_winget
) else (
    echo Python is installed.
)

REM ---------- Check if Node.js is installed ----------
set retry=0
:check_node_winget
where node >nul 2>&1
if errorlevel 1 (
    if %retry% GEQ %max_retry% (
        echo Failed to install Node.js after %max_retry% attempts. Please install Node.js manually.
        pause
        exit /b
    )
    echo Node.js is not installed. Installing Node.js via winget... (Attempt %retry% of %max_retry%)
    winget install --id=OpenJS.Nodejs -e --silent
    set /a retry+=1
    timeout /t 5 /nobreak >nul
    goto check_node_winget
) else (
    echo Node.js is installed.
)

REM ---------- Create and Setup Python Virtual Environment if needed ----------
IF NOT EXIST "%VENV_PATH%\Scripts\activate.bat" (
    echo Virtual environment not found. Creating venv...
    cd /d %FLASK_APP_DIR%
    python -m venv venv
    echo Installing Flask requirements...
    call "%VENV_PATH%\Scripts\activate" && pip install -r requirements.txt
)

REM ---------- Flask App ----------
echo.
echo Do you want to run the Flask App? (Y/N)
set /p flaskChoice="Enter Y for Yes or N for No: [Y,N]? "
if /I "%flaskChoice%"=="Y" (
    echo Starting Flask app...
    start "Flask App" cmd /k "cd /d %FLASK_APP_DIR% && call \"%VENV_PATH%\Scripts\activate\" && python app.py"
) else (
    echo Skipping Flask App.
)

REM ---------- React App ----------
echo.
echo Do you want to run the React App? (Y/N)
set /p reactChoice="Enter Y for Yes or N for No: [Y,N]? "
if /I "%reactChoice%"=="Y" (
    IF NOT EXIST "%REACT_APP_DIR%\node_modules" (
        echo node_modules not found in React app. Installing...
        cd /d %REACT_APP_DIR%
        npm install
    )
    echo Starting React app...
    start "React App" cmd /k "cd /d %REACT_APP_DIR% && npm run dev"
) else (
    echo Skipping React App.
)

REM ---------- Node.js Server ----------
echo.
echo Do you want to run the Node.js Server? (Y/N)
set /p nodeChoice="Enter Y for Yes or N for No: [Y,N]? "
if /I "%nodeChoice%"=="Y" (
    IF NOT EXIST "%NODE_APP_DIR%\node_modules" (
        echo node_modules not found in Node.js server. Installing...
        cd /d %NODE_APP_DIR%
        npm install
    )
    echo Starting Node.js server...
    start "Node App" cmd /k "cd /d %NODE_APP_DIR% && npm start"
) else (
    echo Skipping Node.js Server.
)

echo.
echo All selections completed.
pause

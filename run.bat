@echo off
REM =====================================
REM Change these paths to match your project structure.
set VENV_PATH=C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\QuotationAnalysis\venv
set FLASK_APP_DIR=C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\QuotationAnalysis
set REACT_APP_DIR=C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\client
set NODE_APP_DIR=C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\server
REM =====================================
C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\client
REM ---------- Function to check and create venv ----------
IF NOT EXIST "%VENV_PATH%\Scripts\activate.bat" (
    echo Virtual environment not found. Creating venv...
    cd /d %FLASK_APP_DIR%
    python -m venv venv
    echo Installing Flask requirements...
    call %VENV_PATH%\Scripts\activate && pip install -r requirements.txt
)

REM ---------- Flask App ----------
echo Do you want to run the Flask App? (Y/N)
set /p flaskChoice="Enter Y for Yes or N for No: [Y,N]? "
if /I "%flaskChoice%"=="Y" (
    echo Starting Flask app...
    start "Flask App" cmd /k "cd /d %FLASK_APP_DIR% && call %VENV_PATH%\Scripts\activate && python app.py"
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

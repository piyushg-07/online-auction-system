@echo off
REM =====================================
REM Change these paths to match your project structure.
REM Path to the virtual environment (venv) for your Flask app.
set VENV_PATH=C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\QuotationAnalysis\venv
REM Path to the Flask app folder (where app.py is located)
set FLASK_APP_DIR=C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\QuotationAnalysis
REM Path to the React app folder (where package.json is located)
set REACT_APP_DIR=C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\client
REM Path to the Node.js server folder (where server.js or app.js is located)
set NODE_APP_DIR=C:\Users\user\OneDrive\Desktop\test\working\online-auction-system\server
REM =====================================

REM ----- Flask App Prompt -----
echo Do you want to run the Flask App? (Y/N)
set /p flaskChoice="Enter Y for Yes or N for No: [Y,N]? "
if /I "%flaskChoice%"=="Y" (
    echo Starting Flask app...
    start "Flask App" cmd /k "cd /d %FLASK_APP_DIR% && call %VENV_PATH%\Scripts\activate && python app.py"
) else (
    echo Skipping Flask App.
)

REM ----- React App Prompt -----
echo.
echo Do you want to run the React App? (Y/N)
set /p reactChoice="Enter Y for Yes or N for No: [Y,N]? "
if /I "%reactChoice%"=="Y" (
    echo Starting React app...
    start "React App" cmd /k "cd /d %REACT_APP_DIR% && npm run dev"
) else (
    echo Skipping React App.
)

REM ----- Node.js Server Prompt -----
echo.
echo Do you want to run the Node.js Server? (Y/N)
set /p nodeChoice="Enter Y for Yes or N for No: [Y,N]? "
if /I "%nodeChoice%"=="Y" (
    echo Starting Node.js server...
    start "Node App" cmd /k "cd /d %NODE_APP_DIR% && npm start"
) else (
    echo Skipping Node.js Server.
)

echo.
echo All selections completed.
pause

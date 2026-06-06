@echo off
set PROJECT_DIR=%USERPROFILE%\Desktop\security-ai-platform

echo Starting Security AI Platform...

start "Security AI - Python Service" cmd /k "cd /d ""%PROJECT_DIR%\ai-service-python"" && .venv\Scripts\activate && python -m uvicorn app.main:app --reload --port 8000"

start "Security AI - Backend Node" cmd /k "cd /d ""%PROJECT_DIR%\backend-node"" && npm run dev"

start "Security AI - Frontend React" cmd /k "cd /d ""%PROJECT_DIR%\frontend"" && npm run dev"

echo.
echo Services are starting in separate windows.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000
echo Python:   http://localhost:8000
echo.
pause

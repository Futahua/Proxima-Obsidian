@echo off
taskkill /IM Obsidian.exe /F >nul 2>&1
timeout /t 2 /nobreak >nul
start "" "C:\Users\admin\AppData\Local\Programs\Obsidian\Obsidian.exe"

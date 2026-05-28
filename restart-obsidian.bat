@echo off
taskkill /IM Obsidian.exe /F >nul 2>&1
timeout /t 2 /nobreak >nul
start "" "D:\Programs\Obsidian\Obsidian.exe"

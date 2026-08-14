@echo off
title SQL Bee
start "" http://localhost:5600/
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0serve.ps1"

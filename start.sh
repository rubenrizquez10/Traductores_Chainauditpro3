#!/bin/bash

# Script de inicio para Render
cd backend
gunicorn app:app -c gunicorn_config.py

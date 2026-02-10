"""
WSGI entry point para Render
"""
import sys
import os

# Agregar el directorio backend al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import app

if __name__ == "__main__":
    app.run()

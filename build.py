#!/usr/bin/env python3
"""
Script de build para Render
"""
import subprocess
import sys
import os

def run_command(cmd, description):
    """Ejecuta un comando y maneja errores"""
    print(f"\n{'='*60}")
    print(f"🔨 {description}")
    print(f"{'='*60}")
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"❌ Error en: {description}")
        sys.exit(1)
    print(f"✅ {description} completado")

def main():
    print("\n🚀 Iniciando build del proyecto...")
    
    # Build del frontend
    run_command("npm ci", "Instalando dependencias de Node.js")
    run_command("npx vite build", "Construyendo frontend con Vite")
    
    # Instalar dependencias de Python
    run_command("pip install -r requirements.txt", "Instalando dependencias de Python")
    
    print("\n" + "="*60)
    print("✨ Build completado exitosamente!")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()

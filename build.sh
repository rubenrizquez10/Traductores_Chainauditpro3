#!/bin/bash

# Script de build para Render
echo "🔨 Instalando dependencias del frontend..."
npm install

echo "🏗️ Construyendo el frontend..."
npm run build

echo "📦 Instalando dependencias del backend..."
cd backend
pip install -r requirements.txt

echo "✅ Build completado!"

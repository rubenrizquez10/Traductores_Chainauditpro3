# 🚀 Comandos para Desplegar en Render

## Opción Más Simple (Recomendada)

### 1. Subir código a GitHub
```bash
git add .
git commit -m "Listo para Render"
git push origin main
```

### 2. En Render Dashboard
1. Ir a https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Conectar tu repositorio
4. Configurar:

**Build Command:**
```bash
npm install && npm run build && cd backend && pip install -r requirements.txt
```

**Start Command:**
```bash
cd backend && gunicorn app:app -c gunicorn_config.py
```

**Environment Variables:**
- `PYTHON_VERSION` = `3.11.0`
- `NODE_VERSION` = `18`

5. Click "Create Web Service"

### 3. Esperar 5-10 minutos

Tu app estará en: `https://TU-NOMBRE.onrender.com`

---

## Probar Localmente Antes

```bash
# Build
npm install
npm run build

# Iniciar
cd backend
pip install -r requirements.txt
python app.py
```

Abrir: http://localhost:5000

---

## ¿Problemas?

Ver logs en Render Dashboard → Tu servicio → "Logs"

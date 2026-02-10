# Guía de Despliegue en Render (Aplicación Completa)

Este proyecto está configurado para desplegar el frontend (React) y backend (Flask) juntos en un solo servicio de Render.

## 🚀 Opción 1: Despliegue Automático con Blueprint (Recomendado)

### Paso 1: Preparar el repositorio
```bash
git add .
git commit -m "Preparar para despliegue en Render"
git push origin main
```

### Paso 2: Crear servicio en Render
1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en "New +" → "Blueprint"
3. Conecta tu repositorio de GitHub/GitLab
4. Render detectará automáticamente el archivo `render.yaml`
5. Click en "Apply" para crear el servicio

¡Listo! Tu aplicación estará disponible en: `https://blockchain-analyzer.onrender.com`

---

## 🔧 Opción 2: Despliegue Manual

### Paso 1: Crear Web Service
1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub/GitLab

### Paso 2: Configurar el servicio

**Configuración:**
- **Name**: `blockchain-analyzer`
- **Region**: `Oregon (US West)`
- **Branch**: `main`
- **Root Directory**: (dejar vacío)
- **Runtime**: `Python 3`
- **Build Command**: 
  ```bash
  npm install && npm run build && cd backend && pip install -r requirements.txt
  ```
- **Start Command**: 
  ```bash
  cd backend && gunicorn app:app -c gunicorn_config.py
  ```
- **Instance Type**: `Free`

**Variables de Entorno:**
- `PYTHON_VERSION` = `3.11.0`
- `NODE_VERSION` = `18`

### Paso 3: Desplegar
Click en "Create Web Service" y espera a que termine el despliegue (5-10 minutos).

---

## 🧪 Probar Localmente

### Desarrollo (Frontend y Backend separados)
```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
python app.py

# Terminal 2 - Frontend
npm install
npm run dev
```

### Producción (Simulando Render)
```bash
# Build del frontend
npm install
npm run build

# Iniciar servidor (sirve frontend + backend)
cd backend
pip install -r requirements.txt
gunicorn app:app -c gunicorn_config.py
```

Luego abre: `http://localhost:10000`

---

## 📝 Cómo Funciona

1. **Build**: 
   - Render instala las dependencias de Node.js
   - Ejecuta `npm run build` para crear el frontend en `/dist`
   - Instala las dependencias de Python

2. **Runtime**:
   - Flask sirve los archivos estáticos del frontend desde `/dist`
   - Las rutas `/api/*` son manejadas por el backend
   - Todas las demás rutas sirven el `index.html` (para React Router)

3. **Ventajas**:
   - Un solo servicio = más simple y económico
   - No hay problemas de CORS
   - URLs relativas funcionan automáticamente

---

## 🔍 Solución de Problemas

### Error: "No such file or directory: '../dist'"
El frontend no se construyó correctamente. Verifica:
```bash
npm run build
ls -la dist/  # Debe mostrar archivos
```

### Error: "Module not found: gunicorn"
Falta gunicorn en requirements.txt. Ya está incluido, pero verifica:
```bash
cd backend
cat requirements.txt | grep gunicorn
```

### La aplicación no carga
1. Revisa los logs en Render Dashboard
2. Verifica que el puerto sea `10000` (configurado en `gunicorn_config.py`)
3. Asegúrate de que el build completó exitosamente

### Cambios no se reflejan
1. Haz commit y push de tus cambios
2. Render desplegará automáticamente
3. O fuerza un redespliegue desde el dashboard

---

## 📊 Monitoreo

- **Logs**: Render Dashboard → Tu servicio → "Logs"
- **Métricas**: Render Dashboard → Tu servicio → "Metrics"
- **Estado**: Render Dashboard → Tu servicio → "Events"

---

## 🌐 URL Final

Después del despliegue, tu aplicación estará en:
```
https://blockchain-analyzer.onrender.com
```

O el nombre que hayas elegido:
```
https://TU-NOMBRE-DE-SERVICIO.onrender.com
```

---

## ⚡ Comandos Rápidos

```bash
# Verificar que todo funciona localmente
npm run build && cd backend && python app.py

# Ver estructura del proyecto
tree -L 2 -I 'node_modules|__pycache__|.git'

# Limpiar y reconstruir
rm -rf dist node_modules && npm install && npm run build
```

---

## 📌 Notas Importantes

1. **Plan Free**: Los servicios gratuitos se duermen después de 15 minutos de inactividad. La primera petición puede tardar 30-60 segundos.

2. **Auto-deploy**: Cada push a `main` despliega automáticamente.

3. **Variables de entorno**: No necesitas configurar `VITE_API_URL` porque usa rutas relativas.

4. **Dominio personalizado**: Puedes agregar tu propio dominio en Settings → Custom Domain.

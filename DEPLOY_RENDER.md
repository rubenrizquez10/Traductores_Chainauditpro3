# Guía de Despliegue en Render (Solo Frontend)

Este proyecto despliega solo el frontend de React como un sitio estático en Render.

## 🚀 Despliegue Rápido con Blueprint

### Paso 1: Preparar el repositorio
```bash
git add .
git commit -m "Deploy frontend to Render"
git push origin main
```

### Paso 2: Crear servicio en Render
1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en "New +" → "Blueprint"
3. Conecta tu repositorio de GitHub/GitLab
4. Render detectará automáticamente el archivo `render.yaml`
5. Click en "Apply"

¡Listo! Tu aplicación estará disponible en: `https://blockchain-analyzer.onrender.com`

---

## 🔧 Despliegue Manual (Alternativa)

### Paso 1: Crear Static Site
1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en "New +" → "Static Site"
3. Conecta tu repositorio

### Paso 2: Configurar
- **Name**: `blockchain-analyzer`
- **Branch**: `main`
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`

### Paso 3: Desplegar
Click en "Create Static Site"

---

## 🧪 Probar Localmente

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## 📝 Notas

- El frontend es completamente estático (sin backend)
- Los datos se generan en el navegador con datos de ejemplo
- Plan gratuito de Render incluye SSL automático
- Auto-deploy en cada push a `main`

---

## 🌐 URL Final

```
https://blockchain-analyzer.onrender.com
```

O el nombre que elijas:
```
https://TU-NOMBRE.onrender.com
```

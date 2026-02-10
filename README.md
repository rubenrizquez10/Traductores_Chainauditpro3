# 🔐 ChainAudit Pro - Analizador de Transacciones Blockchain

![ChainAudit Pro](https://img.shields.io/badge/ChainAudit-Pro-cyan?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Flask](https://img.shields.io/badge/Flask-2.3-green?style=for-the-badge&logo=flask)
![Python](https://img.shields.io/badge/Python-3.14-yellow?style=for-the-badge&logo=python)

## 📋 Descripción del Proyecto

**ChainAudit Pro** es una plataforma avanzada de análisis de seguridad blockchain que permite monitorear, analizar y detectar patrones sospechosos en transacciones de criptomonedas. El sistema utiliza algoritmos de inteligencia artificial para identificar actividades fraudulentas, lavado de dinero y otros riesgos de seguridad en tiempo real.

### 🎯 Objetivo Principal

Proporcionar una herramienta profesional para analistas de seguridad, investigadores forenses y profesionales de compliance que necesiten:
- Detectar transacciones sospechosas
- Rastrear el flujo de fondos
- Evaluar el riesgo de direcciones blockchain
- Monitorear la salud de la red
- Generar reportes de análisis

## 🏗️ Arquitectura del Sistema

### Frontend (React)
```
src/
├── components/           # Componentes React reutilizables
│   ├── AlertsPanel.jsx          # Sistema de alertas en tiempo real
│   ├── AnalyticsDashboard.jsx   # Dashboard principal de análisis
│   ├── AdvancedMetricsPanel.jsx # Métricas avanzadas y gráficos
│   ├── CryptoPriceWidget.jsx    # Widget de precios de criptomonedas
│   ├── FundTracingPanel.jsx     # Seguimiento forense de fondos
│   ├── HomePage.jsx             # Página de inicio
│   ├── NetworkGraph.jsx         # Visualización de red blockchain
│   ├── RiskAnalysisPanel.jsx    # Análisis de riesgo avanzado
│   └── TransactionTable.jsx     # Tabla de transacciones
├── utils/
│   └── blockchainDataGenerator.js # Generador de datos simulados
├── App.jsx              # Componente principal de la aplicación
├── main.jsx            # Punto de entrada de React
└── index.css           # Estilos globales con Tailwind CSS
```

### Backend (Flask/Python)
```
backend/
├── app.py              # Servidor Flask con todas las APIs
├── requirements.txt    # Dependencias de Python
└── README.md          # Documentación del backend
```

## 🚀 Funcionalidades Principales

### 1. 🚨 Sistema de Alertas en Tiempo Real
- **Archivo**: `src/components/AlertsPanel.jsx`
- **Descripción**: Panel flotante que muestra alertas de seguridad en tiempo real
- **Características**:
  - Clasificación por severidad (Alta, Media, Baja)
  - Filtros por tipo de alerta
  - Notificaciones visuales con animaciones
  - Sistema de dismissal de alertas
  - Indicador de alertas activas en la barra superior

**Código clave**:
```javascript
const AlertCard = ({ alert, onDismiss, index }) => {
  // Renderiza cada alerta con animaciones y colores según severidad
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-500/50 bg-red-900/20';
      case 'medium': return 'border-yellow-500/50 bg-yellow-900/20';
      case 'low': return 'border-blue-500/50 bg-blue-900/20';
    }
  };
};
```

### 2. 🎯 Análisis de Riesgo Avanzado
- **Archivo**: `src/components/RiskAnalysisPanel.jsx`
- **Descripción**: Evaluación completa de riesgo para direcciones blockchain
- **Características**:
  - Scoring de riesgo de 0-100
  - Análisis de factores de riesgo
  - Recomendaciones de seguridad personalizadas
  - Visualización circular del nivel de riesgo
  - Información detallada del nodo

**Algoritmo de scoring**:
```javascript
// El backend calcula el riesgo basado en múltiples factores:
// - Reputación del nodo (0-100)
// - Tipo de nodo (unknown, mixer, phishing = alto riesgo)
// - Presencia en listas negras
// - Patrones de transacción sospechosos
// - Transacciones de alto valor
// - Transacciones marcadas como fraudulentas
```

### 3. 🔍 Seguimiento de Fondos (Fund Tracing)
- **Archivo**: `src/components/FundTracingPanel.jsx`
- **Descripción**: Rastreo forense del flujo de criptomonedas
- **Características**:
  - Seguimiento multi-nivel (2-5 saltos)
  - Visualización de caminos de transacciones
  - Análisis de distribución de montos
  - Estadísticas de seguimiento
  - Identificación de patrones de lavado

**Algoritmo BFS para rastreo**:
```python
def trace_funds():
    # Implementa búsqueda en anchura (BFS) para seguir el flujo de fondos
    queue = deque([(start_address, [start_address], 0, 0)])
    while queue:
        current_node, path, depth, total_amount = queue.popleft()
        # Explora transacciones salientes hasta la profundidad máxima
```

### 4. 📊 Dashboard de Métricas Avanzadas
- **Archivo**: `src/components/AdvancedMetricsPanel.jsx`
- **Descripción**: Análisis completo de la red blockchain
- **Características**:
  - Análisis temporal por horas
  - Distribución geográfica de nodos
  - Análisis de flujo de fondos
  - Métricas de salud de la red
  - Gráficos interactivos con Recharts

**Tipos de gráficos implementados**:
```javascript
// Gráfico de área para análisis temporal
<AreaChart data={hourlyData}>
  <Area dataKey="volume" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
</AreaChart>

// Gráfico circular para distribución geográfica
<PieChart>
  <Pie data={regionData} dataKey="value" />
</PieChart>

// Gráfico de barras para flujo de fondos
<BarChart data={flowData}>
  <Bar dataKey="sent" fill="#ef4444" />
  <Bar dataKey="received" fill="#10b981" />
</BarChart>
```

### 5. 💰 Widget de Precios en Tiempo Real
- **Archivo**: `src/components/CryptoPriceWidget.jsx`
- **Descripción**: Monitoreo de precios de criptomonedas
- **Características**:
  - Precios de ETH y BTC
  - Cambios porcentuales 24h
  - Volumen de trading y market cap
  - Actualización automática cada 30 segundos

### 6. 🌐 Visualización de Red Blockchain
- **Archivo**: `src/components/NetworkGraph.jsx`
- **Descripción**: Grafo interactivo de la red blockchain
- **Características**:
  - Nodos posicionados en círculo
  - Enlaces con grosor proporcional al monto
  - Interactividad (click en nodos y enlaces)
  - Animaciones con Framer Motion
  - Colores según criticidad del nodo

## 🔧 Backend - APIs y Análisis

### Estructura del Backend
El archivo `backend/app.py` contiene todas las APIs y lógica de análisis:

### APIs Implementadas

#### 1. `/api/data` - Datos principales de blockchain
```python
@app.route('/api/data', methods=['GET'])
def get_blockchain_data():
    # Genera datos simulados de nodos y transacciones
    # Incluye alertas y métricas de red
    return jsonify(data)
```

#### 2. `/api/crypto-prices` - Precios de criptomonedas
```python
@app.route('/api/crypto-prices', methods=['GET'])
def get_crypto_prices():
    # Simula precios en tiempo real de ETH y BTC
    # En producción se conectaría a APIs como CoinGecko
    return jsonify(prices)
```

#### 3. `/api/alerts` - Sistema de alertas
```python
@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    # Genera alertas basadas en patrones sospechosos detectados
    return jsonify(alerts)
```

#### 4. `/api/risk-analysis` - Análisis de riesgo
```python
@app.route('/api/risk-analysis', methods=['POST'])
def analyze_risk():
    # Calcula score de riesgo basado en múltiples factores
    # Genera recomendaciones de seguridad
    return jsonify(risk_analysis)
```

#### 5. `/api/fund-tracing` - Seguimiento de fondos
```python
@app.route('/api/fund-tracing', methods=['POST'])
def trace_funds():
    # Implementa algoritmo BFS para rastrear flujo de fondos
    # Encuentra caminos de transacciones hasta profundidad especificada
    return jsonify(traced_paths)
```

#### 6. `/api/network-analysis` - Análisis de red
```python
@app.route('/api/network-analysis', methods=['GET'])
def get_network_analysis():
    # Análisis completo: temporal, geográfico, flujo de dinero
    # Calcula métricas de salud de la red
    return jsonify(analysis)
```

### Algoritmos de Detección

#### Detección de Patrones Sospechosos
```python
def detect_suspicious_patterns(transactions, nodes):
    patterns = {
        'rapidTransactions': [],      # Transacciones rápidas (bots)
        'circularTransactions': [],   # Transacciones circulares
        'highValueTransactions': [],  # Transacciones de alto valor
        'mixerActivity': [],          # Actividad con mixers
        'blacklistedActivity': []     # Actividad con direcciones maliciosas
    }
    # Implementa lógica de detección para cada patrón
```

#### Cálculo de Métricas de Red
```python
def calculate_network_metrics(nodes, transactions):
    # Calcula métricas avanzadas:
    # - Coeficiente de Gini (desigualdad de riqueza)
    # - Densidad de la red
    # - Análisis de centralidad
    # - Flujo de dinero
    # - Patrones sospechosos
```

## 🎨 Tecnologías y Librerías

### Frontend
- **React 18**: Framework principal con Hooks
- **Framer Motion**: Animaciones fluidas y transiciones
- **Recharts**: Gráficos y visualizaciones interactivas
- **Tailwind CSS**: Framework de estilos utility-first
- **Lucide React**: Iconos modernos y consistentes
- **Vite**: Build tool rápido para desarrollo

### Backend
- **Flask**: Framework web minimalista de Python
- **Flask-CORS**: Manejo de CORS para APIs
- **Collections**: Estructuras de datos avanzadas (defaultdict, deque)
- **Datetime**: Manejo de fechas y timestamps
- **Random**: Generación de datos simulados

### Herramientas de Desarrollo
- **Node.js**: Entorno de ejecución para JavaScript
- **Python 3.14**: Lenguaje del backend
- **npm**: Gestor de paquetes de Node.js
- **pip**: Gestor de paquetes de Python

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- Python 3.8 o superior
- npm o yarn

### Instalación del Frontend
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Instalación del Backend
```bash
# Instalar dependencias de Python
pip install Flask Flask-CORS

# Iniciar servidor Flask
python backend/app.py
```

### URLs de Acceso
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📊 Estructura de Datos

### Formato de Nodos
```javascript
{
  id: '0x1a2b3c',           // Dirección única
  name: 'Exchange Hub',      // Nombre descriptivo
  isCritical: true,         // Si es un nodo crítico
  type: 'exchange',         // Tipo: exchange, wallet, contract, pool, mixer, etc.
  region: 'US',             // Región geográfica
  reputation: 0.9           // Reputación (0-1)
}
```

### Formato de Transacciones
```javascript
{
  id: 'tx_001',                    // ID único de transacción
  source: '0x1a2b3c',             // Dirección origen
  target: '0x4d5e6f',             // Dirección destino
  amount: 125.5,                  // Monto en ETH
  timestamp: 1640995200,          // Timestamp Unix
  isFlagged: false,               // Si está marcada como sospechosa
  gasPrice: 20,                   // Precio del gas
  gasUsed: 21000                  // Gas utilizado
}
```

### Formato de Alertas
```javascript
{
  id: 'alert_1',                           // ID único
  type: 'rapid_transactions',              // Tipo de alerta
  severity: 'high',                        // Severidad: high, medium, low
  title: 'Actividad Sospechosa Detectada', // Título
  description: 'Descripción detallada',    // Descripción
  timestamp: 1640995200,                   // Timestamp
  data: { /* datos específicos */ }        // Datos adicionales
}
```

## 🔒 Funcionalidades de Seguridad

### Sistema de Listas Negras
```python
BLACKLISTED_ADDRESSES = {
    '0x112233': {
        'type': 'ransomware',
        'severity': 'high',
        'description': 'Known ransomware wallet'
    },
    '0x998877': {
        'type': 'mixer',
        'severity': 'medium',
        'description': 'Cryptocurrency mixer'
    }
}
```

### Umbrales de Alertas
```python
ALERT_THRESHOLDS = {
    'large_transaction': 100.0,    # ETH
    'rapid_transactions': 5,       # Transacciones en 10 minutos
    'suspicious_pattern': 0.8      # Score de riesgo
}
```

## 📈 Métricas y KPIs

### Métricas de Red
- **Densidad de Red**: Conectividad entre nodos
- **Coeficiente de Clustering**: Agrupación de nodos
- **Coeficiente de Gini**: Desigualdad en la distribución de fondos
- **Centralidad**: Importancia de nodos en la red

### Métricas de Seguridad
- **Ratio de Transacciones Marcadas**: % de transacciones sospechosas
- **Score de Salud de Red**: Puntuación general (0-100)
- **Reputación Promedio**: Reputación media de nodos
- **Nivel de Riesgo**: LOW, MEDIUM, HIGH

### Métricas Temporales
- **Volumen por Hora**: Actividad temporal
- **Horas Pico**: Períodos de mayor actividad
- **Patrones Estacionales**: Tendencias temporales

## 🎯 Casos de Uso

### 1. Investigación Forense
- Rastrear fondos robados o fraudulentos
- Identificar redes de lavado de dinero
- Generar evidencia para casos legales

### 2. Compliance y Regulación
- Monitorear transacciones para cumplimiento
- Detectar actividades de alto riesgo
- Generar reportes regulatorios

### 3. Análisis de Mercado
- Estudiar patrones de trading
- Identificar ballenas y grandes movimientos
- Analizar comportamiento del mercado

### 4. Seguridad Empresarial
- Monitorear wallets corporativas
- Detectar amenazas en tiempo real
- Evaluar riesgo de contrapartes

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas
- **Machine Learning**: Modelos de detección más sofisticados
- **Integración con APIs Reales**: CoinGecko, Chainalysis, Elliptic
- **Soporte Multi-Blockchain**: Bitcoin, Ethereum, BSC, Polygon
- **Reportes PDF**: Generación automática de reportes
- **Base de Datos**: Persistencia de datos y análisis histórico
- **Autenticación**: Sistema de usuarios y permisos
- **Notificaciones**: Email, SMS, webhooks
- **API Pública**: Endpoints para integraciones externas

### Mejoras Técnicas
- **WebSockets**: Actualizaciones en tiempo real
- **Caching**: Redis para mejor rendimiento
- **Microservicios**: Arquitectura escalable
- **Docker**: Containerización para deployment
- **Tests**: Suite completa de pruebas automatizadas

## 👥 Equipo de Desarrollo

**Grupo 7 - Proyecto de Análisis Blockchain**

### Contribuciones
- **Frontend**: Desarrollo de componentes React y UI/UX
- **Backend**: APIs Flask y algoritmos de análisis
- **Análisis**: Lógica de detección y métricas
- **Diseño**: Interfaz y experiencia de usuario

## 📄 Licencia

Este proyecto es desarrollado con fines educativos y de investigación.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

**ChainAudit Pro** - Protegiendo el ecosistema blockchain con tecnología avanzada 🔐✨
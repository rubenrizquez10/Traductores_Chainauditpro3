import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Globe, Clock, Activity, Shield, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CryptoPriceWidget } from './CryptoPriceWidget';
import { getApiUrl } from '../config';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const MetricCard = ({ title, value, change, icon: Icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 hover:border-cyan-500/50 transition-colors"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-2 rounded-lg", `bg-${color}-500/10`)}>
        <Icon className={cn("w-5 h-5", `text-${color}-400`)} />
      </div>
      {change && (
        <span className={cn(
          "text-xs px-2 py-1 rounded-full",
          change > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
        )}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </motion.div>
);

const NetworkHealthIndicator = ({ healthData }) => {
  const getHealthColor = (score) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthBg = (score) => {
    if (score >= 70) return 'bg-emerald-500/10 border-emerald-500/30';
    if (score >= 40) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  return (
    <div className={cn("rounded-lg p-4 border", getHealthBg(healthData.healthScore))}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium">Salud de la Red</h4>
        <Shield className={cn("w-5 h-5", getHealthColor(healthData.healthScore))} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Puntuación General</span>
          <span className={cn("font-bold", getHealthColor(healthData.healthScore))}>
            {healthData.healthScore}/100
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Transacciones Marcadas</span>
          <span className="text-red-400">{healthData.flaggedRatio}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Reputación Promedio</span>
          <span className="text-cyan-400">{(healthData.avgReputation * 100).toFixed(1)}%</span>
        </div>
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-400 text-xs">Nivel de Riesgo</span>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              healthData.riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-300' :
              healthData.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-red-500/20 text-red-300'
            )}>
              {healthData.riskLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdvancedMetricsPanel = () => {
  const [metricsData, setMetricsData] = useState(null);
  const [cryptoPrices, setCryptoPrices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [networkResponse, pricesResponse] = await Promise.all([
          fetch(getApiUrl('/api/network-analysis')),
          fetch(getApiUrl('/api/crypto-prices'))
        ]);

        if (networkResponse.ok && pricesResponse.ok) {
          const networkData = await networkResponse.json();
          const pricesData = await pricesResponse.json();
          setMetricsData(networkData);
          setCryptoPrices(pricesData);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin" />
        <span className="ml-3 text-slate-400">Cargando métricas avanzadas...</span>
      </div>
    );
  }

  if (!metricsData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">Error al cargar las métricas</p>
      </div>
    );
  }

  // Preparar datos para gráficos
  const hourlyData = Object.entries(metricsData.temporalAnalysis.hourlyVolume || {}).map(([hour, volume]) => ({
    hour: `${hour}:00`,
    volume: volume,
    count: metricsData.temporalAnalysis.hourlyCount[hour] || 0
  })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  const regionData = Object.entries(metricsData.geographicAnalysis.regionDistribution || {}).map(([region, count]) => ({
    name: region,
    value: count,
    risk: metricsData.geographicAnalysis.riskByRegion[region]?.avgRisk || 0
  }));

  const flowData = metricsData.flowAnalysis.topSenders.slice(0, 5).map(sender => ({
    address: `${sender.address.slice(0, 6)}...${sender.address.slice(-4)}`,
    sent: sender.amount,
    received: metricsData.flowAnalysis.topReceivers.find(r => r.address === sender.address)?.amount || 0
  }));

  const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Crypto Prices Widget */}
      <CryptoPriceWidget />

      {/* Network Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <NetworkHealthIndicator healthData={metricsData.networkHealth} />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <MetricCard
            title="Concentración de Flujo"
            value={`${(metricsData.flowAnalysis.flowConcentration.avgConcentration * 100).toFixed(1)}%`}
            icon={Activity}
            color="purple"
            delay={0.2}
          />
          <MetricCard
            title="Volumen Total"
            value={`${metricsData.flowAnalysis.totalVolume.toFixed(2)} ETH`}
            icon={TrendingUp}
            color="emerald"
            delay={0.3}
          />
        </div>
      </div>

      {/* Temporal Analysis */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Análisis Temporal de Transacciones
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            Distribución Geográfica
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Flujo de Fondos por Dirección
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="address" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Bar dataKey="sent" fill="#ef4444" name="Enviado" />
                <Bar dataKey="received" fill="#10b981" name="Recibido" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Peak Hours Analysis */}
      {metricsData.temporalAnalysis.peakHours && (
        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Horas Pico de Actividad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metricsData.temporalAnalysis.peakHours.map((peak, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Hora Pico #{index + 1}</span>
                  <Clock className="w-4 h-4 text-yellow-400" />
                </div>
                <p className="text-xl font-bold text-white">{peak.hour}:00</p>
                <p className="text-yellow-400 text-sm font-mono">{peak.volume.toFixed(2)} ETH</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk by Region */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          Análisis de Riesgo por Región
        </h3>
        <div className="space-y-3">
          {Object.entries(metricsData.geographicAnalysis.riskByRegion || {}).map(([region, data]) => (
            <div key={region} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-white font-medium">{region}</p>
                <p className="text-slate-400 text-sm">{data.nodeCount} nodos</p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-bold",
                  data.avgRisk > 60 ? "text-red-400" :
                  data.avgRisk > 30 ? "text-yellow-400" :
                  "text-emerald-400"
                )}>
                  {data.avgRisk.toFixed(1)}%
                </p>
                <p className="text-slate-400 text-xs">riesgo promedio</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
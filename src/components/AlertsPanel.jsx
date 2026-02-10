import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Clock, X, Bell, BellOff, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const AlertCard = ({ alert, onDismiss, index }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-500/50 bg-red-900/20';
      case 'medium': return 'border-yellow-500/50 bg-yellow-900/20';
      case 'low': return 'border-blue-500/50 bg-blue-900/20';
      default: return 'border-slate-500/50 bg-slate-900/20';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'medium': return <Shield className="w-5 h-5 text-yellow-400" />;
      case 'low': return <Clock className="w-5 h-5 text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        "border rounded-lg p-4 backdrop-blur-md relative group hover:shadow-lg transition-all duration-300",
        getSeverityColor(alert.severity)
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800/50">
            {getSeverityIcon(alert.severity)}
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">{alert.title}</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              {alert.severity} • {alert.type.replace('_', ' ')}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDismiss(alert.id)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded transition-all duration-200"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <p className="text-slate-300 text-sm mb-3 leading-relaxed">
        {alert.description}
      </p>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {new Date(alert.timestamp * 1000).toLocaleString()}
        </span>
        <span className={cn(
          "px-2 py-1 rounded-full font-medium",
          alert.severity === 'high' ? 'bg-red-500/20 text-red-300' :
          alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
          'bg-blue-500/20 text-blue-300'
        )}>
          {alert.severity.toUpperCase()}
        </span>
      </div>

      {alert.data && (
        <div className="mt-3 p-3 bg-slate-950/50 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-1">Detalles:</p>
          <div className="text-xs text-slate-300 space-y-1">
            {Object.entries(alert.data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-mono">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const AlertsPanel = ({ alerts: initialAlerts = [], onAlertAction }) => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState('all');
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setAlerts(initialAlerts);
  }, [initialAlerts]);

  const handleDismiss = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    if (onAlertAction) {
      onAlertAction('dismiss', alertId);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  const alertCounts = {
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-lg hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-medium">{alerts.length}</span>
            {alertCounts.high > 0 && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-20 right-4 w-96 max-h-[calc(100vh-100px)] bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl z-40 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white">Alertas del Sistema</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <BellOff className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map((severity) => (
            <button
              key={severity}
              onClick={() => setFilter(severity)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                filter === severity
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              )}
            >
              {severity === 'all' ? 'Todas' : severity.toUpperCase()}
              {severity !== 'all' && (
                <span className="ml-1">({alertCounts[severity]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts list */}
      <div className="p-4 space-y-3 overflow-y-auto max-h-96">
        <AnimatePresence>
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onDismiss={handleDismiss}
                index={index}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">
                {filter === 'all' ? 'No hay alertas activas' : `No hay alertas de nivel ${filter}`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {alerts.length > 0 && (
        <div className="p-4 border-t border-slate-700/50 bg-slate-950/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total: {alerts.length} alertas</span>
            <button
              onClick={() => setAlerts([])}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Limpiar todas
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
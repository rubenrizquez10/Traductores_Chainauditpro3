import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, TrendingUp, Search, X, Target, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getApiUrl } from '../config';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const RiskMeter = ({ score, level, color }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-slate-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-xs text-slate-400">RIESGO</span>
      </div>
    </div>
  );
};

const RiskFactor = ({ factor, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
  >
    <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
    <span className="text-slate-300 text-sm">{factor}</span>
  </motion.div>
);

const Recommendation = ({ recommendation, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30"
  >
    <Target className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
    <span className="text-slate-300 text-sm leading-relaxed">{recommendation}</span>
  </motion.div>
);

export const RiskAnalysisPanel = ({ selectedWallet, onClose }) => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');

  const analyzeRisk = async (address) => {
    if (!address) return;
    
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/risk-analysis'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setRiskData(data);
      } else {
        console.error('Error analyzing risk');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedWallet) {
      setSearchAddress(selectedWallet);
      analyzeRisk(selectedWallet);
    }
  }, [selectedWallet]);

  const handleSearch = () => {
    if (searchAddress.trim()) {
      analyzeRisk(searchAddress.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Análisis de Riesgo Avanzado</h2>
            <p className="text-slate-400">Evaluación completa de seguridad para direcciones blockchain</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ingresa una dirección para analizar..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchAddress.trim()}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Analizar
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin" />
            <span className="ml-3 text-slate-400">Analizando riesgo...</span>
          </div>
        )}

        {/* Risk Analysis Results */}
        {riskData && !loading && (
          <div className="space-y-6">
            {/* Risk Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex flex-col items-center justify-center bg-slate-950/50 rounded-xl p-6 border border-slate-700/50">
                <RiskMeter
                  score={riskData.riskScore}
                  level={riskData.riskLevel}
                  color={riskData.riskColor}
                />
                <div className="mt-4 text-center">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium mb-2",
                    riskData.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-300' :
                    riskData.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  )}>
                    RIESGO {riskData.riskLevel}
                  </div>
                  <p className="text-slate-400 text-sm">Puntuación: {riskData.riskScore}/100</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                {/* Node Info */}
                <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Información del Nodo
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Nombre</p>
                      <p className="text-white font-medium">{riskData.nodeInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Tipo</p>
                      <p className="text-white font-medium capitalize">{riskData.nodeInfo.type}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Región</p>
                      <p className="text-white font-medium">{riskData.nodeInfo.region}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Reputación</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${riskData.nodeInfo.reputation * 100}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium">
                          {(riskData.nodeInfo.reputation * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Summary */}
                <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    Resumen de Transacciones
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{riskData.transactionSummary.total}</p>
                      <p className="text-slate-400 text-sm">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-400">{riskData.transactionSummary.flagged}</p>
                      <p className="text-slate-400 text-sm">Marcadas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">{riskData.transactionSummary.highValue}</p>
                      <p className="text-slate-400 text-sm">Alto Valor</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-400">{riskData.transactionSummary.totalVolume.toFixed(2)}</p>
                      <p className="text-slate-400 text-sm">Volumen ETH</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            {riskData.riskFactors.length > 0 && (
              <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Factores de Riesgo Identificados
                </h3>
                <div className="space-y-3">
                  {riskData.riskFactors.map((factor, index) => (
                    <RiskFactor key={index} factor={factor} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {riskData.recommendations.length > 0 && (
              <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Recomendaciones de Seguridad
                </h3>
                <div className="space-y-3">
                  {riskData.recommendations.map((recommendation, index) => (
                    <Recommendation key={index} recommendation={recommendation} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No data state */}
        {!riskData && !loading && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Ingresa una dirección para comenzar el análisis de riesgo</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
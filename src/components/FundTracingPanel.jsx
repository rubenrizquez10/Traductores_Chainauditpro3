import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, X, GitBranch, DollarSign, Clock, Target } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getApiUrl } from '../config';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const PathVisualization = ({ path, totalAmount, depth, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-cyan-500/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-medium">Camino {index + 1}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-emerald-400">
            <DollarSign className="w-3 h-3" />
            <span className="font-mono">{totalAmount.toFixed(4)} ETH</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Target className="w-3 h-3" />
            <span>Profundidad: {depth}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {path.map((address, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center min-w-0">
              <div className={cn(
                "px-3 py-2 rounded-lg border text-xs font-mono whitespace-nowrap",
                i === 0 ? "bg-blue-500/20 border-blue-500/50 text-blue-300" :
                i === path.length - 1 ? "bg-red-500/20 border-red-500/50 text-red-300" :
                "bg-slate-700/50 border-slate-600/50 text-slate-300"
              )}>
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
              <span className="text-xs text-slate-500 mt-1">
                {i === 0 ? 'Origen' : i === path.length - 1 ? 'Destino' : `Paso ${i}`}
              </span>
            </div>
            {i < path.length - 1 && (
              <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

const TracingSummary = ({ summary }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-cyan-400" />
        <span className="text-slate-400 text-sm">Caminos Encontrados</span>
      </div>
      <p className="text-2xl font-bold text-white">{summary.totalPaths}</p>
    </div>
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="w-4 h-4 text-emerald-400" />
        <span className="text-slate-400 text-sm">Monto Máximo</span>
      </div>
      <p className="text-2xl font-bold text-emerald-400">{summary.maxAmount.toFixed(4)} ETH</p>
    </div>
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-yellow-400" />
        <span className="text-slate-400 text-sm">Promedio</span>
      </div>
      <p className="text-2xl font-bold text-yellow-400">{summary.avgAmount.toFixed(4)} ETH</p>
    </div>
  </div>
);

export const FundTracingPanel = ({ selectedWallet, onClose }) => {
  const [tracingData, setTracingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [depth, setDepth] = useState(3);

  const traceFunds = async (address, maxDepth = 3) => {
    if (!address) return;
    
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/fund-tracing'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, depth: maxDepth }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setTracingData(data);
      } else {
        console.error('Error tracing funds');
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
      traceFunds(selectedWallet, depth);
    }
  }, [selectedWallet]);

  const handleSearch = () => {
    if (searchAddress.trim()) {
      traceFunds(searchAddress.trim(), depth);
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
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Seguimiento de Fondos</h2>
            <p className="text-slate-400">Rastrea el flujo de criptomonedas a través de la red blockchain</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Search Controls */}
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ingresa la dirección de origen para rastrear..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-sm">Profundidad:</label>
              <select
                value={depth}
                onChange={(e) => setDepth(parseInt(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-3 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value={2}>2 niveles</option>
                <option value={3}>3 niveles</option>
                <option value={4}>4 niveles</option>
                <option value={5}>5 niveles</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchAddress.trim()}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Rastrear
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin" />
            <span className="ml-3 text-slate-400">Rastreando fondos...</span>
          </div>
        )}

        {/* Tracing Results */}
        {tracingData && !loading && (
          <div className="space-y-6">
            {/* Summary */}
            <TracingSummary summary={tracingData.summary} />

            {/* Start Address Info */}
            <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Dirección de Origen
              </h3>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                <p className="font-mono text-cyan-400 text-lg">{tracingData.startAddress}</p>
                <p className="text-slate-400 text-sm mt-1">
                  Se encontraron {tracingData.tracedPaths.length} caminos de flujo de fondos
                </p>
              </div>
            </div>

            {/* Traced Paths */}
            {tracingData.tracedPaths.length > 0 ? (
              <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-cyan-400" />
                  Caminos de Fondos Detectados
                </h3>
                <div className="space-y-4">
                  <AnimatePresence>
                    {tracingData.tracedPaths.map((pathData, index) => (
                      <PathVisualization
                        key={index}
                        path={pathData.path}
                        totalAmount={pathData.totalAmount}
                        depth={pathData.depth}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-700/50 text-center">
                <GitBranch className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No se encontraron caminos de fondos desde esta dirección</p>
              </div>
            )}

            {/* Analysis Insights */}
            {tracingData.tracedPaths.length > 0 && (
              <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  Análisis de Patrones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Distribución de Montos</h4>
                    <div className="space-y-2">
                      {tracingData.tracedPaths.slice(0, 3).map((path, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">Camino {i + 1}</span>
                          <span className="text-emerald-400 font-mono text-sm">
                            {path.totalAmount.toFixed(4)} ETH
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Estadísticas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Caminos únicos:</span>
                        <span className="text-white">{tracingData.tracedPaths.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Profundidad máxima:</span>
                        <span className="text-white">{Math.max(...tracingData.tracedPaths.map(p => p.depth))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Volumen total:</span>
                        <span className="text-emerald-400 font-mono">
                          {tracingData.tracedPaths.reduce((sum, p) => sum + p.totalAmount, 0).toFixed(4)} ETH
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No data state */}
        {!tracingData && !loading && (
          <div className="text-center py-12">
            <GitBranch className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Ingresa una dirección para comenzar el seguimiento de fondos</p>
            <p className="text-slate-500 text-sm mt-2">
              El sistema rastreará automáticamente el flujo de criptomonedas desde la dirección especificada
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
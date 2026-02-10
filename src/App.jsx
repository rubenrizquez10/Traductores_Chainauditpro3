import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, AlertTriangle, Users, Network, Clock, X, Home, Bell, BarChart3, GitBranch, Target } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generateBlockchainData } from './utils/blockchainDataGenerator';
import { TransactionTable } from './components/TransactionTable';
import { NetworkGraph } from './components/NetworkGraph';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AlertsPanel } from './components/AlertsPanel';
import { RiskAnalysisPanel } from './components/RiskAnalysisPanel';
import { FundTracingPanel } from './components/FundTracingPanel';
import { AdvancedMetricsPanel } from './components/AdvancedMetricsPanel';
import HomePage from './components/HomePage';
import { getApiUrl } from './config';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DashboardCard = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={cn(
      "bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 overflow-hidden relative group",
      className
    )}
  >
    {children}
  </motion.div>
);

function App() {
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [alerts, setAlerts] = useState([]);
  const [showRiskAnalysis, setShowRiskAnalysis] = useState(false);
  const [showFundTracing, setShowFundTracing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (currentPage === 'dashboard') {
      setIsLoading(true);
      const timer = setTimeout(async () => {
        const blockchainData = generateBlockchainData();
        setData(blockchainData);
        
        // Fetch alerts from backend
        try {
          const alertsResponse = await fetch(getApiUrl('/api/alerts'));
          if (alertsResponse.ok) {
            const alertsData = await alertsResponse.json();
            setAlerts(alertsData);
          }
        } catch (error) {
          console.error('Error fetching alerts:', error);
        }
        
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const filteredTransactions = data ? data.transactions.filter(tx => 
    tx.source.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tx.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const filteredTransactionsByWallet = selectedWallet ? 
    filteredTransactions.filter(tx => tx.source === selectedWallet || tx.target === selectedWallet) : 
    filteredTransactions;

  const stats = data ? {
    totalVolume: filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0),
    totalTransactions: filteredTransactions.length,
    avgTransaction: filteredTransactions.length > 0 ? filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0) / filteredTransactions.length : 0,
    flaggedCount: filteredTransactions.filter(tx => tx.isFlagged).length
  } : { totalVolume: 0, totalTransactions: 0, avgTransaction: 0, flaggedCount: 0 };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAlertAction = (action, alertId) => {
    if (action === 'dismiss') {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7">
              <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-cyan-400" />
                  Mapas de Nodos
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedWallet(null)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <NetworkGraph 
                nodes={data.nodes} 
                links={data.links} 
                selectedWallet={selectedWallet}
                setSelectedWallet={setSelectedWallet}
                onSelectTransaction={setSelectedTransaction}
              />
            </div>

            <div className="col-span-5">
              <AnalyticsDashboard 
                transactions={filteredTransactionsByWallet}
                onSelectTransaction={setSelectedTransaction}
                selectedWallet={selectedWallet}
                chartData={data ? [
                  { name: 'Legítimas', value: filteredTransactions.length - stats.flaggedCount, color: '#10b981' },
                  { name: 'Sospechosas', value: stats.flaggedCount, color: '#ef4444' }
                ] : []}
              />
            </div>
          </div>
        );
      case 'metrics':
        return <AdvancedMetricsPanel />;
      default:
        return null;
    }
  };

  if (currentPage === 'home') {
    return <HomePage onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight">ChainAudit <span className="text-cyan-500">Pro</span></h1>
              <p className="text-xs text-slate-500 font-medium">Análisis de Seguridad Blockchain - Grupo 7</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">Inicio</span>
            </button>
            
            {/* Advanced Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRiskAnalysis(true)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors"
                title="Análisis de Riesgo"
              >
                <Target className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium hidden md:block">Riesgo</span>
              </button>
              <button
                onClick={() => setShowFundTracing(true)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors"
                title="Seguimiento de Fondos"
              >
                <GitBranch className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium hidden md:block">Fondos</span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 w-64 focus-within:border-cyan-500/50 transition-colors">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar wallet o tx hash..."
                className="bg-transparent border-none outline-none text-sm w-full text-slate-200 placeholder:text-slate-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Alerts indicator */}
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-400" />
              {alerts.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{alerts.length > 9 ? '9+' : alerts.length}</span>
                </div>
              )}
            </div>
            
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 border-2 border-slate-900 cursor-pointer hover:scale-110 transition-transform" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-slate-400 font-medium animate-pulse">Cargando red blockchain...</p>
          </div>
        ) : data ? (
          <>
            {/* Tab Navigation */}
            <div className="px-6 py-4 border-b border-slate-800">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                    activeTab === 'overview'
                      ? "bg-cyan-500 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <Network className="w-4 h-4" />
                  Vista General
                </button>
                <button
                  onClick={() => setActiveTab('metrics')}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                    activeTab === 'metrics'
                      ? "bg-cyan-500 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <BarChart3 className="w-4 h-4" />
                  Métricas Avanzadas
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {activeTab === 'overview' && (
                <>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <DashboardCard className="col-span-1 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="bg-slate-800 p-2 rounded-lg">
                          <Network className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">+12%</span>
                      </div>
                      <div className="mt-4">
                        <p className="text-slate-400 text-xs font-medium mb-1">Volumen Total</p>
                        <h3 className="text-2xl font-bold text-white">{stats.totalVolume.toFixed(2)} ETH</h3>
                      </div>
                    </DashboardCard>

                    <DashboardCard className="col-span-1 flex flex-col justify-between hover:border-purple-500/50 transition-colors" delay={0.1}>
                       <div className="bg-slate-800 p-2 rounded-lg">
                          <Users className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="mt-4">
                        <p className="text-slate-400 text-xs font-medium mb-1">Transacciones</p>
                        <h3 className="text-2xl font-bold text-white">{stats.totalTransactions}</h3>
                      </div>
                    </DashboardCard>

                    <DashboardCard className="col-span-1 flex flex-col justify-between hover:border-emerald-500/50 transition-colors" delay={0.2}>
                       <div className="bg-slate-800 p-2 rounded-lg">
                          <Clock className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="mt-4">
                        <p className="text-slate-400 text-xs font-medium mb-1">Promedio de Tx</p>
                        <h3 className="text-2xl font-bold text-white">{stats.avgTransaction.toFixed(4)} ETH</h3>
                      </div>
                    </DashboardCard>

                    <DashboardCard className="col-span-1 flex flex-col justify-between border-red-500/20 hover:border-red-500/50 transition-colors" delay={0.3}>
                       <div className="bg-red-500/10 p-2 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="mt-4">
                        <p className="text-slate-400 text-xs font-medium mb-1">Sospechosos</p>
                        <h3 className="text-2xl font-bold text-red-400">{stats.flaggedCount}</h3>
                      </div>
                    </DashboardCard>
                  </div>
                </>
              )}

              {renderTabContent()}
            </div>

            {/* Alerts Panel */}
            <AlertsPanel alerts={alerts} onAlertAction={handleAlertAction} />

            {/* Risk Analysis Modal */}
            <AnimatePresence>
              {showRiskAnalysis && (
                <RiskAnalysisPanel
                  selectedWallet={selectedWallet}
                  onClose={() => setShowRiskAnalysis(false)}
                />
              )}
            </AnimatePresence>

            {/* Fund Tracing Modal */}
            <AnimatePresence>
              {showFundTracing && (
                <FundTracingPanel
                  selectedWallet={selectedWallet}
                  onClose={() => setShowFundTracing(false)}
                />
              )}
            </AnimatePresence>

            {selectedTransaction && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Detalles de Transacción</h3>
                      <p className="text-slate-400 text-sm">ID: {selectedTransaction.id}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedTransaction(null)}
                      className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-slate-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <p className="text-slate-400 text-xs mb-1">Source Wallet</p>
                      <p className="font-mono text-slate-200 text-sm">{selectedTransaction.source}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <p className="text-slate-400 text-xs mb-1">Target Wallet</p>
                      <p className="font-mono text-slate-200 text-sm">{selectedTransaction.target}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <p className="text-slate-400 text-xs mb-1">Monto</p>
                      <p className="font-mono text-slate-200 text-sm">{selectedTransaction.amount.toFixed(4)} ETH</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <p className="text-slate-400 text-xs mb-1">Status</p>
                      <p className={cn(
                        "font-mono text-sm",
                        selectedTransaction.isFlagged ? "text-red-400" : "text-emerald-400"
                      )}>
                        {selectedTransaction.isFlagged ? "FLAGGED" : "CLEAN"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <p className="text-slate-400 text-xs mb-1">Timestamp</p>
                    <p className="font-mono text-slate-200 text-sm">
                      {new Date(selectedTransaction.timestamp * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}

export default App;
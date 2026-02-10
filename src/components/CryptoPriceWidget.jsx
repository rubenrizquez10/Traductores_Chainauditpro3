import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getApiUrl } from '../config';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const PriceCard = ({ crypto, data, delay = 0 }) => {
  const isPositive = data.change_24h >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-4 hover:border-cyan-500/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {crypto === 'ethereum' ? 'ETH' : 'BTC'}
            </span>
          </div>
          <span className="text-white font-medium capitalize">{crypto}</span>
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
          isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(data.change_24h).toFixed(2)}%
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-slate-400 text-xs mb-1">Precio Actual</p>
          <p className="text-2xl font-bold text-white">${data.price.toLocaleString()}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-500">Volumen 24h</p>
            <p className="text-slate-300 font-mono">${(data.volume_24h / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-slate-500">Market Cap</p>
            <p className="text-slate-300 font-mono">${(data.market_cap / 1000000000).toFixed(1)}B</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CryptoPriceWidget = () => {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchPrices = async () => {
    try {
      const response = await fetch(getApiUrl('/api/crypto-prices'));
      if (response.ok) {
        const data = await response.json();
        setPrices(data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin" />
        <span className="ml-2 text-slate-400 text-sm">Cargando precios...</span>
      </div>
    );
  }

  if (!prices) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-400 text-sm">Error al cargar precios</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          Precios en Tiempo Real
        </h3>
        {lastUpdate && (
          <span className="text-xs text-slate-500">
            Actualizado: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(prices).map(([crypto, data], index) => (
          <PriceCard
            key={crypto}
            crypto={crypto}
            data={data}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};
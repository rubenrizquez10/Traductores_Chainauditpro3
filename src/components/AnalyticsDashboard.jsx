import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TransactionTable } from './TransactionTable';

export const AnalyticsDashboard = ({ transactions, onSelectTransaction, selectedWallet, chartData }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Distribución de Transacciones</h3>
          <div className="text-sm text-slate-400">
            {transactions.length} txs
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">
            {selectedWallet ? 'Transacciones del Nodo' : 'Todas las Transacciones'}
          </h3>
        </div>
        <TransactionTable 
          transactions={transactions} 
          onSelectTransaction={onSelectTransaction}
        />
      </div>
    </div>
  );
};
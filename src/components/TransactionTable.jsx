import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const TransactionTable = ({ transactions, onSelectTransaction }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-700 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <th className="pb-4 pl-4 pr-4">Timestamp</th>
            <th className="pb-4 pl-4 pr-4">Source</th>
            <th className="pb-4 pl-4 pr-4">Destino</th>
            <th className="pb-4 pl-4 pr-4 text-right">Monto</th>
            <th className="pb-4 pl-4 pr-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {transactions.map((tx, i) => (
            <motion.tr
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "group hover:bg-slate-800/50 cursor-pointer transition-colors",
                tx.isFlagged && "bg-red-900/20 hover:bg-red-900/40 border-l-4 border-l-red-500"
              )}
              onClick={() => onSelectTransaction(tx)}
            >
              <td className="py-4 pl-4 pr-4 text-sm text-slate-400 font-mono">
                {new Date(tx.timestamp * 1000).toLocaleTimeString()}
              </td>
              <td className="py-4 pl-4 pr-4 text-sm text-slate-300 font-medium">
                {tx.source.slice(0, 6)}...{tx.source.slice(-4)}
              </td>
              <td className="py-4 pl-4 pr-4 text-sm text-slate-300 font-medium">
                {tx.target.slice(0, 6)}...{tx.target.slice(-4)}
              </td>
              <td className="py-4 pl-4 pr-4 text-sm text-right font-mono text-emerald-400">
                {tx.amount.toFixed(4)}
              </td>
              <td className="py-4 pl-4 pr-4 text-center">
                {tx.isFlagged ? (
                  <span className="px-2 py-1 rounded-full bg-red-900/30 text-red-400 text-xs border border-red-800">
                    FLAGGED
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full bg-emerald-900/30 text-emerald-400 text-xs border border-emerald-800">
                    CLEAN
                  </span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
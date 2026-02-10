import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const NetworkGraph = ({ nodes, links, selectedWallet, setSelectedWallet, onSelectTransaction }) => {
  const width = 600;
  const height = 400;
  const radius = 300;

  const handleNodeClick = (nodeId) => {
    setSelectedWallet(nodeId);
  };

  const handleLinkClick = (link) => {
    onSelectTransaction(link.transaction);
  };

  const getNodePosition = (nodeId, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    const cx = width / 2 + radius * Math.cos(angle);
    const cy = height / 2 + radius * Math.sin(angle);
    return { cx, cy };
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl overflow-hidden border border-slate-800">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {links.map((link, i) => {
          const startNode = nodes.find(n => n.id === link.source);
          const endNode = nodes.find(n => n.id === link.target);
          const start = getNodePosition(startNode.id, nodes.indexOf(startNode));
          const end = getNodePosition(endNode.id, nodes.indexOf(endNode));

          const isSelected = selectedWallet === startNode.id || selectedWallet === endNode.id;

          return (
            <motion.line
              key={i}
              x1={start.cx}
              y1={start.cy}
              x2={end.cx}
              y2={end.cy}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isSelected ? 0.8 : 0.2 }}
              transition={{ duration: 1, delay: i * 0.05 }}
              stroke={isSelected ? '#22d3ee' : '#475569'}
              strokeWidth={link.transaction.amount * 0.1}
              className="cursor-pointer hover:stroke-cyan-400 hover:opacity-100 transition-colors"
              onClick={() => handleLinkClick(link.transaction)}
            >
              <title>{`${link.transaction.amount} | ${link.transaction.id}`}</title>
            </motion.line>
          );
        })}

        {nodes.map((node, i) => {
          const { cx, cy } = getNodePosition(node.id, i);
          const isSelected = selectedWallet === node.id;

          return (
            <g key={node.id} transform={`translate(${cx}, ${cy})`}>
              <motion.circle
                r={isSelected ? 35 : 25}
                stroke={node.isCritical ? '#ef4444' : isSelected ? '#22d3ee' : '#64748b'}
                strokeWidth={node.isCritical ? 3 : 2}
                fill={isSelected ? 'rgba(34, 211, 238, 0.1)' : 'rgba(30, 41, 59, 0.5)'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 10px currentColor)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                onClick={() => handleNodeClick(node.id)}
                className="cursor-pointer"
              />
              
              <text
                y={isSelected ? -45 : -35}
                textAnchor="middle"
                className={cn(
                  "text-[10px] font-bold fill-slate-300 pointer-events-none select-none",
                  node.isCritical ? "fill-red-400" : "fill-slate-400"
                )}
              >
                {node.id.slice(0, 5)}...
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
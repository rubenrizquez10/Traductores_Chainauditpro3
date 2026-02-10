from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
import time
import os
from datetime import datetime, timedelta
from collections import defaultdict, deque

# Configurar Flask para servir archivos estáticos del frontend
app = Flask(__name__, static_folder='../dist', static_url_path='')
CORS(app)

# Simulación de listas negras y datos de compliance
BLACKLISTED_ADDRESSES = {
    '0x112233': {'type': 'ransomware', 'severity': 'high', 'description': 'Known ransomware wallet'},
    '0x998877': {'type': 'mixer', 'severity': 'medium', 'description': 'Cryptocurrency mixer'},
    '0x556644': {'type': 'phishing', 'severity': 'high', 'description': 'Phishing scam wallet'}
}

# Sistema de alertas en memoria (en producción usarías Redis o base de datos)
ACTIVE_ALERTS = []
ALERT_THRESHOLDS = {
    'large_transaction': 100.0,
    'rapid_transactions': 5,  # más de 5 transacciones en 10 minutos
    'suspicious_pattern': 0.8  # score de riesgo > 0.8
}

def generate_blockchain_data():
    nodes = [
        { 'id': '0x1a2b3c', 'name': 'Exchange Hub', 'isCritical': True, 'type': 'exchange', 'region': 'US', 'reputation': 0.9 },
        { 'id': '0x4d5e6f', 'name': 'Whale Wallet', 'isCritical': True, 'type': 'wallet', 'region': 'Unknown', 'reputation': 0.7 },
        { 'id': '0x7g8h9i', 'name': 'DAO Treasury', 'isCritical': False, 'type': 'contract', 'region': 'Global', 'reputation': 0.95 },
        { 'id': '0xjklmno', 'name': 'Miner Pool A', 'isCritical': True, 'type': 'pool', 'region': 'China', 'reputation': 0.8 },
        { 'id': '0xpqrstu', 'name': 'Retail Wallet 1', 'isCritical': False, 'type': 'wallet', 'region': 'EU', 'reputation': 0.85 },
        { 'id': '0xvwxyz0', 'name': 'Token Project', 'isCritical': False, 'type': 'contract', 'region': 'Global', 'reputation': 0.75 },
        { 'id': '0x112233', 'name': 'Unknown Source', 'isCritical': True, 'type': 'unknown', 'region': 'Unknown', 'reputation': 0.1 },
        { 'id': '0x445566', 'name': 'Market Maker', 'isCritical': False, 'type': 'exchange', 'region': 'Singapore', 'reputation': 0.88 },
        { 'id': '0x998877', 'name': 'Suspicious Mixer', 'isCritical': True, 'type': 'mixer', 'region': 'Unknown', 'reputation': 0.2 },
        { 'id': '0x556644', 'name': 'Phishing Wallet', 'isCritical': True, 'type': 'phishing', 'region': 'Unknown', 'reputation': 0.05 }
    ]

    # Generar transacciones más realistas con patrones sospechosos
    base_time = datetime.now()
    transactions = []
    
    # Transacciones normales
    normal_txs = [
        { 'id': 'tx_001', 'source': '0x1a2b3c', 'target': '0x4d5e6f', 'amount': 125.5, 'timestamp': int((base_time - timedelta(hours=1)).timestamp()), 'isFlagged': False, 'gasPrice': 20, 'gasUsed': 21000 },
        { 'id': 'tx_002', 'source': '0x4d5e6f', 'target': '0x7g8h9i', 'amount': 89.2, 'timestamp': int((base_time - timedelta(minutes=50)).timestamp()), 'isFlagged': False, 'gasPrice': 22, 'gasUsed': 21000 },
        { 'id': 'tx_003', 'source': '0x7g8h9i', 'target': '0xjklmno', 'amount': 45.1, 'timestamp': int((base_time - timedelta(minutes=40)).timestamp()), 'isFlagged': False, 'gasPrice': 18, 'gasUsed': 21000 },
        { 'id': 'tx_004', 'source': '0xjklmno', 'target': '0xpqrstu', 'amount': 12.3, 'timestamp': int((base_time - timedelta(minutes=30)).timestamp()), 'isFlagged': False, 'gasPrice': 25, 'gasUsed': 21000 },
        { 'id': 'tx_005', 'source': '0xpqrstu', 'target': '0xvwxyz0', 'amount': 8.7, 'timestamp': int((base_time - timedelta(minutes=20)).timestamp()), 'isFlagged': False, 'gasPrice': 19, 'gasUsed': 21000 },
        { 'id': 'tx_006', 'source': '0xvwxyz0', 'target': '0x1a2b3c', 'amount': 25.0, 'timestamp': int((base_time - timedelta(minutes=10)).timestamp()), 'isFlagged': False, 'gasPrice': 21, 'gasUsed': 21000 }
    ]
    
    # Transacciones sospechosas - patrón de lavado de dinero
    suspicious_txs = [
        { 'id': 'tx_007', 'source': '0x112233', 'target': '0x998877', 'amount': 200.0, 'timestamp': int((base_time - timedelta(minutes=5)).timestamp()), 'isFlagged': True, 'gasPrice': 50, 'gasUsed': 21000 },
        { 'id': 'tx_008', 'source': '0x998877', 'target': '0x445566', 'amount': 195.0, 'timestamp': int((base_time - timedelta(minutes=4)).timestamp()), 'isFlagged': True, 'gasPrice': 45, 'gasUsed': 21000 },
        { 'id': 'tx_009', 'source': '0x445566', 'target': '0x556644', 'amount': 190.0, 'timestamp': int((base_time - timedelta(minutes=3)).timestamp()), 'isFlagged': True, 'gasPrice': 40, 'gasUsed': 21000 },
        { 'id': 'tx_010', 'source': '0x556644', 'target': '0x4d5e6f', 'amount': 185.0, 'timestamp': int((base_time - timedelta(minutes=2)).timestamp()), 'isFlagged': True, 'gasPrice': 35, 'gasUsed': 21000 }
    ]
    
    # Transacciones rápidas sospechosas (posible bot)
    rapid_txs = []
    for i in range(6):
        rapid_txs.append({
            'id': f'tx_rapid_{i+1}',
            'source': '0x4d5e6f',
            'target': '0x1a2b3c',
            'amount': round(random.uniform(0.1, 2.0), 4),
            'timestamp': int((base_time - timedelta(seconds=30 + i*10)).timestamp()),
            'isFlagged': True,
            'gasPrice': 100,  # Gas price muy alto
            'gasUsed': 21000
        })
    
    transactions = normal_txs + suspicious_txs + rapid_txs

    return {
        'nodes': nodes,
        'transactions': transactions,
        'links': [{'source': tx['source'], 'target': tx['target'], 'transaction': tx} for tx in transactions],
        'alerts': generate_alerts(transactions, nodes),
        'networkMetrics': calculate_network_metrics(nodes, transactions)
    }

def calculate_network_metrics(nodes, transactions):
    """Calcula métricas avanzadas de la red"""
    # Métricas básicas
    total_volume = sum(tx['amount'] for tx in transactions)
    avg_tx_value = total_volume / len(transactions) if transactions else 0
    
    # Análisis de flujo de dinero
    money_flow = defaultdict(float)
    for tx in transactions:
        money_flow[tx['source']] -= tx['amount']
        money_flow[tx['target']] += tx['amount']
    
    # Concentración de riqueza (Gini coefficient aproximado)
    balances = list(money_flow.values())
    gini_coeff = calculate_gini_coefficient(balances) if balances else 0
    
    # Centralidad básica (simulada)
    degree_centrality = {}
    for node in nodes:
        node_id = node['id']
        in_degree = sum(1 for tx in transactions if tx['target'] == node_id)
        out_degree = sum(1 for tx in transactions if tx['source'] == node_id)
        degree_centrality[node_id] = (in_degree + out_degree) / len(transactions) if transactions else 0
    
    return {
        'totalNodes': len(nodes),
        'totalEdges': len(transactions),
        'totalVolume': total_volume,
        'avgTransactionValue': avg_tx_value,
        'networkDensity': len(transactions) / (len(nodes) * (len(nodes) - 1)) if len(nodes) > 1 else 0,
        'clusteringCoefficient': random.uniform(0.1, 0.8),  # Simulado
        'giniCoefficient': gini_coeff,
        'topCentralNodes': get_top_central_nodes(degree_centrality, nodes, 3),
        'moneyFlowAnalysis': dict(money_flow),
        'suspiciousPatterns': detect_suspicious_patterns(transactions, nodes)
    }

def calculate_gini_coefficient(values):
    """Calcula el coeficiente de Gini para medir desigualdad"""
    if not values:
        return 0
    
    values = sorted([abs(v) for v in values])
    n = len(values)
    if n == 0:
        return 0
    
    cumsum = []
    total = 0
    for v in values:
        total += v
        cumsum.append(total)
    
    if cumsum[-1] == 0:
        return 0
        
    return (n + 1 - 2 * sum(cumsum) / cumsum[-1]) / n

def get_top_central_nodes(centrality_dict, nodes, top_n=3):
    """Obtiene los nodos más centrales"""
    sorted_nodes = sorted(centrality_dict.items(), key=lambda x: x[1], reverse=True)
    result = []
    for node_id, centrality in sorted_nodes[:top_n]:
        node_info = next((n for n in nodes if n['id'] == node_id), None)
        if node_info:
            result.append({
                'id': node_id,
                'name': node_info['name'],
                'centrality': round(centrality, 4),
                'type': node_info['type']
            })
    return result

def detect_suspicious_patterns(transactions, nodes):
    """Detecta patrones sospechosos en las transacciones"""
    patterns = {
        'rapidTransactions': [],
        'circularTransactions': [],
        'highValueTransactions': [],
        'mixerActivity': [],
        'blacklistedActivity': []
    }
    
    # Detectar transacciones rápidas
    tx_by_wallet = defaultdict(list)
    for tx in transactions:
        tx_by_wallet[tx['source']].append(tx)
    
    for wallet, wallet_txs in tx_by_wallet.items():
        if len(wallet_txs) >= ALERT_THRESHOLDS['rapid_transactions']:
            # Verificar si están en un período corto
            wallet_txs.sort(key=lambda x: x['timestamp'])
            time_window = 600  # 10 minutos
            for i in range(len(wallet_txs) - ALERT_THRESHOLDS['rapid_transactions'] + 1):
                window_txs = wallet_txs[i:i + ALERT_THRESHOLDS['rapid_transactions']]
                if window_txs[-1]['timestamp'] - window_txs[0]['timestamp'] <= time_window:
                    patterns['rapidTransactions'].append({
                        'wallet': wallet,
                        'count': len(window_txs),
                        'timeWindow': window_txs[-1]['timestamp'] - window_txs[0]['timestamp'],
                        'totalAmount': sum(tx['amount'] for tx in window_txs)
                    })
                    break
    
    # Detectar transacciones de alto valor
    for tx in transactions:
        if tx['amount'] >= ALERT_THRESHOLDS['large_transaction']:
            patterns['highValueTransactions'].append({
                'id': tx['id'],
                'amount': tx['amount'],
                'source': tx['source'],
                'target': tx['target']
            })
    
    # Detectar actividad con direcciones en lista negra
    for tx in transactions:
        if tx['source'] in BLACKLISTED_ADDRESSES or tx['target'] in BLACKLISTED_ADDRESSES:
            blacklisted_addr = tx['source'] if tx['source'] in BLACKLISTED_ADDRESSES else tx['target']
            patterns['blacklistedActivity'].append({
                'transaction': tx['id'],
                'blacklistedAddress': blacklisted_addr,
                'type': BLACKLISTED_ADDRESSES[blacklisted_addr]['type'],
                'severity': BLACKLISTED_ADDRESSES[blacklisted_addr]['severity']
            })
    
    # Detectar actividad de mixer
    mixer_nodes = [node['id'] for node in nodes if node['type'] == 'mixer']
    for tx in transactions:
        if tx['source'] in mixer_nodes or tx['target'] in mixer_nodes:
            patterns['mixerActivity'].append({
                'transaction': tx['id'],
                'mixerAddress': tx['source'] if tx['source'] in mixer_nodes else tx['target'],
                'amount': tx['amount']
            })
    
    return patterns

def generate_alerts(transactions, nodes):
    """Genera alertas basadas en patrones sospechosos"""
    alerts = []
    current_time = int(time.time())
    
    # Analizar patrones sospechosos
    patterns = detect_suspicious_patterns(transactions, nodes)
    
    # Generar alertas para transacciones rápidas
    for pattern in patterns['rapidTransactions']:
        alerts.append({
            'id': f"alert_{len(alerts)+1}",
            'type': 'rapid_transactions',
            'severity': 'high',
            'title': 'Actividad de Transacciones Rápidas Detectada',
            'description': f'Wallet {pattern["wallet"]} realizó {pattern["count"]} transacciones en {pattern["timeWindow"]} segundos',
            'timestamp': current_time,
            'data': pattern
        })
    
    # Generar alertas para transacciones de alto valor
    for pattern in patterns['highValueTransactions']:
        alerts.append({
            'id': f"alert_{len(alerts)+1}",
            'type': 'large_transaction',
            'severity': 'medium',
            'title': 'Transacción de Alto Valor',
            'description': f'Transacción de {pattern["amount"]} ETH detectada',
            'timestamp': current_time,
            'data': pattern
        })
    
    # Generar alertas para actividad en lista negra
    for pattern in patterns['blacklistedActivity']:
        alerts.append({
            'id': f"alert_{len(alerts)+1}",
            'type': 'blacklisted_activity',
            'severity': pattern['severity'],
            'title': 'Actividad con Dirección en Lista Negra',
            'description': f'Transacción detectada con dirección {pattern["type"]}: {pattern["blacklistedAddress"]}',
            'timestamp': current_time,
            'data': pattern
        })
    
    return alerts

@app.route('/api/analyze', methods=['POST'])
def analyze_transactions():
    data = request.json
    transactions = pd.DataFrame(data['transactions'])
    nodes = pd.DataFrame(data['nodes'])

    G = nx.DiGraph()
    
    for _, node in nodes.iterrows():
        G.add_node(node['id'], name=node['name'], type=node['type'], isCritical=node['isCritical'])
    
    for _, tx in transactions.iterrows():
        G.add_edge(tx['source'], tx['target'], amount=tx['amount'], timestamp=tx['timestamp'], id=tx['id'])

    degree_centrality = nx.degree_centrality(G)
    betweenness_centrality = nx.betweenness_centrality(G)
    closeness_centrality = nx.closeness_centrality(G)

    analysis = {
        'nodes': [],
        'transactions': [],
        'networkMetrics': {
            'totalNodes': len(G.nodes),
            'totalEdges': len(G.edges),
            'avgDegree': sum(dict(G.degree()).values()) / len(G.nodes),
            'clusteringCoefficient': nx.average_clustering(G.to_undirected())
        }
    }

    for node_id in G.nodes:
        node = G.nodes[node_id]
        analysis['nodes'].append({
            'id': node_id,
            'name': node['name'],
            'type': node['type'],
            'isCritical': node['isCritical'],
            'degreeCentrality': round(degree_centrality[node_id], 4),
            'betweennessCentrality': round(betweenness_centrality[node_id], 4),
            'closenessCentrality': round(closeness_centrality[node_id], 4),
            'totalIncoming': sum(1 for _ in G.predecessors(node_id)),
            'totalOutgoing': sum(1 for _ in G.successors(node_id)),
            'totalVolume': sum(data['amount'] for _, _, data in G.in_edges(node_id, data=True)) + sum(data['amount'] for _, _, data in G.out_edges(node_id, data=True))
        })

    for _, tx in transactions.iterrows():
        sender_degree = G.degree(tx['source'])
        receiver_degree = G.degree(tx['target'])
        tx['riskScore'] = 0

        if tx['isFlagged']:
            tx['riskScore'] += 50
        if sender_degree > 5 or receiver_degree > 5:
            tx['riskScore'] += 20
        if tx['amount'] > 100:
            tx['riskScore'] += 30

        analysis['transactions'].append(tx)

    return jsonify(analysis)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

@app.route('/api/crypto-prices', methods=['GET'])
def get_crypto_prices():
    """Simula precios de criptomonedas en tiempo real"""
    # En producción, esto se conectaría a APIs como CoinGecko o CoinMarketCap
    prices = {
        'ethereum': {
            'price': round(random.uniform(2000, 4000), 2),
            'change_24h': round(random.uniform(-10, 10), 2),
            'volume_24h': round(random.uniform(10000000, 50000000), 0),
            'market_cap': round(random.uniform(200000000000, 500000000000), 0)
        },
        'bitcoin': {
            'price': round(random.uniform(40000, 70000), 2),
            'change_24h': round(random.uniform(-8, 8), 2),
            'volume_24h': round(random.uniform(20000000, 80000000), 0),
            'market_cap': round(random.uniform(800000000000, 1500000000000), 0)
        }
    }
    return jsonify(prices)

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Obtiene alertas activas del sistema"""
    data = generate_blockchain_data()
    return jsonify(data['alerts'])

@app.route('/api/fund-tracing', methods=['POST'])
def trace_funds():
    """Rastrea el flujo de fondos desde una dirección específica"""
    request_data = request.json
    start_address = request_data.get('address')
    max_depth = request_data.get('depth', 3)
    
    data = generate_blockchain_data()
    transactions = data['transactions']
    
    # Construir grafo simple
    graph = defaultdict(list)
    for tx in transactions:
        graph[tx['source']].append({
            'target': tx['target'],
            'amount': tx['amount'],
            'transaction': tx
        })
    
    # Rastrear fondos usando BFS simple
    traced_paths = []
    visited = set()
    queue = deque([(start_address, [start_address], 0, 0)])  # (nodo, camino, profundidad, monto_total)
    
    while queue:
        current_node, path, depth, total_amount = queue.popleft()
        
        if depth >= max_depth:
            continue
            
        # Obtener transacciones salientes
        for edge in graph[current_node]:
            neighbor = edge['target']
            if neighbor not in visited or depth < 2:  # Permitir revisitar en profundidades bajas
                new_path = path + [neighbor]
                new_amount = total_amount + edge['amount']
                
                traced_paths.append({
                    'path': new_path,
                    'depth': depth + 1,
                    'totalAmount': new_amount,
                    'transactions': [edge['transaction']]
                })
                
                if depth + 1 < max_depth:
                    queue.append((neighbor, new_path, depth + 1, new_amount))
        
        visited.add(current_node)
    
    # Ordenar por monto total descendente
    traced_paths.sort(key=lambda x: x['totalAmount'], reverse=True)
    
    return jsonify({
        'startAddress': start_address,
        'tracedPaths': traced_paths[:10],  # Limitar a 10 caminos principales
        'summary': {
            'totalPaths': len(traced_paths),
            'maxAmount': traced_paths[0]['totalAmount'] if traced_paths else 0,
            'avgAmount': sum(p['totalAmount'] for p in traced_paths) / len(traced_paths) if traced_paths else 0
        }
    })

@app.route('/api/risk-analysis', methods=['POST'])
def analyze_risk():
    """Análisis de riesgo avanzado para una dirección específica"""
    request_data = request.json
    address = request_data.get('address')
    
    data = generate_blockchain_data()
    transactions = data['transactions']
    nodes = data['nodes']
    
    # Encontrar información del nodo
    node_info = next((n for n in nodes if n['id'] == address), None)
    if not node_info:
        return jsonify({'error': 'Address not found'}), 404
    
    # Calcular score de riesgo
    risk_score = 0
    risk_factors = []
    
    # Factor 1: Reputación del nodo
    reputation = node_info.get('reputation', 0.5)
    if reputation < 0.3:
        risk_score += 40
        risk_factors.append('Low reputation score')
    elif reputation < 0.6:
        risk_score += 20
        risk_factors.append('Medium reputation score')
    
    # Factor 2: Tipo de nodo
    if node_info['type'] in ['unknown', 'mixer', 'phishing']:
        risk_score += 50
        risk_factors.append(f'High-risk node type: {node_info["type"]}')
    
    # Factor 3: Lista negra
    if address in BLACKLISTED_ADDRESSES:
        risk_score += 60
        risk_factors.append(f'Blacklisted address: {BLACKLISTED_ADDRESSES[address]["type"]}')
    
    # Factor 4: Patrones de transacción
    addr_transactions = [tx for tx in transactions if tx['source'] == address or tx['target'] == address]
    
    # Transacciones de alto valor
    high_value_txs = [tx for tx in addr_transactions if tx['amount'] > ALERT_THRESHOLDS['large_transaction']]
    if high_value_txs:
        risk_score += len(high_value_txs) * 10
        risk_factors.append(f'{len(high_value_txs)} high-value transactions')
    
    # Transacciones flagged
    flagged_txs = [tx for tx in addr_transactions if tx.get('isFlagged', False)]
    if flagged_txs:
        risk_score += len(flagged_txs) * 15
        risk_factors.append(f'{len(flagged_txs)} flagged transactions')
    
    # Normalizar score (0-100)
    risk_score = min(risk_score, 100)
    
    # Determinar nivel de riesgo
    if risk_score >= 70:
        risk_level = 'HIGH'
        risk_color = '#ef4444'
    elif risk_score >= 40:
        risk_level = 'MEDIUM'
        risk_color = '#f59e0b'
    else:
        risk_level = 'LOW'
        risk_color = '#10b981'
    
    return jsonify({
        'address': address,
        'riskScore': risk_score,
        'riskLevel': risk_level,
        'riskColor': risk_color,
        'riskFactors': risk_factors,
        'nodeInfo': node_info,
        'transactionSummary': {
            'total': len(addr_transactions),
            'flagged': len(flagged_txs),
            'highValue': len(high_value_txs),
            'totalVolume': sum(tx['amount'] for tx in addr_transactions)
        },
        'recommendations': generate_risk_recommendations(risk_score, risk_factors)
    })

def generate_risk_recommendations(risk_score, risk_factors):
    """Genera recomendaciones basadas en el análisis de riesgo"""
    recommendations = []
    
    if risk_score >= 70:
        recommendations.extend([
            'Evitar cualquier transacción con esta dirección',
            'Reportar actividad sospechosa a las autoridades',
            'Implementar monitoreo continuo',
            'Considerar congelar fondos relacionados'
        ])
    elif risk_score >= 40:
        recommendations.extend([
            'Realizar due diligence adicional',
            'Implementar límites de transacción',
            'Monitorear actividad futura',
            'Requerir documentación adicional'
        ])
    else:
        recommendations.extend([
            'Continuar monitoreo rutinario',
            'Mantener registros de transacciones',
            'Revisar periódicamente'
        ])
    
    return recommendations

@app.route('/api/network-analysis', methods=['GET'])
def get_network_analysis():
    """Análisis avanzado de la red blockchain"""
    data = generate_blockchain_data()
    
    # Análisis temporal
    transactions = data['transactions']
    time_analysis = analyze_temporal_patterns(transactions)
    
    # Análisis geográfico
    geo_analysis = analyze_geographic_distribution(data['nodes'])
    
    # Análisis de flujo de dinero
    flow_analysis = analyze_money_flow(transactions)
    
    return jsonify({
        'temporalAnalysis': time_analysis,
        'geographicAnalysis': geo_analysis,
        'flowAnalysis': flow_analysis,
        'networkHealth': calculate_network_health(data)
    })

def analyze_temporal_patterns(transactions):
    """Analiza patrones temporales en las transacciones"""
    if not transactions:
        return {}
    
    # Agrupar por horas
    hourly_volume = defaultdict(float)
    hourly_count = defaultdict(int)
    
    for tx in transactions:
        hour = datetime.fromtimestamp(tx['timestamp']).hour
        hourly_volume[hour] += tx['amount']
        hourly_count[hour] += 1
    
    # Detectar horas pico
    peak_hours = sorted(hourly_volume.items(), key=lambda x: x[1], reverse=True)[:3]
    
    return {
        'hourlyVolume': dict(hourly_volume),
        'hourlyCount': dict(hourly_count),
        'peakHours': [{'hour': h, 'volume': v} for h, v in peak_hours],
        'totalTimespan': max(tx['timestamp'] for tx in transactions) - min(tx['timestamp'] for tx in transactions)
    }

def analyze_geographic_distribution(nodes):
    """Analiza la distribución geográfica de los nodos"""
    region_count = defaultdict(int)
    region_types = defaultdict(lambda: defaultdict(int))
    
    for node in nodes:
        region = node.get('region', 'Unknown')
        region_count[region] += 1
        region_types[region][node['type']] += 1
    
    return {
        'regionDistribution': dict(region_count),
        'regionTypes': {region: dict(types) for region, types in region_types.items()},
        'riskByRegion': calculate_risk_by_region(nodes)
    }

def calculate_risk_by_region(nodes):
    """Calcula el riesgo promedio por región"""
    region_risk = defaultdict(list)
    
    for node in nodes:
        region = node.get('region', 'Unknown')
        reputation = node.get('reputation', 0.5)
        risk = (1 - reputation) * 100  # Convertir reputación a riesgo
        region_risk[region].append(risk)
    
    return {
        region: {
            'avgRisk': sum(risks) / len(risks),
            'nodeCount': len(risks)
        }
        for region, risks in region_risk.items()
    }

def analyze_money_flow(transactions):
    """Analiza el flujo de dinero en la red"""
    inflow = defaultdict(float)
    outflow = defaultdict(float)
    
    for tx in transactions:
        outflow[tx['source']] += tx['amount']
        inflow[tx['target']] += tx['amount']
    
    # Calcular balance neto
    net_flow = {}
    all_addresses = set(inflow.keys()) | set(outflow.keys())
    
    for addr in all_addresses:
        net_flow[addr] = inflow[addr] - outflow[addr]
    
    # Identificar mayores receptores y emisores
    top_receivers = sorted(inflow.items(), key=lambda x: x[1], reverse=True)[:5]
    top_senders = sorted(outflow.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        'totalVolume': sum(tx['amount'] for tx in transactions),
        'topReceivers': [{'address': addr, 'amount': amount} for addr, amount in top_receivers],
        'topSenders': [{'address': addr, 'amount': amount} for addr, amount in top_senders],
        'netFlow': net_flow,
        'flowConcentration': calculate_flow_concentration(inflow, outflow)
    }

def calculate_flow_concentration(inflow, outflow):
    """Calcula la concentración del flujo de dinero"""
    total_inflow = sum(inflow.values())
    total_outflow = sum(outflow.values())
    
    if not inflow or not outflow:
        return 0
    
    # Calcular índice de concentración (similar a Herfindahl)
    inflow_concentration = sum((amount / total_inflow) ** 2 for amount in inflow.values())
    outflow_concentration = sum((amount / total_outflow) ** 2 for amount in outflow.values())
    
    return {
        'inflowConcentration': inflow_concentration,
        'outflowConcentration': outflow_concentration,
        'avgConcentration': (inflow_concentration + outflow_concentration) / 2
    }

def calculate_network_health(data):
    """Calcula la salud general de la red"""
    transactions = data['transactions']
    nodes = data['nodes']
    
    # Métricas de salud
    flagged_ratio = sum(1 for tx in transactions if tx.get('isFlagged', False)) / len(transactions)
    avg_reputation = sum(node.get('reputation', 0.5) for node in nodes) / len(nodes)
    
    # Score de salud (0-100, donde 100 es muy saludable)
    health_score = (1 - flagged_ratio) * 50 + avg_reputation * 50
    
    return {
        'healthScore': round(health_score, 2),
        'flaggedRatio': round(flagged_ratio * 100, 2),
        'avgReputation': round(avg_reputation, 3),
        'riskLevel': 'LOW' if health_score > 70 else 'MEDIUM' if health_score > 40 else 'HIGH'
    }

@app.route('/api/data', methods=['GET'])
def get_blockchain_data():
    data = generate_blockchain_data()
    return jsonify(data)

# Ruta para servir el frontend
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

# Ruta catch-all para el enrutamiento del frontend (SPA)
@app.route('/<path:path>')
def serve_static(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
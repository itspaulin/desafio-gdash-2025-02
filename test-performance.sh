#!/bin/bash

echo "🧪 Teste de Performance com Cache"
echo "=================================="
echo ""

# Request 1 - SEM cache (lento)
echo "📡 Request 1 - MISS (chamando IA)..."
time curl -s http://localhost:3000/weather/insights?days=1 | jq -r '.data.generatedAt'
echo ""

# Request 2 - COM cache (rápido)
echo "⚡ Request 2 - HIT (do cache)..."
time curl -s http://localhost:3000/weather/insights?days=1 | jq -r '.data.generatedAt'
echo ""

# Request 3 - COM cache (rápido)
echo "⚡ Request 3 - HIT (do cache)..."
time curl -s http://localhost:3000/weather/insights?days=1 | jq -r '.data.generatedAt'
echo ""

# Ver stats
echo "📊 Estatísticas do Cache:"
curl -s http://localhost:3000/cache/stats | jq
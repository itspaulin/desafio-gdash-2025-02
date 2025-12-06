#!/bin/bash

echo "🧪 Testando Cache de Insights de IA"
echo "===================================="
echo ""

echo "📡 Request 1 (SEM cache - vai chamar IA)..."
time curl -s http://localhost:3000/weather/insights?days=1 > /dev/null
echo ""

echo "⚡ Request 2 (COM cache - instantâneo)..."
time curl -s http://localhost:3000/weather/insights?days=1 > /dev/null
echo ""

echo "⚡ Request 3 (COM cache - instantâneo)..."
time curl -s http://localhost:3000/weather/insights?days=1 > /dev/null
echo ""

echo "✅ Teste concluído!"
echo ""
echo "📊 Estatísticas esperadas:"
echo "   - Request 1: ~2-3 segundos (chamada real de IA)"
echo "   - Request 2: ~50-100ms (cache Redis)"
echo "   - Request 3: ~50-100ms (cache Redis)"
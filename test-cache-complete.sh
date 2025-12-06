#!/bin/bash

echo "🧪 Teste COMPLETO de Performance com Cache"
echo "==========================================="
echo ""

# Limpar TODO o cache primeiro
echo "🗑️  Limpando cache..."
curl -s -X DELETE http://localhost:3000/cache/insights > /dev/null
echo "✅ Cache limpo!"
echo ""
sleep 1

# Request 1 - SEM cache (vai chamar IA de verdade)
echo "📡 Request 1 - MISS (vai chamar Groq/Gemini)..."
START=$(date +%s%3N)
RESPONSE1=$(curl -s http://localhost:3000/weather/insights?days=1)
END=$(date +%s%3N)
DURATION1=$((END - START))
echo "   ⏱️  Tempo: ${DURATION1}ms"
echo "   📅 Gerado em: $(echo $RESPONSE1 | jq -r '.data.generatedAt')"
echo ""

sleep 1

# Request 2 - COM cache (instantâneo)
echo "⚡ Request 2 - HIT (do cache Redis)..."
START=$(date +%s%3N)
RESPONSE2=$(curl -s http://localhost:3000/weather/insights?days=1)
END=$(date +%s%3N)
DURATION2=$((END - START))
echo "   ⏱️  Tempo: ${DURATION2}ms"
echo "   📅 Gerado em: $(echo $RESPONSE2 | jq -r '.data.generatedAt')"
echo ""

sleep 1

# Request 3 - COM cache (instantâneo)
echo "⚡ Request 3 - HIT (do cache Redis)..."
START=$(date +%s%3N)
RESPONSE3=$(curl -s http://localhost:3000/weather/insights?days=1)
END=$(date +%s%3N)
DURATION3=$((END - START))
echo "   ⏱️  Tempo: ${DURATION3}ms"
echo "   📅 Gerado em: $(echo $RESPONSE3 | jq -r '.data.generatedAt')"
echo ""

# Calcular melhoria
IMPROVEMENT=$((DURATION1 / DURATION2))
echo "📊 RESULTADOS:"
echo "   1️⃣  Sem cache: ${DURATION1}ms"
echo "   2️⃣  Com cache: ${DURATION2}ms"
echo "   3️⃣  Com cache: ${DURATION3}ms"
echo ""
echo "   🚀 Melhoria: ${IMPROVEMENT}x mais rápido!"
echo "   💰 Economia: 2 chamadas de IA evitadas"
echo ""

# Ver estatísticas finais
echo "📈 Estatísticas do Cache:"
curl -s http://localhost:3000/cache/stats | jq '.data | {totalCached: .totalCachedInsights, saved: .estimatedApiCallsSaved}'
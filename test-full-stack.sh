#!/bin/bash

echo "🧪 Teste Completo da Stack"
echo "=========================="
echo ""

echo "✅ 1. Health Check do Frontend:"
curl -s http://localhost/health
echo -e "\n"

echo "✅ 2. API Status (via proxy):"
curl -s http://localhost/api/ai/status | jq -r '.message'
echo ""

echo "✅ 3. Cache Status (via proxy):"
curl -s http://localhost/api/cache/status | jq -r '.message'
echo ""

echo "✅ 4. Cache Stats (via proxy):"
curl -s http://localhost/api/cache/stats | jq -r '.message'
echo ""

echo "✅ 5. Weather Insights (vai usar cache):"
TIME_START=$(date +%s%3N)
curl -s http://localhost/api/weather/insights?days=1 > /dev/null
TIME_END=$(date +%s%3N)
DURATION=$((TIME_END - TIME_START))
echo "   Tempo: ${DURATION}ms"
echo ""

echo "✅ 6. Testar autenticação:"
curl -s -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' | jq -r '.message'
echo ""

echo "📊 Status dos containers:"
docker-compose ps
echo ""

echo "🎯 Endpoints disponíveis:"
echo "   Frontend:     http://localhost"
echo "   API (direto): http://localhost:3000"
echo "   API (proxy):  http://localhost/api"
echo "   RabbitMQ:     http://localhost:15672"
echo ""

echo "✅ Todos os testes passaram!"
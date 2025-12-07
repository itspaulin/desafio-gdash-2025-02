const API_URL = "http://localhost:3000";

// Função para fazer login e obter o token
async function login() {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@example.com",
        password: "123456",
      }),
    });

    if (!response.ok) {
      throw new Error("Falha no login");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("❌ Erro ao fazer login:", error.message);
    throw error;
  }
}

async function generateWeatherData() {
  const now = new Date();
  const logs = [];

  // Gerar 30 dias de dados (4 registros por dia = 120 registros)
  for (let day = 0; day < 30; day++) {
    for (let hour = 0; hour < 24; hour += 6) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(hour, 0, 0, 0);

      const temperature = Math.round((22 + Math.random() * 10) * 10) / 10;
      const humidity = Math.round(60 + Math.random() * 30);
      const windSpeed = Math.round((5 + Math.random() * 20) * 10) / 10;
      const rainProb = Math.round(Math.random() * 100);
      const conditions = [
        { condition: "clear", code: 0 },
        { condition: "cloudy", code: 2 },
        { condition: "rainy", code: 61 },
      ];
      const weather = conditions[Math.floor(Math.random() * conditions.length)];

      // Formato COMPLETO com lat/long como STRINGS
      const log = {
        timestamp: date.toISOString(),
        location: {
          city: "Natal",
          state: "RN",
          country: "BR",
          latitude: "-5.7945", // ✅ STRING
          longitude: "-35.211", // ✅ STRING
        },
        weather: {
          temperature: temperature,
          temperature_unit: "celsius",
          humidity: humidity,
          humidity_unit: "percent",
          wind_speed: windSpeed,
          wind_speed_unit: "km/h",
          condition: weather.condition,
          weather_code: weather.code,
          precipitation: weather.condition === "rainy" ? Math.random() * 10 : 0,
          precipitation_unit: "mm",
          rain_probability: rainProb,
        },
      };

      logs.push(log);
    }
  }

  return logs;
}

async function populateDatabase() {
  console.log("🔐 Fazendo login...");
  let token;

  try {
    token = await login();
    console.log("✅ Login realizado com sucesso!\n");
  } catch (error) {
    console.error(
      "❌ Não foi possível fazer login. Verifique suas credenciais."
    );
    return;
  }

  console.log("🌤️  Gerando dados meteorológicos...");

  const logs = await generateWeatherData();
  console.log(`📊 Total de registros gerados: ${logs.length}\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];

    try {
      const response = await fetch(`${API_URL}/weather/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(log),
      });

      if (response.ok) {
        success++;
        if (success % 10 === 0) {
          console.log(`✅ ${success}/${logs.length} registros inseridos...`);
        }
      } else {
        failed++;
        const errorData = await response.text();

        if (failed === 1) {
          console.error(`\n❌ Primeiro erro (registro ${i + 1}):`);
          console.error(`Payload enviado:`, JSON.stringify(log, null, 2));
          console.error(`Resposta:`, errorData);
          console.error("");
        }
      }
    } catch (error) {
      failed++;

      if (failed === 1) {
        console.error("❌ Erro ao inserir registro:", error.message);
      }
    }

    // Pequeno delay para não sobrecarregar
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("\n📊 Resumo:");
  console.log(`✅ Sucesso: ${success}`);
  console.log(`❌ Falhas: ${failed}`);

  if (success > 0) {
    console.log("\n🎉 Dados inseridos com sucesso!");
    console.log(
      "💡 Agora atualize o dashboard para ver os filtros funcionando!"
    );
  } else if (failed > 0) {
    console.log("\n⚠️  Verifique o formato esperado pelo backend acima.");
  }
}

populateDatabase().catch(console.error);

# Weather Dashboard Challenge - GDASH

Sistema full-stack de coleta, processamento e visualização de dados climáticos com insights gerados por IA.

# Video apresentação: [Assista aqui no YouTube](https://youtu.be/HPiuFg9Ggz4?si=P9f6myV6hHKC5z2n)

## Visão Geral

Este projeto implementa um pipeline completo de dados climáticos:

1. **Python** coleta dados meteorológicos da API Open-Meteo
2. **RabbitMQ** gerencia a fila de mensagens
3. **Go Worker** processa as mensagens e envia para a API
4. **NestJS API** armazena dados no MongoDB e gera insights com IA
5. **React Frontend** exibe dashboard interativo com visualizações

## Stack Tecnológica

### Backend

- **API**: NestJS (TypeScript)
- **Banco de dados**: MongoDB
- **Worker**: Go
- **Fila**: RabbitMQ
- **Coleta**: Python

### Frontend

- **Framework**: React + Vite
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Gráficos**: Recharts

### Infraestrutura

- **Containerização**: Docker + Docker Compose

## Arquitetura

O sistema foi projetado seguindo princípios de Clean Architecture e Domain-Driven Design (DDD), com separação clara de responsabilidades entre camadas.

### Diagrama de Fluxo

```
┌─────────────────┐
│  Open-Meteo API │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    COLETA DE DADOS                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Python Weather Collector                            │   │
│  │  - Consulta API a cada 1 hora                        │   │
│  │  - Normaliza dados climáticos                        │   │
│  │  - Valida e formata payload JSON                     │   │
│  └───────────────────────┬──────────────────────────────┘   │
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │   RabbitMQ     │
                    │  Message Queue │
                    └────────┬───────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                 PROCESSAMENTO DE DADOS                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Go Worker                                           │   │
│  │  - Consome fila RabbitMQ                             │   │
│  │  - Valida estrutura dos dados                        │   │
│  │  - Retry logic (3 tentativas)                        │   │
│  │  - Envia para API via HTTP POST                      │   │
│  └───────────────────────┬──────────────────────────────┘   │
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND API                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  NestJS API (TypeScript)                             │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Domain Layer (Clean Architecture)            │  │   │
│  │  │  - Entities: User, WeatherLog                  │  │   │
│  │  │  - Use Cases: Business Logic                   │  │   │
│  │  │  - Repositories: Interfaces                    │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Infrastructure Layer                          │  │   │
│  │  │  - MongoDB (Mongoose)                          │  │   │
│  │  │  - Redis Cache                                 │  │   │
│  │  │  - AI Providers (Gemini, Groq)                 │  │   │
│  │  │  - JWT Authentication                          │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  HTTP Layer                                    │  │   │
│  │  │  - Controllers                                 │  │   │
│  │  │  - Guards (Auth)                               │  │   │
│  │  │  - Pipes (Validation)                          │  │   │
│  │  │  - Presenters                                  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └───────────────────────┬──────────────────────────────┘   │
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │    MongoDB     │
                    │  (Data Store)  │
                    └────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React + Vite + TypeScript                           │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Pages                                         │  │   │
│  │  │  - Login                                       │  │   │
│  │  │  - Dashboard Simples                           │  │   │
│  │  │  - Dashboard Avançado                          │  │   │
│  │  │  - Gestão de Usuários                          │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Components (shadcn/ui + Tailwind)            │  │   │
│  │  │  - WeatherCards, Charts, Filters              │  │   │
│  │  │  - UserDialog, DeleteDialog                    │  │   │
│  │  │  - Sidebar, ThemeToggle                        │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  State Management                              │  │   │
│  │  │  - Zustand (Auth Store)                        │  │   │
│  │  │  - Context API (Theme)                         │  │   │
│  │  │  - Custom Hooks                                │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. O serviço Python consulta a API Open-Meteo periodicamente
2. Dados climáticos são enviados para a fila RabbitMQ
3. Worker Go consome mensagens, valida e envia para a API NestJS
4. API armazena no MongoDB e gera insights usando IA (Gemini/Groq)
5. Frontend consome a API e exibe dashboard interativo

### Clean Architecture e DDD no NestJS

O projeto adota Clean Architecture e Domain-Driven Design (DDD) para garantir manutenibilidade, testabilidade e escalabilidade. Esta escolha arquitetural traz benefícios significativos:

**Por que Clean Architecture?**

A Clean Architecture promove independência de frameworks, bancos de dados e interfaces externas. No contexto deste projeto:

- **Testabilidade**: As regras de negócio (use cases) podem ser testadas sem dependências externas. Por exemplo, podemos testar o cálculo do índice de conforto térmico sem precisar de MongoDB ou APIs de IA.

- **Flexibilidade tecnológica**: Se precisarmos trocar MongoDB por PostgreSQL ou Gemini por OpenAI, apenas a camada de infraestrutura é alterada. O domínio permanece intacto.

- **Separação de responsabilidades**: Controllers apenas recebem requisições HTTP, Use Cases contêm lógica de negócio, e Repositories abstraem persistência. Cada camada tem um propósito claro.

**Por que DDD?**

Domain-Driven Design alinha o código com o domínio do negócio (dados climáticos e insights meteorológicos):

- **Entidades ricas**: `WeatherLog` e `User` não são apenas estruturas de dados, mas objetos com comportamento e validações próprias.

- **Value Objects**: Encapsulam conceitos do domínio como identificadores únicos, garantindo imutabilidade e validação.

- **Linguagem ubíqua**: Termos como "comfort index", "weather trends" e "climate alerts" são consistentes entre código, documentação e comunicação da equipe.

- **Bounded Contexts**: Separação clara entre contextos de autenticação, análise climática e insights de IA.

**Estrutura implementada:**

```
domain/
├── enterprise/          # Entidades de negócio (User, WeatherLog)
└── application/         # Casos de uso e contratos
    ├── use-cases/       # Lógica de negócio pura
    ├── repositories/    # Interfaces (não implementações)
    └── providers/       # Contratos de serviços externos

infra/
├── database/            # Implementações MongoDB
├── http/                # Controllers, Guards, Pipes
└── providers/           # Implementações AI, Hash, JWT
```

Esta arquitetura permite que o projeto cresça de forma sustentável, facilitando a adição de novas funcionalidades (como previsões meteorológicas ou múltiplas localizações) sem comprometer o código existente.

## Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- Python 3.10+ (para desenvolvimento local)
- Go 1.21+ (para desenvolvimento local)

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# Application
NODE_ENV=development
PORT=3333

# MongoDB
MONGODB_URI=mongodb://root:example@localhost:27017/weather?authSource=admin

# AI Providers
GROQ_API_KEY=your-groq-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin User
ADMIN_NAME=Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=123456

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_QUEUE=weather_data

# Worker Go
API_URL=http://localhost:3000/api/weather/logs
API_TIMEOUT=30
MAX_RETRIES=3
RETRY_DELAY_SECONDS=2
```

### 2. Obter API Keys

- **Gemini**: https://makersuite.google.com/app/apikey
- **Groq**: https://console.groq.com/keys

## Execução

### Usando Docker Compose (Recomendado)

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### Acessar a Aplicação

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **Swagger/Docs**: http://localhost:3000/api
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

### Usuário Padrão

```
Email: admin@example.com
Senha: 123456
```

Estas credenciais são configuráveis através das variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD` no arquivo `.env`.

## Desenvolvimento Local

### API (NestJS)

```bash
cd api
npm install
npm run start:dev
```

### Frontend (React)

```bash
cd app
npm install
npm run dev
```

### Weather Collector (Python)

```bash
cd weather-collector
pip install -r requirements.txt
python src/main.py
```

### Worker (Go)

```bash
cd worker-go
go mod download
go run cmd/worker/main.go
```

## Estrutura do Projeto

### API (NestJS)

```
api/
├── src/
│   ├── core/              # Arquitetura base (Either, Entity, Errors)
│   ├── domain/            # Regras de negócio
│   │   ├── application/   # Use cases, repositories, providers
│   │   └── enterprise/    # Entidades de domínio
│   └── infra/             # Implementações
│       ├── database/      # MongoDB, schemas, mappers
│       ├── http/          # Controllers, guards, pipes
│       └── providers/     # Implementações de AI, hash, token
```

### Frontend (React)

```
app/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   ├── contexts/          # Context API (Theme)
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Chamadas à API
│   ├── stores/            # Zustand stores
│   └── types/             # TypeScript types
```

### Weather Collector (Python)

```
weather-collector/
└── src/
    ├── main.py            # Orquestração principal
    ├── weather_api.py     # Integração Open-Meteo
    ├── queue_sender.py    # Envio para RabbitMQ
    └── config.py          # Configurações
```

### Worker (Go)

```
worker-go/
├── cmd/worker/            # Entrypoint
└── internal/
    ├── config/            # Configurações
    ├── consumer/          # Consumidor RabbitMQ
    └── models/            # Estruturas de dados
```

## Funcionalidades

### Dashboard Simples

- Visualização de dados climáticos em tempo real
- Cards com métricas principais (Temperatura, Umidade, Vento, Condição)
- Insights de IA gerados automaticamente
- Recomendações personalizadas baseadas nas condições climáticas
- Gráfico de temperatura ao longo do tempo
- Gráfico de probabilidade de chuva e umidade
- Estatísticas do período (média, mínima, máxima)
- Índice de conforto térmico com recomendações
- Exportação de dados em CSV e XLSX
- Botão de atualização manual

### Dashboard Avançado

Sistema completo de análise com múltiplas visualizações:

- Filtros avançados por período, horário e condição climática
- Visualização em Grid ou Compacto
- Gráficos interativos:
  - Temperatura e Umidade (linha dupla)
  - Vento e Precipitação (área)
  - Comparativo Geral (barras)
  - Distribuição de Métricas (pizza)
  - Análise Multivariável (scatter)
- Estatísticas detalhadas do período filtrado
- Resumo dos filtros aplicados
- Indicador de dados exibidos

### Insights de IA

O sistema utiliza IA (Gemini/Groq) para gerar automaticamente:

- Análise contextual do clima atual
- Classificação do dia (frio, agradável, quente, muito quente)
- Índice de conforto térmico (0-100) com classificação
- Detecção de tendências (temperatura subindo/caindo)
- Alertas personalizados (calor extremo, chuva iminente, frio intenso)
- Recomendações práticas baseadas nas condições
- Resumos em linguagem natural
- Cache inteligente para otimizar performance

### Gestão de Usuários

- Tela de login com validação
- Autenticação JWT
- CRUD completo de usuários
- Controle de acesso com rotas protegidas
- Perfis de usuário com data de criação
- Interface para criar, editar e deletar usuários
- Indicador de força de senha

### Recursos Adicionais

- Dark Mode (alternância entre tema claro/escuro)
- Design responsivo para mobile e desktop
- Sidebar com navegação intuitiva
- Feedback visual com toasts
- Loading states em todas as operações
- Tratamento de erros consistente
- Script de população de dados para testes (test-populate-weather.js)

## Endpoints da API

### Autenticação

```
POST /api/auth/login                    # Login
```

### Usuários

```
GET    /api/users                       # Listar usuários
POST   /api/users                       # Criar usuário
GET    /api/users/:id                   # Buscar usuário por ID
PUT    /api/users/:id                   # Atualizar usuário
DELETE /api/users/:id                   # Deletar usuário
```

### Dados Climáticos

```
GET  /api/weather/logs                  # Listar registros climáticos
POST /api/weather/logs                  # Criar registro (usado pelo worker Go)
GET  /api/weather/dashboard             # Dados completos do dashboard
GET  /api/weather/export/csv            # Exportar dados em CSV
GET  /api/weather/export/xlsx           # Exportar dados em XLSX
```

### Analytics e Insights

```
GET  /api/weather/insights              # Obter insights de IA (cached)
POST /api/weather/insights              # Gerar novos insights
GET  /api/weather/statistics            # Estatísticas gerais
GET  /api/weather/trends                # Tendências de temperatura
GET  /api/weather/alerts                # Alertas meteorológicos
GET  /api/weather/classify/:id          # Classificar dia específico
GET  /api/weather/classify              # Classificar últimas 24h
GET  /api/weather/comfort/:id           # Índice de conforto específico
GET  /api/weather/comfort               # Índice de conforto últimas 24h
GET  /api/weather/summary               # Resumo em texto natural
```

### Cache e Monitoramento

```
GET    /api/cache/status                # Status do cache Redis
DELETE /api/cache/insights              # Limpar cache de insights
DELETE /api/cache/insights/:location    # Limpar cache por localização
GET    /api/cache/stats                 # Estatísticas do cache
GET    /api/ai-providers/status         # Status dos providers de IA
```

## Tecnologias e Bibliotecas

### Backend (NestJS)

- `@nestjs/mongoose`: ODM MongoDB
- `@nestjs/jwt`: Autenticação JWT
- `bcrypt`: Hash de senhas
- `@google/generative-ai`: Gemini AI
- `groq-sdk`: Groq AI
- `exceljs`: Geração de XLSX
- `zod`: Validação de schemas

### Frontend (React)

- `zustand`: State management
- `axios`: HTTP client
- `recharts`: Gráficos
- `date-fns`: Manipulação de datas
- `react-router-dom`: Roteamento
- `lucide-react`: Ícones

### Python

- `requests`: HTTP client
- `pika`: Cliente RabbitMQ
- `python-dotenv`: Variáveis de ambiente

### Go

- `github.com/rabbitmq/amqp091-go`: Cliente RabbitMQ
- `encoding/json`: JSON parsing
- `net/http`: HTTP client

## Desafios e Dificuldades

Durante o desenvolvimento deste projeto, enfrentamos alguns desafios técnicos relevantes:

### 1. Integração entre Múltiplas Linguagens

Coordenar a comunicação entre Python, Go, NestJS e React exigiu atenção especial aos contratos de dados. A serialização JSON entre os serviços precisou ser cuidadosamente validada, principalmente na transição Python → RabbitMQ → Go → NestJS, onde cada linguagem possui suas particularidades de tipagem e estruturas de dados.

### 2. Gerenciamento de Rate Limits das APIs de IA

As APIs de IA (Gemini e Groq) possuem rate limits que impactaram o desenvolvimento. Foi necessário implementar um sistema de cache com Redis e uma estratégia de fallback entre providers para garantir que os insights estivessem sempre disponíveis, mesmo quando um dos serviços atingisse seu limite.

### 3. Sincronização de Estado e Tempo Real

Manter o dashboard atualizado com dados frescos enquanto gerenciava múltiplas fontes de dados (MongoDB, cache Redis, APIs de IA) apresentou complexidade. A implementação de estratégias de polling, cache invalidation e loading states foi crucial para garantir uma experiência de usuário fluida sem sobrecarregar os serviços.

```bash
# API
cd api
npm run test

# Frontend
cd app
npm run test
```

## Troubleshooting

### RabbitMQ não conecta

Aguarde alguns segundos após o `docker-compose up` para o RabbitMQ inicializar completamente.

### MongoDB não conecta

Verifique se o container do MongoDB está rodando:

```bash
docker-compose ps
```

### Worker Go não processa mensagens

Verifique os logs:

```bash
docker-compose logs worker-go
```

### Frontend não carrega dados

1. Verifique se a API está rodando
2. Verifique se há dados no MongoDB
3. Execute o script de população para testes:

```bash
node test-populate-weather.js
```

Este script cria dados de exemplo para popular o dashboard e facilitar os testes.

## População de Dados para Testes

Para facilitar o desenvolvimento e demonstração, você pode popular o banco com dados de exemplo:

```bash
# Na raiz do projeto
node test-populate-weather.js
```

Este script cria registros climáticos simulados que permitem visualizar todas as funcionalidades do dashboard imediatamente.

## Melhorias Futuras

Com mais tempo de desenvolvimento, as seguintes funcionalidades poderiam ser implementadas:

### Funcionalidades

- Sistema de notificações em tempo real (WebSocket)
- Previsões meteorológicas para os próximos dias
- Suporte a múltiplas localizações/cidades
- Comparação entre diferentes períodos
- Histórico de alertas
- Relatórios personalizados em PDF
- Painel administrativo avançado
- Sistema de permissões por role (admin, viewer, editor)
- Logs de auditoria de ações dos usuários

### Análises e IA

- Modelos preditivos com Machine Learning
- Correlação entre variáveis climáticas
- Análise de padrões sazonais
- Recomendações personalizadas por perfil de usuário
- Integração com mais providers de IA (OpenAI, Claude)
- Fine-tuning de modelos específicos para dados climáticos

### Integrações

- API pública paginada (PokéAPI, SWAPI) conforme desafio opcional
- Integração com APIs de alertas meteorológicos oficiais
- Webhook para envio de alertas críticos
- Integração com serviços de SMS/Email para notificações
- Export para Google Sheets/Excel Online

### Performance e Infraestrutura

- Cache distribuído com Redis Cluster
- CDN para assets estáticos
- Rate limiting por usuário/IP
- Compressão de respostas
- Lazy loading de componentes
- Service Workers para offline-first
- Otimização de queries MongoDB com índices compostos

### Testes e Qualidade

- Testes unitários com Jest (coverage > 80%)
- Testes de integração
- Testes E2E com Playwright/Cypress
- Testes de carga com k6
- Monitoramento com Prometheus + Grafana
- Análise de código com SonarQube

### DevOps

- CI/CD com GitHub Actions
- Deploy automatizado em Railway/Render/AWS
- Ambiente de staging
- Backup automatizado do MongoDB
- Documentação automática com Swagger/OpenAPI
- Logs centralizados com ELK Stack
- Health checks e readiness probes

### Mobile

- Aplicativo mobile com React Native
- Push notifications
- Modo offline com sincronização
- Widgets para home screen
- Cache com Redis para insights de IA

## Licença

Este projeto foi desenvolvido como parte do desafio técnico da GDASH.

## Contato

Para dúvidas sobre o projeto, entre em contato através do Pull Request ou LinkedIn da GDASH.

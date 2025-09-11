# Market Science API - Estrutura Melhorada

## 📁 Estrutura da Codebase

```
src/
├── config/
│   └── groups.config.ts          # Configuração centralizada dos grupos de dados
├── interfaces/
│   └── Destination.ts             # Interfaces e tipos TypeScript
├── services/
│   ├── fetcher.service.ts         # Serviço para fazer requisições HTTP
│   └── market-data-scheduler.service.ts  # Cronjob para execução automática
├── models/
│   └── GroupList.ts               # Modelo para gerenciar listas de grupos
└── fetchers/
    └── search.ts                  # Fetcher original (pode ser removido)
```

## 🔧 Melhorias Implementadas

### 1. **Configuração Centralizada**
- **Arquivo**: `src/config/groups.config.ts`
- **Propósito**: Define todos os grupos de dados de mercado em um local centralizado
- **Estrutura**: Cada grupo tem fontes primárias e de fallback

### 2. **Serviço de Fetching Robusto**
- **Arquivo**: `src/services/fetcher.service.ts`
- **Funcionalidades**:
  - Logging detalhado
  - Tratamento de erros aprimorado
  - Retry automático (3 tentativas)
  - Retorno estruturado com metadados

### 3. **Scheduler Automatizado**
- **Arquivo**: `src/services/market-data-scheduler.service.ts`
- **Funcionalidades**:
  - Execução a cada 5 minutos
  - Fallback automático entre fontes
  - Health check a cada hora
  - Processamento paralelo de grupos

### 4. **Tipagem Melhorada**
- **Interface `FetchResult`**: Estrutura padronizada para resultados
- **Logging estruturado**: Melhor rastreabilidade

## 🚀 Como Usar

### 1. Configurar Grupos de Dados
Edite `src/config/groups.config.ts`:

```typescript
export const MARKET_DATA_GROUPS: Record<string, SourceGroup> = {
  bitcoin: {
    primary: [
      {
        url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
        headers: { 'Accept': 'application/json' }
      }
    ],
    fallback: [
      {
        url: 'https://api.alternative.me/v2/ticker/bitcoin/',
        token: 'Bearer YOUR_API_KEY'
      }
    ]
  }
};
```

### 2. Executar o Scheduler
O scheduler executa automaticamente quando a aplicação inicia. Para controle manual:

```typescript
// Injetar o serviço em qualquer controller/service
constructor(private readonly scheduler: MarketDataScheduler) {}

// Executar manualmente
await this.scheduler.fetchAllMarketData();
```

### 3. Usar o Fetcher Diretamente
```typescript
constructor(private readonly fetcherService: FetcherService) {}

async getData() {
  const sources = MARKET_DATA_GROUPS.dolar.primary;
  const result = await this.fetcherService.fetchFromSources('dolar', sources);
  return result;
}
```

## 📋 Próximos Passos Recomendados

1. **Persistência de Dados**: Adicionar database (MongoDB/PostgreSQL)
2. **Cache**: Implementar Redis para cache de dados
3. **Monitoramento**: Adicionar métricas e alertas
4. **Configuração Dinâmica**: Permitir configuração via environment variables
5. **API Endpoints**: Criar endpoints REST para consultar dados
6. **Rate Limiting**: Implementar controle de taxa para APIs externas
7. **Testes**: Adicionar testes unitários e de integração

## 🔄 Fluxo de Execução

1. **Scheduler** executa a cada 5 minutos
2. Para cada grupo configurado:
   - Tenta fontes **primárias** primeiro
   - Se falhar, usa fontes de **fallback**
   - Registra logs detalhados
3. Processa e armazena dados coletados
4. Executa health check a cada hora

## ⚙️ Configurações

- **Intervalo de execução**: Modificar em `@Cron(CronExpression.EVERY_5_MINUTES)`
- **Retry**: Configurado para 3 tentativas por fonte
- **Timeout**: Usa configuração padrão do Axios
- **Logging**: Level configurável via NestJS

Esta estrutura é muito mais robusta, escalável e maintível que a versão anterior!

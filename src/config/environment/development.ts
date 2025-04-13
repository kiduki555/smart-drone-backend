export const developmentConfig = {
  app: {
    port: 3000,
    host: 'localhost',
    globalPrefix: 'api',
  },
  database: {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'gcs_dev',
  },
  security: {
    jwtSecret: 'dev-secret-key',
    jwtExpiresIn: '1d',
    refreshTokenExpiresIn: '7d',
  },
  websocket: {
    corsOrigin: 'http://localhost:3001',
    namespace: 'mcp',
  },
  mcp: {
    autoExecuteRiskThreshold: 0.7,
    contextCacheTtl: 30000,
    decisionHistoryLimit: 100,
    confirmationTimeout: 30000,
  },
} as const; 
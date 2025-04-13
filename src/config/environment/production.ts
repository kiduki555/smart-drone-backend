export const productionConfig = {
  app: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    globalPrefix: 'api',
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  security: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  websocket: {
    corsOrigin: process.env.WS_CORS_ORIGIN || '*',
    namespace: 'mcp',
  },
  mcp: {
    autoExecuteRiskThreshold: parseFloat(process.env.MCP_RISK_THRESHOLD || '0.7'),
    contextCacheTtl: parseInt(process.env.MCP_CACHE_TTL || '30000', 10),
    decisionHistoryLimit: parseInt(process.env.MCP_HISTORY_LIMIT || '100', 10),
    confirmationTimeout: parseInt(process.env.MCP_CONFIRMATION_TIMEOUT || '30000', 10),
  },
} as const; 
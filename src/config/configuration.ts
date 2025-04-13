import { registerAs } from '@nestjs/config';
import { developmentConfig } from './environment/development';
import { productionConfig } from './environment/production';
import { getWebsocketConfig } from './websocket.config';
import { getMcpConfig } from './mcp.config';

const env = process.env.NODE_ENV || 'development';
const config = env === 'production' ? productionConfig : developmentConfig;

export default registerAs('config', () => ({
  app: config.app,
  database: config.database,
  security: config.security,
  websocket: getWebsocketConfig(config),
  mcp: getMcpConfig(config),
})); 
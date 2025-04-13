import { z } from 'zod';

export const websocketConfigSchema = z.object({
  cors: z.object({
    origin: z.string(),
    methods: z.array(z.string()),
    credentials: z.boolean(),
  }),
  namespace: z.string(),
  transports: z.array(z.string()),
  pingTimeout: z.number().min(1000),
  pingInterval: z.number().min(1000),
});

export type WebsocketConfig = z.infer<typeof websocketConfigSchema>;

export const getWebsocketConfig = (config: any): WebsocketConfig => {
  const validatedConfig = websocketConfigSchema.parse({
    cors: {
      origin: config.websocket.corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    namespace: config.websocket.namespace,
    transports: ['websocket'],
    pingTimeout: 5000,
    pingInterval: 10000,
  });

  return validatedConfig;
}; 
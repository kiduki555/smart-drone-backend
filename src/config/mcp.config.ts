import { z } from 'zod';

export const mcpConfigSchema = z.object({
  autoExecuteRiskThreshold: z.number().min(0).max(1),
  contextCacheTtl: z.number().min(1000),
  decisionHistoryLimit: z.number().min(1),
  confirmationTimeout: z.number().min(1000),
});

export type McpConfig = z.infer<typeof mcpConfigSchema>;

export const getMcpConfig = (config: any): McpConfig => {
  const validatedConfig = mcpConfigSchema.parse({
    autoExecuteRiskThreshold: config.mcp.autoExecuteRiskThreshold,
    contextCacheTtl: config.mcp.contextCacheTtl,
    decisionHistoryLimit: config.mcp.decisionHistoryLimit,
    confirmationTimeout: config.mcp.confirmationTimeout,
  });

  return validatedConfig;
}; 
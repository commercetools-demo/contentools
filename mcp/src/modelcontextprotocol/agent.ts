import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AuthConfig } from '../types/auth.js';
import type { Configuration } from '../types/configuration.js';
import ContentToolsAPI from '../shared/api.js';
import { isToolAllowed, processConfigurationDefaults } from '../shared/configuration.js';
import { contextToTools } from '../shared/tools.js';
import { formatToolOutput } from '../shared/format.js';

const SERVER_NAME = 'contenttools-mcp';
const SERVER_VERSION = '1.0.0';

/**
 * Creates an MCP server that exposes Content Tools API as MCP tools.
 * No filtering or transformation; tools are registered with their Zod schemas and call api.run.
 */
export function createContentToolsMcpServer(
  authConfig: AuthConfig,
  configuration?: Configuration
): McpServer {
  const processedConfig = processConfigurationDefaults(configuration);
  const api = new ContentToolsAPI(authConfig, processedConfig.context);
  const tools = contextToTools(processedConfig.context).filter((t) =>
    isToolAllowed(t, processedConfig)
  );

  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {}
  );

  for (const tool of tools) {
    server.registerTool(
      tool.method,
      {
        description: tool.description,
        inputSchema: tool.parameters,
      },
      async (args) => {
        const result = await api.run(tool.method, (args ?? {}) as Record<string, unknown>);
        const text = formatToolOutput(result);
        return { content: [{ type: 'text' as const, text }] };
      }
    );
  }

  return server;
}

export default createContentToolsMcpServer;

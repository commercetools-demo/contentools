import type { Tool } from 'ai';
import ContentToolsAPI from '../shared/api';
import { isToolAllowed, processConfigurationDefaults } from '../shared/configuration';
import { contextToTools } from '../shared/tools';
import type { Configuration } from '../types/configuration';
import type { AuthConfig } from '../types/auth';
import ContentToolsTool from './tool';

class ContentToolsAgent {
  private _api: ContentToolsAPI;
  tools: Record<string, Tool>;

  constructor({
    authConfig,
    configuration,
  }: {
    authConfig: AuthConfig;
    configuration?: Configuration;
  }) {
    const processedConfiguration = processConfigurationDefaults(configuration);
    this._api = new ContentToolsAPI(authConfig, processedConfiguration.context);
    this.tools = {};

    const filteredTools = contextToTools(processedConfiguration.context).filter((tool) =>
      isToolAllowed(tool, processedConfiguration)
    );

    for (const t of filteredTools) {
      this.tools[t.method] = ContentToolsTool(this._api, t.method, t.description, t.parameters);
    }
  }

  getTools(): Record<string, Tool> {
    return this.tools;
  }
}

export default ContentToolsAgent;

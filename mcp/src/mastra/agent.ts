import ContentToolsAPI from '../shared/api';
import { isToolAllowed, processConfigurationDefaults } from '../shared/configuration';
import { contextToTools } from '../shared/tools';
import type { Configuration } from '../types/configuration';
import type { AuthConfig } from '../types/auth';
import ContentToolsTool from './tool';

type MastraTool = ReturnType<typeof ContentToolsTool>;

class ContentToolsAgent {
  private _api: ContentToolsAPI;
  private _tools: Record<string, MastraTool> = {};

  constructor({
    authConfig,
    configuration,
  }: {
    authConfig: AuthConfig;
    configuration?: Configuration;
  }) {
    const processedConfiguration = processConfigurationDefaults(configuration);
    this._api = new ContentToolsAPI(authConfig, processedConfiguration.context);

    const filteredTools = contextToTools(processedConfiguration.context).filter((tool) =>
      isToolAllowed(tool, processedConfiguration)
    );

    for (const t of filteredTools) {
      this._tools[t.method] = ContentToolsTool(this._api, t.method, t.description, t.parameters);
    }
  }

  getTools(): Record<string, MastraTool> {
    return this._tools;
  }
}

export default ContentToolsAgent;

import type { DynamicStructuredTool } from '@langchain/core/tools';
import ContentToolsAPI from '../shared/api';
import { isToolAllowed, processConfigurationDefaults } from '../shared/configuration';
import { contextToTools } from '../shared/tools';
import type { Configuration } from '../types/configuration';
import type { AuthConfig } from '../types/auth';
import ContentToolsTool from './tool';

class ContentToolsAgent {
  private _api: ContentToolsAPI;
  tools: DynamicStructuredTool[];

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

    this.tools = filteredTools.map((t) =>
      ContentToolsTool(this._api, t.method, t.description, t.parameters)
    );
  }

  getTools(): DynamicStructuredTool[] {
    return this.tools;
  }
}

export default ContentToolsAgent;

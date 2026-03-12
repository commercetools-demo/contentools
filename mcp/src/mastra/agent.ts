import ContentToolsAPI from '../shared/api';
import { allTools } from '../shared/tools';
import type { AuthConfig } from '../types/auth';
import ContentToolsTool from './tool';

type MastraTool = ReturnType<typeof ContentToolsTool>;

class ContentToolsAgent {
  private _api: ContentToolsAPI;
  private _tools: Record<string, MastraTool> = {};

  constructor({
    authConfig,
  }: {
    authConfig: AuthConfig;
  }) {
    this._api = new ContentToolsAPI(authConfig);

    for (const t of allTools) {
      this._tools[t.method] = ContentToolsTool(this._api, t.method, t.description, t.parameters);
    }
  }

  getTools(): Record<string, MastraTool> {
    return this._tools;
  }
}

export default ContentToolsAgent;

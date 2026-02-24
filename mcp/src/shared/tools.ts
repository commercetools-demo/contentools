import type { Context } from '../types/auth';
import type { Tool } from '../types/tools';
import { contextToAuthTools } from './auth/tools';
import { contextToConfigurationTools } from './configuration/tools';
import { contextToContentTypeTools } from './content-type/tools';
import { contextToContentItemTools } from './content-item/tools';
import { contextToContentItemVersionTools } from './content-item-version/tools';
import { contextToContentItemStateTools } from './content-item-state/tools';
import { contextToDatasourceTools } from './datasource/tools';
import { contextToFileTools } from './file/tools';
import { contextToPageTools } from './page/tools';
import { contextToPageVersionTools } from './page-version/tools';
import { contextToPageStateTools } from './page-state/tools';
import { contextToPageRowTools } from './page-row/tools';
import { contextToPageContentItemStateTools } from './page-content-item-state/tools';
import { contextToPageComponentTools } from './page-component/tools';
import { contextToProxyTools } from './proxy/tools';

export function contextToTools(_context?: Context): Tool[] {
  return [
    ...contextToAuthTools(),
    ...contextToConfigurationTools(),
    ...contextToContentTypeTools(),
    ...contextToContentItemTools(),
    ...contextToContentItemVersionTools(),
    ...contextToContentItemStateTools(),
    ...contextToDatasourceTools(),
    ...contextToFileTools(),
    ...contextToPageTools(),
    ...contextToPageVersionTools(),
    ...contextToPageStateTools(),
    ...contextToPageRowTools(),
    ...contextToPageContentItemStateTools(),
    ...contextToPageComponentTools(),
    ...contextToProxyTools(),
  ];
}

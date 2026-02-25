import { z } from 'zod';

/**
 * Datasource param. Matches DatasourceParam.
 */
export const datasourceParamSchema = z.object({
  key: z.string(),
  type: z.string(),
  required: z.boolean(),
});

/**
 * Datasource value. Matches @commercetools-demo/contentools-types DatasourceInfo
 * and state useDatasource / API payload for create/update.
 */
export const datasourceInfoSchema = z.object({
  name: z.string(),
  key: z.string(),
  params: z.array(datasourceParamSchema),
  deployedUrl: z.string(),
});

export type DatasourceInfoInput = z.infer<typeof datasourceInfoSchema>;

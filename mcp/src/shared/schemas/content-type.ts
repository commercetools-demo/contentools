import { z } from 'zod';

/**
 * Property schema for content type metadata. Matches ContentTypeMetaData.propertySchema.
 */
export const propertySchemaSchema = z.object({
  type: z.string(),
  label: z.string(),
  defaultValue: z.any().optional(),
  required: z.boolean().optional(),
  options: z.array(z.object({ value: z.any(), label: z.string() })).optional(),
  extensions: z.array(z.string()).optional(),
  order: z.number().optional(),
  datasourceType: z.string().optional(),
});

/**
 * Content type metadata. Matches ContentTypeMetaData.
 */
export const contentTypeMetadataSchema = z.object({
  type: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  defaultProperties: z.record(z.any()).optional(),
  propertySchema: z.record(propertySchemaSchema),
  isBuiltIn: z.boolean().optional(),
});

/**
 * Content type value. Matches @commercetools-demo/contentools-types ContentTypeData
 * and state api createContentTypeEndpoint/updateContentTypeEndpoint value.
 */
export const contentTypeDataSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  metadata: contentTypeMetadataSchema,
  code: z
    .object({
      componentName: z.string(),
      transpiledCode: z.string(),
      text: z.string(),
    })
    .optional(),
});

export type ContentTypeDataInput = z.infer<typeof contentTypeDataSchema>;

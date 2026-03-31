// Main editor component
export { PuckEditor } from './PuckEditor';
export type { PuckEditorProps } from './PuckEditor';

// Default config (consumers can extend this)
export { defaultPuckConfig } from './config/defaultPuckConfig';

// Built-in components (export so consumers can compose custom configs)
export {
  Hero,
  RichText,
  Columns,
  Image,
  Button,
  Card,
  Spacer,
  ProductTeaser,
} from './components';
export type {
  HeroProps,
  RichTextProps,
  ColumnsProps,
  ImageProps,
  ButtonProps,
  CardProps,
  SpacerProps,
  ProductTeaserProps,
} from './components';

// Custom field components (reuse in your own component configs)
export { ImagePickerField } from './fields/ImagePickerField';
export type { ImagePickerFieldProps } from './fields/ImagePickerField';

export { DatasourceField } from './fields/DatasourceField';
export type { DatasourceFieldProps, DatasourceValue, DatasourceType } from './fields/DatasourceField';

// CMS components
export * from './components/cms';

// Toolbar (in case consumers want to render it standalone)
export { EditorToolbar } from './toolbar/EditorToolbar';
export type { EditorToolbarProps } from './toolbar/EditorToolbar';

// Puck overrides — component search panel and filter (reusable in any Puck editor)
export {
  ComponentSearchProvider,
  ComponentsPanel,
  ComponentItemFilter,
} from './overrides/ComponentListSearch';

// Main editor component
export { PuckEditor } from './PuckEditor';
export type { PuckEditorProps } from './PuckEditor';

// Default config (consumers can extend this)
export { defaultPuckConfig } from './config/defaultPuckConfig';

// Built-in components (export so consumers can compose custom configs)
export {
  Hero,
  RichText,
  Grid,
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
  GridProps,
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

export { RichTextField } from './fields/RichTextField';
export type { RichTextFieldProps } from './fields/RichTextField';

export { sanitizeHtml } from './utils/sanitizeHtml';

// CMS components
export * from './components/cms';

// Toolbar (in case consumers want to render it standalone)
export { EditorToolbar } from './toolbar/EditorToolbar';
export type { EditorToolbarProps } from './toolbar/EditorToolbar';

// Unsaved-changes navigation guard dialog (Nimbus)
export { UnsavedChangesDialog } from './toolbar/UnsavedChangesDialog';
export type { UnsavedChangesDialogProps } from './toolbar/UnsavedChangesDialog';

// Dirty-state tracking hook (skips Puck's normalising mount onChange)
export { useDirtyState } from './hooks/useDirtyState';
export type { DirtyState } from './hooks/useDirtyState';

// Puck overrides — component search panel and filter (reusable in any Puck editor)
export {
  ComponentSearchProvider,
  ComponentsPanel,
  ComponentItemFilter,
} from './overrides/ComponentListSearch';

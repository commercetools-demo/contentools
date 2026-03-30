import {
  defaultPuckConfig,
  Hero,
  RichText,
  Columns,
  Image,
  Button,
  Card,
  Spacer,
  ProductTeaser,
} from '@commercetools-demo/puck-editor';
import type { PuckConfig } from '@commercetools-demo/puck-types';

/**
 * App-level Puck config.
 * Starts with all built-in components from puck-editor.
 * Add your own custom components here:
 *
 * import { MyComponent } from './components/MyComponent';
 * components: { ...defaultPuckConfig.components, MyComponent }
 */
export const puckConfig: PuckConfig = {
  ...defaultPuckConfig,
  components: {
    Hero,
    RichText,
    Columns,
    Image,
    Button,
    Card,
    Spacer,
    ProductTeaser,
  },
};

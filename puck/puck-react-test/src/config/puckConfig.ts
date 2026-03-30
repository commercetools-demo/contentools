import { defaultPuckConfig } from '@commercetools-demo/puck-editor';
import type { PuckConfig } from '@commercetools-demo/puck-types';

/**
 * App-level Puck config.
 * Spreads all built-in + CMS components from puck-editor.
 * Add your own custom components by extending components:
 *
 * import { MyComponent } from './components/MyComponent';
 * components: { ...defaultPuckConfig.components, MyComponent }
 */
export const puckConfig: PuckConfig = {
  ...defaultPuckConfig,
  components: {
    ...defaultPuckConfig.components,
  },
};

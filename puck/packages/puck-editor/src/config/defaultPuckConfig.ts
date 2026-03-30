import React from 'react';
import { type Config } from '@measured/puck';
import { Hero } from '../components/Hero';
import { RichText } from '../components/RichText';
import { Columns } from '../components/Columns';
import { Image } from '../components/Image';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Spacer } from '../components/Spacer';

/**
 * Default Puck configuration with built-in components.
 *
 * Consumers can extend this:
 * ```ts
 * import { defaultPuckConfig } from '@commercetools-demo/puck-editor';
 * const myConfig = {
 *   ...defaultPuckConfig,
 *   components: { ...defaultPuckConfig.components, MyComponent },
 * };
 * ```
 */
export const defaultPuckConfig: Config = {
  components: {
    Hero,
    RichText,
    Columns,
    Image,
    Button,
    Card,
    Spacer,
  },
  root: {
    fields: {
      title: { type: 'text', label: 'Page Title' },
      backgroundColor: { type: 'text', label: 'Background Color (CSS)' },
    },
    defaultProps: {
      title: 'New Page',
      backgroundColor: '#ffffff',
    },
    render: ({ children, backgroundColor }) =>
      React.createElement(
        'div',
        {
          style: {
            background: backgroundColor ?? '#ffffff',
            minHeight: '100vh',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          },
        },
        children
      ),
  },
};

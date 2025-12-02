import React, { PropsWithChildren } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import PropertyEditorCore, { PropertyEditorCoreProps } from './property-editor-core';

/**
 * Error boundary to catch the error when IntlProvider context is missing
 * This is similar to ContextErrorBoundary in content-item-renderer
 */
class IntlContextErrorBoundary extends React.Component<
  PropsWithChildren<{ fallback: React.ReactNode; componentName?: string }>,
  { hasError: boolean }
> {
  constructor(props: PropsWithChildren<{ fallback: React.ReactNode; componentName?: string }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    const componentName = this.props.componentName || 'PropertyEditor';
    
    // Check if this is an IntlProvider-related error
    if (
      error.message && 
      (error.message.includes('IntlProvider') || 
       error.message.includes('intl') ||
       error.message.includes('[React Intl]'))
    ) {
      console.log(`${componentName}: IntlProvider context not found, using fallback with default IntlProvider`);
    } else {
      // Re-throw other errors as they're not related to missing context
      throw error;
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Contextual renderer that uses existing IntlProvider context if available
 * This follows the same pattern as ContextualRenderer in renderer-factory
 */
const ContextualPropertyEditor: React.FC<PropsWithChildren<PropertyEditorCoreProps>> = (props) => {
  // Always call the hook - this follows React's Rules of Hooks
  // If context is not available, this will throw an error that the error boundary will catch
  const intl = useIntl();
  
  // If we get here, intl context is available
  if (intl) {
    return <PropertyEditorCore {...props} />;
  }
  
  // This should not happen if context is properly set up
  return <PropertyEditorCore {...props} />;
};

/**
 * Standalone renderer that wraps PropertyEditor with IntlProvider
 */
const StandalonePropertyEditor: React.FC<PropsWithChildren<PropertyEditorCoreProps>> = (props) => {
  // Default messages for IntlProvider
  const defaultMessages = {};
  const defaultLocale = 'en';

  return (
    <IntlProvider messages={defaultMessages} locale={defaultLocale} defaultLocale={defaultLocale}>
      <PropertyEditorCore {...props} />
    </IntlProvider>
  );
};

/**
 * Factory function to create contextual and standalone property editor components
 * Similar to the renderer-factory pattern
 */
export function createPropertyEditorRenderers() {
  return {
    ContextualPropertyEditor,
    StandalonePropertyEditor,
  };
}

export const PropertyEditorWrapper: React.FC<PropsWithChildren<PropertyEditorCoreProps>> = (
  props
) => {
  return (
    <IntlContextErrorBoundary 
      componentName="PropertyEditor"
      fallback={<StandalonePropertyEditor {...props} />}
    >
      <ContextualPropertyEditor {...props} />
    </IntlContextErrorBoundary>
  );
};

export default PropertyEditorWrapper;


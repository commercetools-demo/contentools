import React, { PropsWithChildren } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import WrappedConfigurationApp, { WrappedConfigurationAppProps } from './configuration-core';

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
const ContextualPropertyEditor: React.FC<PropsWithChildren<WrappedConfigurationAppProps>> = (props) => {
  // Always call the hook - this follows React's Rules of Hooks
  // If context is not available, this will throw an error that the error boundary will catch
  const intl = useIntl();
  
  // If we get here, intl context is available
  if (intl) {
    return <WrappedConfigurationApp {...props} />;
  }
  
  // This should not happen if context is properly set up
  return <WrappedConfigurationApp {...props} />;
};

/**
 * Standalone renderer that wraps PropertyEditor with IntlProvider
 */
const StandalonePropertyEditor: React.FC<PropsWithChildren<WrappedConfigurationAppProps>> = (props) => {
  // Default messages for IntlProvider
  const defaultMessages = {};
  const defaultLocale = 'en';

  return (
    <IntlProvider messages={defaultMessages} locale={defaultLocale} defaultLocale={defaultLocale}>
      <WrappedConfigurationApp {...props} />
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

export const ConfigurationWrapper: React.FC<PropsWithChildren<WrappedConfigurationAppProps>> = (
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

export default ConfigurationWrapper;


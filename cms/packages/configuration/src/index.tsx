import React, { PropsWithChildren } from 'react';
import { ConfigurationWrapper } from './configuration-wrapper';
import { type WrappedConfigurationAppProps } from './configuration-core';

export const PropertyEditor: React.FC<PropsWithChildren<WrappedConfigurationAppProps>> = (
  props
) => {
  return <ConfigurationWrapper {...props} />;
};

// Default export is the smart wrapper component
export default PropertyEditor;

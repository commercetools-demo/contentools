import React, { PropsWithChildren } from 'react';
import { PropertyEditorWrapper } from './property-editor-wrapper';
import { type PropertyEditorCoreProps } from './property-editor-core';

export const PropertyEditor: React.FC<PropsWithChildren<PropertyEditorCoreProps>> = (
  props
) => {
  return <PropertyEditorWrapper {...props} />;
};

// Default export is the smart wrapper component
export default PropertyEditor;

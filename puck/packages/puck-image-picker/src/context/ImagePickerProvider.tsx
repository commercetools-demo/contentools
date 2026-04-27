import React, { type ReactNode } from 'react';
import { ImagePickerContext, type ImagePickerConfig } from './ImagePickerContext';

export interface ImagePickerProviderProps extends ImagePickerConfig {
  children: ReactNode;
}

export const ImagePickerProvider: React.FC<ImagePickerProviderProps> = ({
  children,
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
}) => {
  return (
    <ImagePickerContext.Provider
      value={{ baseURL, projectKey, businessUnitKey, jwtToken }}
    >
      {children}
    </ImagePickerContext.Provider>
  );
};

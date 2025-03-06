import { v4 as uuidv4 } from 'uuid';
import { Component } from '../types';

// Define component types
export enum ComponentType {
  HERO_BANNER = 'heroBanner',
  PRODUCT_SLIDER = 'productSlider',
}

// Component Metadata
export interface ComponentMetadata {
  type: ComponentType;
  name: string;
  icon?: string;
  defaultProperties: Record<string, any>;
  propertySchema: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'array' | 'object';
      label: string;
      defaultValue?: any;
      required?: boolean;
      options?: { value: any; label: string }[];
    };
  };
}

// Component Registry
const componentRegistry: Record<ComponentType, ComponentMetadata> = {
  [ComponentType.HERO_BANNER]: {
    type: ComponentType.HERO_BANNER,
    name: 'Hero Banner',
    icon: '🖼️',
    defaultProperties: {
      title: 'Hero Title',
      subtitle: 'Hero Subtitle',
      imageUrl: '',
      ctaText: 'Learn More',
      ctaUrl: '#',
    },
    propertySchema: {
      title: {
        type: 'string',
        label: 'Title',
        defaultValue: 'Hero Title',
        required: true,
      },
      subtitle: {
        type: 'string',
        label: 'Subtitle',
        defaultValue: 'Hero Subtitle',
      },
      imageUrl: {
        type: 'string',
        label: 'Image URL',
      },
      ctaText: {
        type: 'string',
        label: 'CTA Text',
        defaultValue: 'Learn More',
      },
      ctaUrl: {
        type: 'string',
        label: 'CTA URL',
        defaultValue: '#',
      },
    },
  },
  [ComponentType.PRODUCT_SLIDER]: {
    type: ComponentType.PRODUCT_SLIDER,
    name: 'Product Slider',
    icon: '🛒',
    defaultProperties: {
      title: 'Featured Products',
      skus: [],
      autoplay: true,
      slidesToShow: 4,
    },
    propertySchema: {
      title: {
        type: 'string',
        label: 'Title',
        defaultValue: 'Featured Products',
        required: true,
      },
      skus: {
        type: 'array',
        label: 'Product SKUs',
        defaultValue: [],
      },
      autoplay: {
        type: 'boolean',
        label: 'Autoplay',
        defaultValue: true,
      },
      slidesToShow: {
        type: 'number',
        label: 'Slides to Show',
        defaultValue: 4,
      },
    },
  },
};

// Helper functions
export const getComponentMetadata = (type: ComponentType): ComponentMetadata => {
  return componentRegistry[type];
};

export const getAllComponentTypes = (): ComponentMetadata[] => {
  return Object.values(componentRegistry);
};

export const createComponent = (type: ComponentType, name?: string): Component => {
  const metadata = getComponentMetadata(type);
  
  return {
    id: uuidv4(),
    type: metadata.type,
    name: name || metadata.name,
    properties: { ...metadata.defaultProperties },
  };
};

export default componentRegistry;
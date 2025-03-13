import { v4 as uuidv4 } from 'uuid';
import { Component, ComponentMetadata, RegistryComponentData } from '../types';
import { store } from '../store';
import { fetchRegistryComponents } from '../store/registry.slice';

// Define component types
export enum ComponentType {
  HERO_BANNER = 'heroBanner',
  PRODUCT_SLIDER = 'productSlider',
}

// Default component metadata for fallback
const defaultRegistry: Record<string, ComponentMetadata> = {
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

// Helper function to get registry components from store or load them if not available
export const getRegistryComponentsFromStore = async ({ baseURL }: { baseURL: string }): Promise<RegistryComponentData[]> => {
  const state = store.getState();
  
  if (state.registry.components.length === 0 && !state.registry.loading) {
    await store.dispatch(fetchRegistryComponents({ baseURL }));
  }
  
  return store.getState().registry.components;
};

// Helper functions
export const getComponentMetadata = async ({ baseURL, type }: { baseURL: string, type: string }): Promise<ComponentMetadata> => {
  const components = await getRegistryComponentsFromStore({ baseURL });
  const component = components.find(c => c.metadata.type === type);
  
  return component?.metadata || defaultRegistry[type] || null;
};

export const getAllComponentTypes = async ({ baseURL }: { baseURL: string }): Promise<ComponentMetadata[]> => {
  const components = await getRegistryComponentsFromStore({ baseURL });
  return components.map(c => c.metadata);
};

export const createComponent = async ({ baseURL, type, name }: { baseURL: string, type: string, name?: string }): Promise<Component> => {
  const metadata = await getComponentMetadata({ baseURL, type });
  
  if (!metadata) {
    throw new Error(`Component type "${type}" not found in registry`);
  }
  
  return {
    id: uuidv4(),
    type: metadata.type,
    name: name || metadata.name,
    properties: { ...metadata.defaultProperties },
  };
};

export default defaultRegistry;
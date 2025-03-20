import { ComponentMetadata } from '../../../types';

export enum ComponentType {
    HERO_BANNER = 'heroBanner',
    PRODUCT_SLIDER = 'productSlider',
  }
  
  
export const defaultRegistry: Record<string, ComponentMetadata> = {
    [ComponentType.HERO_BANNER]: {
      type: ComponentType.HERO_BANNER,
      name: 'Hero Banner',
      icon: '🖼️',
      isBuiltIn: true,
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
      isBuiltIn: true,
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
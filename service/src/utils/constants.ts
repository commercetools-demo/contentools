import { ContentType } from '../controllers/content-item.controller';

export enum SampleContentType {
  HERO_BANNER = 'heroBanner',
  PRODUCT_SLIDER = 'productSlider',
  RICH_TEXT = 'richText',
}

export const sampleContentTypeRegistry: Record<string, Partial<ContentType>> = {
  [SampleContentType.HERO_BANNER]: {
    type: SampleContentType.HERO_BANNER,
    value: {
      metadata: {
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
            type: 'file',
            extensions: ['jpg', 'jpeg', 'png'],
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
    },
  },
  [SampleContentType.PRODUCT_SLIDER]: {
    type: SampleContentType.PRODUCT_SLIDER,
    name: 'Product Slider',
    icon: '🛒',
    isBuiltIn: true,
    value: {
      metadata: {
        propertySchema: {
          title: {
            type: 'string',
            label: 'Title',
            defaultValue: 'Featured Products',
            required: true,
          },
          skus: {
            type: 'datasource',
            label: 'Product SKUs',
            defaultValue: [],
            datasourceType: 'products-by-sku',
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
    },
  },
  [SampleContentType.RICH_TEXT]: {
    type: SampleContentType.RICH_TEXT,
    value: {
      metadata: {
        propertySchema: {
          content: {
            type: 'string', // HTML content stored as string, to be edited with WYSIWYG in the CMS
            label: 'Content',
            defaultValue: '<p>Enter your content here...</p>',
            required: true,
          },
        },
      },
    },
  },
};

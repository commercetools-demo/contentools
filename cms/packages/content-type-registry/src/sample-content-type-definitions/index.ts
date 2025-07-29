import { ContentTypeMetaData } from "@commercetools-demo/cms-types";
import { HeroBanner } from "../sample-content-type-renderers";
import { ProductSlider } from "../sample-content-type-renderers";
import { RichText } from "../sample-content-type-renderers";
import { WebsiteLogo } from "../sample-content-type-renderers";

export enum SampleContentType {
    HERO_BANNER = 'heroBanner',
    PRODUCT_SLIDER = 'productSlider',
    RICH_TEXT = 'richText',
    WEBSITE_LOGO = 'websiteLogo',
  }

  export const sampleContentTypeRenderers: Record<string, React.FC<any>> = {
    [SampleContentType.HERO_BANNER]: HeroBanner,
    [SampleContentType.PRODUCT_SLIDER]: ProductSlider,
    [SampleContentType.RICH_TEXT]: RichText,
    [SampleContentType.WEBSITE_LOGO]: WebsiteLogo,
  };
  
  export const sampleContentTypeRegistry: Record<string, ContentTypeMetaData> = {
    [SampleContentType.HERO_BANNER]: {
      type: SampleContentType.HERO_BANNER,
      name: 'Hero Banner',
      icon: '🖼️',
      isBuiltIn: true,
      defaultProperties: {
        title: 'Hero Title',
        subtitle: 'Hero Subtitle',
        imageUrl: '',
        ctaText: 'Learn More',
        ctaUrl: '#',
        slot: '',
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
        slot: {
          type: 'string',
          label: 'Slot',
          defaultValue: '',
        },
      },
    },
    [SampleContentType.PRODUCT_SLIDER]: {
      type: SampleContentType.PRODUCT_SLIDER,
      name: 'Product Slider',
      icon: '🛒',
      isBuiltIn: true,
      defaultProperties: {
        title: 'Featured Products',
        skus: [],
        autoplay: true,
        slidesToShow: 4,
        slot: '',
      },
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
        slot: {
          type: 'string',
          label: 'Slot',
          defaultValue: '',
        },
      },
    },
    [SampleContentType.RICH_TEXT]: {
      type: SampleContentType.RICH_TEXT,
      name: 'Rich Text Editor',
      icon: '📝',
      isBuiltIn: true,
      defaultProperties: {
        content: '<p>Enter your content here...</p>',
        slot: '',
      },
      propertySchema: {
        content: {
          type: 'string', // HTML content stored as string, to be edited with WYSIWYG in the CMS
          label: 'Content',
          defaultValue: '<p>Enter your content here...</p>',
          required: true,
        },
        slot: {
          type: 'string',
          label: 'Slot',
          defaultValue: '',
        },
      },
    },
    [SampleContentType.WEBSITE_LOGO]: {
      type: SampleContentType.WEBSITE_LOGO,
      name: 'Website Logo',
      icon: '🖼️',
      isBuiltIn: true,
      defaultProperties: {
        logoUrl: '',
        slot: '',
      },
      propertySchema: {
        logoUrl: {
          type: 'file',
          extensions: ['jpg', 'jpeg', 'png', 'webp'],
          label: 'Logo URL',
          defaultValue: '',
          required: true,
        },
        slot: {
          type: 'string',
          label: 'Slot',
          defaultValue: '',
        },
      },
    },
  };
  
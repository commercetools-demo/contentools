import React from 'react';
import { type Config } from '@measured/puck';
import { Hero } from '../components/Hero';
import { RichText } from '../components/RichText';
import { Grid } from '../components/Grid';
import { Columns } from '../components/Columns';
import { Image } from '../components/Image';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Spacer } from '../components/Spacer';
import { ProductTeaser } from '../components/ProductTeaser';
import {
  HeroBanner, TextBlock, CategoryGrid, CategoryHero,
  CheckoutPromoBanner, CountdownBanner, CrossSellBlock, DeliveryMessage,
  Divider, EmptyState, FAQAccordion, FooterBlock, ImageBlock,
  NewsletterSignup, ProductBanner, ProductGridHeader, ProductSlider,
  PromotionalBanner, RelatedProductsSlider, SocialLinks, TabContent,
  TestimonialsSlider, ThankYouContent, TrustBadges, VideoBlock, WebsiteLogo,
} from '../components/cms';

/**
 * Default Puck configuration with built-in components.
 *
 * Consumers can extend this:
 * ```ts
 * import { defaultPuckConfig } from '@commercetools-demo/puck-editor';
 * const myConfig = {
 *   ...defaultPuckConfig,
 *   components: { ...defaultPuckConfig.components, MyComponent },
 * };
 * ```
 */
export const defaultPuckConfig: Config = {
  components: {
    Hero,
    RichText,
    Grid,
    Columns,
    Image,
    Button,
    Card,
    Spacer,
    ProductTeaser,
    // CMS components
    HeroBanner, TextBlock, CategoryGrid, CategoryHero,
    CheckoutPromoBanner, CountdownBanner, CrossSellBlock, DeliveryMessage,
    Divider, EmptyState, FAQAccordion, FooterBlock, ImageBlock,
    NewsletterSignup, ProductBanner, ProductGridHeader, ProductSlider,
    PromotionalBanner, RelatedProductsSlider, SocialLinks, TabContent,
    TestimonialsSlider, ThankYouContent, TrustBadges, VideoBlock, WebsiteLogo,
  },
  // Plain-language groups so the component panel reads cleanly for non-technical
  // authors. Common groups are expanded; the rest start collapsed. Deprecated
  // components live in a hidden category (still render, just not offered).
  categories: {
    layout: {
      title: 'Layout',
      defaultExpanded: false,
      components: ['Grid', 'Card', 'Spacer', 'Divider', 'Columns'],
    },
    text: {
      title: 'Text & Content',
      defaultExpanded: false,
      components: ['RichText', 'TextBlock', 'FAQAccordion', 'TabContent'],
    },
    media: {
      title: 'Media',
      defaultExpanded: false,
      components: ['Image', 'ImageBlock', 'VideoBlock', 'WebsiteLogo'],
    },
    heroBanners: {
      title: 'Hero & Banners',
      defaultExpanded: false,
      components: [
        'Hero', 'HeroBanner', 'PromotionalBanner', 'CountdownBanner',
        'CategoryHero', 'CheckoutPromoBanner', 'ProductBanner',
      ],
    },
    products: {
      title: 'Products',
      defaultExpanded: false,
      components: [
        'ProductTeaser', 'ProductSlider', 'ProductGridHeader',
        'RelatedProductsSlider', 'CrossSellBlock', 'CategoryGrid',
      ],
    },
    actions: {
      title: 'Buttons & Forms',
      defaultExpanded: false,
      components: ['Button', 'NewsletterSignup'],
    },
    socialProof: {
      title: 'Social Proof & Info',
      defaultExpanded: false,
      components: ['TestimonialsSlider', 'TrustBadges', 'SocialLinks', 'DeliveryMessage'],
    },
    sections: {
      title: 'Page Sections',
      defaultExpanded: false,
      components: ['FooterBlock', 'EmptyState', 'ThankYouContent'],
    },
    // Anything not explicitly categorised (e.g. future components) still shows.
    other: {
      title: 'Other',
    },
  },
  root: {
    fields: {
      title: { type: 'text', label: 'Page Title' },
      backgroundColor: { type: 'text', label: 'Background Color (CSS)' },
    },
    defaultProps: {
      title: 'New Page',
      backgroundColor: '#ffffff',
    },
    render: ({ children, backgroundColor }) =>
      React.createElement(
        'div',
        {
          style: {
            background: backgroundColor ?? '#ffffff',
            minHeight: '100vh',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          },
        },
        children
      ),
  },
};

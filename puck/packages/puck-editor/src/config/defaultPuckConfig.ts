import React from 'react';
import { type Config } from '@measured/puck';
import { createIntl, createIntlCache, type IntlShape } from 'react-intl';
import {
  createHeroConfig,
  createRichTextConfig,
  createGridConfig,
  createColumnsConfig,
  createImageConfig,
  createButtonConfig,
  createCardConfig,
  createSpacerConfig,
  createProductTeaserConfig,
  createHeroBannerConfig,
  createTextBlockConfig,
  createCategoryGridConfig,
  createCategoryHeroConfig,
  createCheckoutPromoBannerConfig,
  createCountdownBannerConfig,
  createCrossSellBlockConfig,
  createDeliveryMessageConfig,
  createDividerConfig,
  createEmptyStateConfig,
  createFAQAccordionConfig,
  createFooterBlockConfig,
  createImageBlockConfig,
  createNewsletterSignupConfig,
  createProductBannerConfig,
  createProductGridHeaderConfig,
  createProductSliderConfig,
  createPromotionalBannerConfig,
  createRelatedProductsSliderConfig,
  createSocialLinksConfig,
  createTabContentConfig,
  createTestimonialsSliderConfig,
  createThankYouContentConfig,
  createTrustBadgesConfig,
  createVideoBlockConfig,
  createWebsiteLogoConfig,
} from '../components';
import { ColorPickerField } from '../fields/ColorPickerField';
import en from '../intl/en.json';

/**
 * Page content-width scale. `X` is the base column unit; each step doubles up
 * to a wide layout, and `full` removes the constraint (edge-to-edge).
 */
type ContentWidth = 'x' | '2x' | '3x' | '4x' | '5x' | '6x' | 'full';

const CONTENT_WIDTHS: Record<ContentWidth, string> = {
  x: '256px',
  '2x': '512px',
  '3x': '768px',
  '4x': '1024px',
  '5x': '1280px',
  '6x': '1536px',
  full: '100%',
};

/**
 * Builds the default Puck configuration (all built-in components), with every
 * user-facing label localized via the supplied `intl`.
 *
 * ```ts
 * import { createDefaultPuckConfig } from '@commercetools-demo/puck-editor';
 * const intl = useIntl();
 * const config = useMemo(() => createDefaultPuckConfig(intl), [intl]);
 * ```
 *
 * Consumers can extend the result by spreading `components` / `categories`.
 */
export function createDefaultPuckConfig(intl: IntlShape): Config {
  return {
    components: {
      Hero: createHeroConfig(intl),
      RichText: createRichTextConfig(intl),
      Grid: createGridConfig(intl),
      Columns: createColumnsConfig(intl),
      Image: createImageConfig(intl),
      Button: createButtonConfig(intl),
      Card: createCardConfig(intl),
      Spacer: createSpacerConfig(intl),
      ProductTeaser: createProductTeaserConfig(intl),
      // CMS components
      HeroBanner: createHeroBannerConfig(intl),
      TextBlock: createTextBlockConfig(intl),
      CategoryGrid: createCategoryGridConfig(intl),
      CategoryHero: createCategoryHeroConfig(intl),
      CheckoutPromoBanner: createCheckoutPromoBannerConfig(intl),
      CountdownBanner: createCountdownBannerConfig(intl),
      CrossSellBlock: createCrossSellBlockConfig(intl),
      DeliveryMessage: createDeliveryMessageConfig(intl),
      Divider: createDividerConfig(intl),
      EmptyState: createEmptyStateConfig(intl),
      FAQAccordion: createFAQAccordionConfig(intl),
      FooterBlock: createFooterBlockConfig(intl),
      ImageBlock: createImageBlockConfig(intl),
      NewsletterSignup: createNewsletterSignupConfig(intl),
      ProductBanner: createProductBannerConfig(intl),
      ProductGridHeader: createProductGridHeaderConfig(intl),
      ProductSlider: createProductSliderConfig(intl),
      PromotionalBanner: createPromotionalBannerConfig(intl),
      RelatedProductsSlider: createRelatedProductsSliderConfig(intl),
      SocialLinks: createSocialLinksConfig(intl),
      TabContent: createTabContentConfig(intl),
      TestimonialsSlider: createTestimonialsSliderConfig(intl),
      ThankYouContent: createThankYouContentConfig(intl),
      TrustBadges: createTrustBadgesConfig(intl),
      VideoBlock: createVideoBlockConfig(intl),
      WebsiteLogo: createWebsiteLogoConfig(intl),
    },
    // Plain-language groups so the component panel reads cleanly for non-technical
    // authors. Common groups are expanded; the rest start collapsed. Deprecated
    // components live in a hidden category (still render, just not offered).
    categories: {
      layout: {
        title: intl.formatMessage({ id: 'Editor.cfg.category.layout' }),
        defaultExpanded: false,
        components: ['Grid', 'Card', 'Spacer', 'Divider', 'Columns'],
      },
      text: {
        title: intl.formatMessage({ id: 'Editor.cfg.category.text' }),
        defaultExpanded: false,
        components: ['RichText', 'TextBlock', 'FAQAccordion', 'TabContent'],
      },
      media: {
        title: intl.formatMessage({ id: 'Editor.cfg.category.media' }),
        defaultExpanded: false,
        components: ['Image', 'ImageBlock', 'VideoBlock', 'WebsiteLogo'],
      },
      heroBanners: {
        title: intl.formatMessage({ id: 'Editor.cfg.category.heroBanners' }),
        defaultExpanded: false,
        components: [
          'Hero', 'HeroBanner', 'PromotionalBanner', 'CountdownBanner',
          'CategoryHero', 'CheckoutPromoBanner', 'ProductBanner',
        ],
      },
      products: {
        title: intl.formatMessage({ id: 'Editor.cfg.category.products' }),
        defaultExpanded: false,
        components: [
          'ProductTeaser', 'ProductSlider', 'ProductGridHeader',
          'RelatedProductsSlider', 'CrossSellBlock', 'CategoryGrid',
        ],
      },
      actions: {
        title: intl.formatMessage({ id: 'Editor.cfg.category.actions' }),
        defaultExpanded: false,
        components: ['Button', 'NewsletterSignup'],
      },
      socialProof: {
        title: intl.formatMessage({ id: 'Editor.cfg.category.socialProof' }),
        defaultExpanded: false,
        components: ['TestimonialsSlider', 'TrustBadges', 'SocialLinks', 'DeliveryMessage'],
      },
      sections: {
        title: intl.formatMessage({ id: 'Editor.cfg.category.sections' }),
        defaultExpanded: false,
        components: ['FooterBlock', 'EmptyState', 'ThankYouContent'],
      },
      // Anything not explicitly categorised (e.g. future components) still shows.
      other: {
        title: intl.formatMessage({ id: 'Editor.cfg.category.other' }),
      },
    },
    root: {
      fields: {
        title: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.root.field.title' }) },
        backgroundColor: {
          type: 'custom',
          label: intl.formatMessage({ id: 'Editor.cfg.root.field.backgroundColor' }),
          render: ({ value, onChange }) =>
            React.createElement(ColorPickerField, { value, onChange, allowNone: true }),
        },
        contentWidth: {
          type: 'select',
          label: intl.formatMessage({ id: 'Editor.cfg.root.field.contentWidth' }),
          // Size codes (X…6X) are universal; only "Full width" is localized.
          options: [
            { label: 'X', value: 'x' },
            { label: '2X', value: '2x' },
            { label: '3X', value: '3x' },
            { label: '4X', value: '4x' },
            { label: '5X', value: '5x' },
            { label: '6X', value: '6x' },
            { label: intl.formatMessage({ id: 'Editor.cfg.root.contentWidth.full' }), value: 'full' },
          ],
        },
      },
      defaultProps: {
        title: 'New Page',
        backgroundColor: '#ffffff',
        // Default to full-bleed so existing pages render unchanged.
        contentWidth: 'full',
      },
      render: ({ children, backgroundColor, contentWidth }) => {
        const maxWidth = CONTENT_WIDTHS[contentWidth as ContentWidth] ?? '100%';
        const isConstrained = maxWidth !== '100%';
        return React.createElement(
          'div',
          {
            style: {
              background: backgroundColor ?? '#ffffff',
              minHeight: '100vh',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            },
          },
          React.createElement(
            'div',
            {
              style: {
                maxWidth,
                // Centre the content column and give it breathing room on the
                // sides when its width is constrained.
                margin: '0 auto',
                paddingLeft: isConstrained ? '24px' : undefined,
                paddingRight: isConstrained ? '24px' : undefined,
                boxSizing: 'border-box',
              },
            },
            children
          )
        );
      },
    },
  };
}

// Standalone English intl used to build the deprecated back-compat config below.
const _enIntl = createIntl({ locale: 'en', messages: en }, createIntlCache());

/**
 * Default Puck configuration in English.
 *
 * @deprecated Build a localized config with `createDefaultPuckConfig(intl)`
 * instead — this const is English-only and kept for backward compatibility.
 */
export const defaultPuckConfig: Config = createDefaultPuckConfig(_enIntl);

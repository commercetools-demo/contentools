import { html, TemplateResult } from 'lit';
import { Component } from '../../types';
import { ComponentType } from '../registry';
import { renderHeroBanner, renderHeroBannerPreview } from './hero-banner';
import { renderProductSlider, renderProductSliderPreview } from './product-slider';

export const renderComponent = (component: Component): TemplateResult => {
  switch (component.type) {
    case ComponentType.HERO_BANNER:
      return renderHeroBanner(component);
    case ComponentType.PRODUCT_SLIDER:
      return renderProductSlider(component);
    default:
      return html`<div>Unknown component type: ${component.type}</div>`;
  }
};

export const renderComponentPreview = (component: Component): TemplateResult => {
  switch (component.type) {
    case ComponentType.HERO_BANNER:
      return renderHeroBannerPreview(component);
    case ComponentType.PRODUCT_SLIDER:
      return renderProductSliderPreview(component);
    default:
      return html`<div>Unknown component type: ${component.type}</div>`;
  }
};
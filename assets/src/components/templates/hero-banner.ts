import { html, TemplateResult } from 'lit';
import { Component } from '../../types';

export interface HeroBannerProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaUrl?: string;
}

export const renderHeroBanner = (component: Component): TemplateResult => {
  const props = component.properties as HeroBannerProps;
  
  return html`
    <div class="hero-banner">
      <h2>${props.title}</h2>
      ${props.subtitle ? html`<p class="subtitle">${props.subtitle}</p>` : ''}
      ${props.imageUrl ? html`<img src="${props.imageUrl}" alt="${props.title}" />` : ''}
      ${props.ctaText && props.ctaUrl ? html`<a href="${props.ctaUrl}" class="cta-button">${props.ctaText}</a>` : ''}
    </div>
  `;
};

export const renderHeroBannerPreview = (component: Component): TemplateResult => {
  const props = component.properties as HeroBannerProps;
  
  return html`
    <div class="component-preview hero-banner-preview">
      <div class="preview-header">
        <span class="component-icon">🖼️</span>
        <span class="component-name">${component.name}</span>
      </div>
      <div class="preview-content">
        <p><strong>Title:</strong> ${props.title}</p>
        ${props.subtitle ? html`<p><strong>Subtitle:</strong> ${props.subtitle}</p>` : ''}
        ${props.imageUrl ? html`<p><strong>Image:</strong> ${props.imageUrl.substring(0, 30)}...</p>` : ''}
      </div>
    </div>
  `;
};
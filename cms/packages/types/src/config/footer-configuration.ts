// ---------------------------------------------------------------------------
// Footer configuration (from Contentful)
// ---------------------------------------------------------------------------

export interface FooterLink {
  label: string;
  href: string;
  openInNewWindow?: boolean;
}

export interface FooterColumn {
  heading?: string;
  links: FooterLink[];
}

export interface FooterConfiguration {
  copyrightText: string;
  columns?: FooterColumn[];
  showSocialLinks?: boolean;
}

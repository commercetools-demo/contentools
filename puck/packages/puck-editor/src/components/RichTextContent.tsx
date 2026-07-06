import React from 'react';
import { sanitizeHtml } from '../utils/sanitizeHtml';

// ---------------------------------------------------------------------------
// RichTextContent — renders sanitized rich-text HTML with scoped typography
//
// Rich-text output is injected as bare HTML tags (<h1>, <strong>, <ul>, …).
// Those tags get no Nimbus/Chakra styling (Nimbus styles its own components,
// not bare element selectors), and any host CSS reset — notably Tailwind's
// Preflight, which sets `h1..h6 { font-size: inherit; font-weight: inherit }`
// and strips list markers/margins — flattens them to plain body text.
//
// To make the output look the same regardless of the host's reset, we ship a
// small stylesheet scoped to `.puck-rich-text-content` that restores sensible
// typographic defaults. The <style> uses React 19 href/precedence dedup, so it
// is inserted once no matter how many rich-text blocks render.
// ---------------------------------------------------------------------------

const STYLE_ID = 'puck-rich-text-content-styles';

const RICH_TEXT_CSS = `
.puck-rich-text-content { line-height: 1.6; }
.puck-rich-text-content > :first-child { margin-top: 0; }
.puck-rich-text-content > :last-child { margin-bottom: 0; }
.puck-rich-text-content h1 { font-size: 2em; font-weight: 700; line-height: 1.2; margin: 0.67em 0; }
.puck-rich-text-content h2 { font-size: 1.5em; font-weight: 700; line-height: 1.25; margin: 0.75em 0; }
.puck-rich-text-content h3 { font-size: 1.17em; font-weight: 700; line-height: 1.3; margin: 0.83em 0; }
.puck-rich-text-content h4 { font-size: 1em; font-weight: 700; margin: 1em 0; }
.puck-rich-text-content h5 { font-size: 0.83em; font-weight: 700; margin: 1.17em 0; }
.puck-rich-text-content h6 { font-size: 0.75em; font-weight: 700; margin: 1.33em 0; }
.puck-rich-text-content p { margin: 1em 0; }
.puck-rich-text-content strong, .puck-rich-text-content b { font-weight: 700; }
.puck-rich-text-content em, .puck-rich-text-content i { font-style: italic; }
.puck-rich-text-content u { text-decoration: underline; }
.puck-rich-text-content s, .puck-rich-text-content del { text-decoration: line-through; }
.puck-rich-text-content ul { list-style: disc; margin: 1em 0; padding-left: 1.5em; }
.puck-rich-text-content ol { list-style: decimal; margin: 1em 0; padding-left: 1.5em; }
.puck-rich-text-content li { margin: 0.25em 0; }
.puck-rich-text-content a { color: #2563eb; text-decoration: underline; }
.puck-rich-text-content blockquote { margin: 1em 0; padding-left: 1em; border-left: 3px solid #d1d5db; color: #4b5563; }
.puck-rich-text-content code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; background: rgba(0,0,0,0.06); padding: 0.1em 0.3em; border-radius: 3px; font-size: 0.9em; }
.puck-rich-text-content pre { background: rgba(0,0,0,0.06); padding: 0.75em 1em; border-radius: 6px; overflow-x: auto; }
.puck-rich-text-content pre code { background: none; padding: 0; }
.puck-rich-text-content img { max-width: 100%; height: auto; }
.puck-rich-text-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5em 0; }
`.trim();

export interface RichTextContentProps {
  /** Rich-text HTML string; sanitized here before injection. */
  html: string | undefined | null;
  className?: string;
  style?: React.CSSProperties;
}

export const RichTextContent: React.FC<RichTextContentProps> = ({
  html,
  className,
  style,
}) => (
  <>
    {/* React 19 dedups by href, so this stylesheet is inserted only once. */}
    <style href={STYLE_ID} precedence="default">
      {RICH_TEXT_CSS}
    </style>
    <div
      className={className ? `puck-rich-text-content ${className}` : 'puck-rich-text-content'}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  </>
);

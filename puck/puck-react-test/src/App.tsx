import React, { useState } from 'react';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { PageManager } from '@commercetools-demo/puck-page-manager';
import { ContentManager } from '@commercetools-demo/puck-content-manager';
import { PuckRenderer } from '@commercetools-demo/puck-renderer';

// ---------------------------------------------------------------------------
// Config from environment variables (.env file)
// ---------------------------------------------------------------------------
const BASE_URL = import.meta.env.VITE_BASE_URL as string;
const PROJECT_KEY = import.meta.env.VITE_PROJECT_KEY as string;
const BUSINESS_UNIT_KEY = import.meta.env.VITE_BUSINESS_UNIT_KEY as string;
const JWT_TOKEN = import.meta.env.VITE_JWT_TOKEN as string;

// ---------------------------------------------------------------------------
// Config warning
// ---------------------------------------------------------------------------
const ConfigWarning: React.FC = () => (
  <div style={{ maxWidth: '600px', margin: '48px auto', padding: '0 24px' }}>
    <Card insetScale="l">
      <Spacings.Stack scale="m">
        <Text.Headline as="h3">Configuration required</Text.Headline>
        <Text.Body>
          Copy <code>.env.example</code> to <code>.env</code> and fill in your API credentials before using this app.
        </Text.Body>
        <pre
          style={{
            background: 'var(--color-neutral-95)',
            border: '1px solid var(--color-neutral-90)',
            borderRadius: 'var(--border-radius-4)',
            padding: '12px',
            fontSize: '12px',
            overflow: 'auto',
            margin: 0,
          }}
        >
          {`VITE_BASE_URL=http://localhost:8080\nVITE_PROJECT_KEY=my-project\nVITE_BUSINESS_UNIT_KEY=my-bu\nVITE_JWT_TOKEN=your-jwt-token`}
        </pre>
      </Spacings.Stack>
    </Card>
  </div>
);

// ---------------------------------------------------------------------------
// Tab nav
// ---------------------------------------------------------------------------
type Tab = 'pages' | 'contents' | 'renderer';

const getInitialTab = (): Tab => {
  const path = window.location.pathname;
  if (path.startsWith('/content')) return 'contents';
  if (path.startsWith('/renderer')) return 'renderer';
  return 'pages';
};

interface TabNavProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, onChange }) => (
  <div
    style={{
      display: 'flex',
      borderBottom: '1px solid var(--color-neutral-90)',
      background: 'var(--color-surface, #fff)',
      padding: '0 24px',
    }}
  >
    {(['pages', 'contents', 'renderer'] as Tab[]).map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        style={{
          padding: '12px 20px',
          border: 'none',
          borderBottom: activeTab === tab
            ? '3px solid var(--color-primary)'
            : '3px solid transparent',
          marginBottom: '-1px',
          background: 'none',
          fontWeight: activeTab === tab ? 600 : 400,
          fontSize: 'var(--font-size-20)',
          color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-neutral-50)',
          cursor: 'pointer',
          fontFamily: 'var(--font-family)',
        }}
      >
        {tab === 'pages' ? 'Pages' : tab === 'contents' ? 'Content Items' : 'Renderer'}
      </button>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Renderer panel
// ---------------------------------------------------------------------------

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '6px 10px',
  borderRadius: '4px',
  border: '1px solid var(--color-neutral-85)',
  fontSize: '13px',
  fontFamily: 'var(--font-family)',
};

const SELECT_STYLE: React.CSSProperties = {
  ...INPUT_STYLE,
  background: '#fff',
  cursor: 'pointer',
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--color-neutral-40)',
  marginBottom: '4px',
  display: 'block',
};

interface RendererPanelProps {
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
}

const RendererPanel: React.FC<RendererPanelProps> = ({ baseURL, projectKey, businessUnitKey }) => {
  const [type, setType] = useState<'page' | 'content'>('page');
  const [mode, setMode] = useState<'published' | 'preview'>('published');
  const [pageKey, setPageKey] = useState('');
  const [slug, setSlug] = useState('');
  const [contentKey, setContentKey] = useState('');
  const [query, setQuery] = useState('');
  const [renderKey, setRenderKey] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRender = () => {
    setRenderKey((k) => k + 1);
    setSubmitted(true);
  };

  const hasTarget = type === 'page'
    ? (pageKey.trim() !== '' || slug.trim() !== '')
    : (contentKey.trim() !== '' || query.trim() !== '');

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      <Spacings.Stack scale="l">
        <Text.Headline as="h1">Renderer</Text.Headline>

        <Card insetScale="l">
          <Spacings.Stack scale="m">
            {/* Type + Mode row */}
            <Spacings.Inline scale="m">
              <div style={{ flex: 1 }}>
                <label style={LABEL_STYLE}>Type</label>
                <select
                  style={SELECT_STYLE}
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value as 'page' | 'content');
                    setSubmitted(false);
                  }}
                >
                  <option value="page">Page</option>
                  <option value="content">Content</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={LABEL_STYLE}>Mode</label>
                <select
                  style={SELECT_STYLE}
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'published' | 'preview')}
                >
                  <option value="published">Published</option>
                  <option value="preview">Preview (draft)</option>
                </select>
              </div>
            </Spacings.Inline>

            {/* Page fields */}
            {type === 'page' && (
              <Spacings.Inline scale="m">
                <div style={{ flex: 1 }}>
                  <label style={LABEL_STYLE}>Page Key</label>
                  <input
                    style={INPUT_STYLE}
                    type="text"
                    placeholder="e.g. home-page"
                    value={pageKey}
                    onChange={(e) => { setPageKey(e.target.value); setSlug(''); setSubmitted(false); }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={LABEL_STYLE}>Slug</label>
                  <input
                    style={INPUT_STYLE}
                    type="text"
                    placeholder="e.g. /home"
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setPageKey(''); setSubmitted(false); }}
                  />
                </div>
              </Spacings.Inline>
            )}

            {/* Content fields */}
            {type === 'content' && (
              <Spacings.Inline scale="m">
                <div style={{ flex: 1 }}>
                  <label style={LABEL_STYLE}>Content Key</label>
                  <input
                    style={INPUT_STYLE}
                    type="text"
                    placeholder="e.g. hero-banner"
                    value={contentKey}
                    onChange={(e) => { setContentKey(e.target.value); setQuery(''); setSubmitted(false); }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={LABEL_STYLE}>Query (content type)</label>
                  <input
                    style={INPUT_STYLE}
                    type="text"
                    placeholder="e.g. hero"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setContentKey(''); setSubmitted(false); }}
                  />
                </div>
              </Spacings.Inline>
            )}

            <div>
              <button
                onClick={handleRender}
                disabled={!hasTarget}
                style={{
                  padding: '8px 20px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-primary)',
                  background: hasTarget ? 'var(--color-primary)' : 'var(--color-neutral-90)',
                  color: hasTarget ? '#fff' : 'var(--color-neutral-60)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: hasTarget ? 'pointer' : 'not-allowed',
                }}
              >
                Render
              </button>
            </div>
          </Spacings.Stack>
        </Card>

        {submitted && hasTarget && (
          <div
            key={renderKey}
            style={{
              border: '1px solid var(--color-neutral-90)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <PuckRenderer
              type={type}
              baseURL={baseURL}
              projectKey={projectKey}
              businessUnitKey={businessUnitKey}
              pageKey={type === 'page' ? (pageKey || undefined) : undefined}
              slug={type === 'page' ? (slug || undefined) : undefined}
              contentKey={type === 'content' ? (contentKey || undefined) : undefined}
              query={type === 'content' ? (query || undefined) : undefined}
              mode={mode}
            />
          </div>
        )}
      </Spacings.Stack>
    </div>
  );
};

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(getInitialTab);

  if (!BASE_URL || !PROJECT_KEY || !BUSINESS_UNIT_KEY) {
    return <ConfigWarning />;
  }

  const sharedProps = {
    baseURL: BASE_URL,
    projectKey: PROJECT_KEY,
    businessUnitKey: BUSINESS_UNIT_KEY,
    jwtToken: JWT_TOKEN,
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    // const base = tab === 'pages' ? '/pages' : '/content';
    // window.history.pushState(null, '', base);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TabNav activeTab={activeTab} onChange={handleTabChange} />
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {activeTab === 'pages' && <PageManager {...sharedProps} parentUrl="/" />}
        {activeTab === 'contents' && <ContentManager {...sharedProps} parentUrl="/" />}
        {activeTab === 'renderer' && (
          <RendererPanel
            baseURL={BASE_URL}
            projectKey={PROJECT_KEY}
            businessUnitKey={BUSINESS_UNIT_KEY}
          />
        )}
      </div>
    </div>
  );
};

export default App;

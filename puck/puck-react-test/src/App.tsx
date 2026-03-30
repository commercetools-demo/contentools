import React, { useState } from 'react';
import { PuckApiProvider } from '@commercetools-demo/puck-api';
import type { PuckContentListItem, PuckPageListItem } from '@commercetools-demo/puck-types';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { puckConfig } from './config/puckConfig';
import { PageListView } from './views/PageListView';
import { EditorView } from './views/EditorView';
import { RendererView } from './views/RendererView';
import { ContentListView } from './views/ContentListView';
import { ContentEditorView } from './views/ContentEditorView';

// ---------------------------------------------------------------------------
// Config from environment variables (.env file)
// ---------------------------------------------------------------------------
const BASE_URL = import.meta.env.VITE_BASE_URL as string;
const PROJECT_KEY = import.meta.env.VITE_PROJECT_KEY as string;
const BUSINESS_UNIT_KEY = import.meta.env.VITE_BUSINESS_UNIT_KEY as string;
const JWT_TOKEN = import.meta.env.VITE_JWT_TOKEN as string;

// ---------------------------------------------------------------------------
// View types
// ---------------------------------------------------------------------------
type View =
  | { type: 'pages' }
  | { type: 'editor'; page: PuckPageListItem }
  | { type: 'preview'; page: PuckPageListItem; mode: 'published' | 'preview' }
  | { type: 'contents' }
  | { type: 'content-editor'; contentItem: PuckContentListItem };

type Tab = 'pages' | 'contents';

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
// Tab nav (only shown on top-level views)
// ---------------------------------------------------------------------------
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
    {(['pages', 'contents'] as Tab[]).map((tab) => (
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
        {tab === 'pages' ? 'Pages' : 'Content Items'}
      </button>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
const App: React.FC = () => {
  const [view, setView] = useState<View>({ type: 'pages' });
  const [activeTab, setActiveTab] = useState<Tab>('pages');

  if (!BASE_URL || !PROJECT_KEY || !BUSINESS_UNIT_KEY) {
    return <ConfigWarning />;
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setView({ type: tab === 'pages' ? 'pages' : 'contents' });
  };

  const goToPages = () => {
    setActiveTab('pages');
    setView({ type: 'pages' });
  };
  const goToEditor = (page: PuckPageListItem) =>
    setView({ type: 'editor', page });
  const goToPreview = (page: PuckPageListItem) =>
    setView({ type: 'preview', page, mode: 'preview' });

  const goToContents = () => {
    setActiveTab('contents');
    setView({ type: 'contents' });
  };
  const goToContentEditor = (item: PuckContentListItem) =>
    setView({ type: 'content-editor', contentItem: item });

  const showTabs = view.type === 'pages' || view.type === 'contents';

  return (
    <PuckApiProvider
      baseURL={BASE_URL}
      projectKey={PROJECT_KEY}
      businessUnitKey={BUSINESS_UNIT_KEY}
      jwtToken={JWT_TOKEN}
    >
      {showTabs && (
        <TabNav activeTab={activeTab} onChange={handleTabChange} />
      )}

      {view.type === 'pages' && (
        <PageListView onEdit={goToEditor} onPreview={goToPreview} />
      )}

      {view.type === 'editor' && (
        <EditorView
          pageKey={view.page.key}
          pageName={view.page.value.name}
          config={puckConfig}
          baseURL={BASE_URL}
          projectKey={PROJECT_KEY}
          businessUnitKey={BUSINESS_UNIT_KEY}
          jwtToken={JWT_TOKEN}
          onBack={goToPages}
        />
      )}

      {view.type === 'preview' && (
        <RendererView
          pageKey={view.page.key}
          pageName={view.page.value.name}
          config={puckConfig}
          baseURL={BASE_URL}
          projectKey={PROJECT_KEY}
          businessUnitKey={BUSINESS_UNIT_KEY}
          mode={view.mode}
          onBack={goToPages}
        />
      )}

      {view.type === 'contents' && (
        <ContentListView
          baseURL={BASE_URL}
          projectKey={PROJECT_KEY}
          businessUnitKey={BUSINESS_UNIT_KEY}
          jwtToken={JWT_TOKEN}
          onEdit={goToContentEditor}
        />
      )}

      {view.type === 'content-editor' && (
        <ContentEditorView
          baseURL={BASE_URL}
          projectKey={PROJECT_KEY}
          businessUnitKey={BUSINESS_UNIT_KEY}
          jwtToken={JWT_TOKEN}
          contentItem={view.contentItem}
          config={puckConfig}
          onBack={goToContents}
        />
      )}
    </PuckApiProvider>
  );
};

export default App;

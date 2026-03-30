import React from 'react';
import { PuckEditor } from '@commercetools-demo/puck-editor';
import type { PuckConfig } from '@commercetools-demo/puck-types';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { AngleLeftIcon } from '@commercetools-uikit/icons';

interface EditorViewProps {
  pageKey: string;
  pageName: string;
  config: PuckConfig;
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
  jwtToken: string;
  onBack: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  pageKey,
  pageName,
  config,
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
  onBack,
}) => (
  <div className="puck-view-wrapper">
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 16px',
        background: 'var(--color-surface, #fff)',
        borderBottom: '1px solid var(--color-neutral-90)',
        zIndex: 10,
      }}
    >
      <FlatButton
        label="Pages"
        icon={<AngleLeftIcon />}
        iconPosition="left"
        onClick={onBack}
      />
      <Text.Body tone="secondary">/</Text.Body>
      <Spacings.Inline scale="xs" alignItems="center">
        <Text.Body isBold>{pageName}</Text.Body>
      </Spacings.Inline>
    </div>

    <div style={{ flex: 1, overflow: 'hidden' }}>
      <PuckEditor
        baseURL={baseURL}
        projectKey={projectKey}
        businessUnitKey={businessUnitKey}
        jwtToken={jwtToken}
        pageKey={pageKey}
        config={config}
        onPublish={() => {}}
        onError={(err) => { console.error('[PuckEditor] error:', err); }}
      />
    </div>
  </div>
);

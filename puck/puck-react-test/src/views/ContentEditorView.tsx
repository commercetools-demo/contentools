import React from 'react';
import { ContentEditor } from '@commercetools-demo/puck-content-manager';
import type { PuckContentListItem } from '@commercetools-demo/puck-types';
import type { Config } from '@measured/puck';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { AngleLeftIcon } from '@commercetools-uikit/icons';

interface ContentEditorViewProps {
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
  jwtToken: string;
  contentItem: PuckContentListItem;
  config: Config;
  onBack: () => void;
}

export const ContentEditorView: React.FC<ContentEditorViewProps> = ({
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
  contentItem,
  config,
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
        label="Content Items"
        icon={<AngleLeftIcon />}
        iconPosition="left"
        onClick={onBack}
      />
      <Text.Body tone="secondary">/</Text.Body>
      <Spacings.Inline scale="s" alignItems="center">
        <Text.Body isBold>{contentItem.value.name}</Text.Body>
        <span
          style={{
            background: 'var(--color-neutral-95)',
            color: 'var(--color-neutral-50)',
            border: '1px solid var(--color-neutral-85)',
            padding: '2px 8px',
            borderRadius: 'var(--border-radius-20)',
            fontSize: 'var(--font-size-10)',
            fontWeight: 'var(--font-weight-500)',
          }}
        >
          {contentItem.value.contentType}
        </span>
      </Spacings.Inline>
    </div>

    <div style={{ flex: 1, overflow: 'hidden' }}>
      <ContentEditor
        baseURL={baseURL}
        projectKey={projectKey}
        businessUnitKey={businessUnitKey}
        jwtToken={jwtToken}
        contentKey={contentItem.key}
        config={config}
        onError={(err) => { console.error('[ContentEditor] error:', err); }}
      />
    </div>
  </div>
);

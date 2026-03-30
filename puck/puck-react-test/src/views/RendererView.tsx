import React from 'react';
import { PuckRenderer } from '@commercetools-demo/puck-renderer';
import type { PuckConfig } from '@commercetools-demo/puck-types';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { AngleLeftIcon } from '@commercetools-uikit/icons';

interface RendererViewProps {
  pageKey: string;
  pageName: string;
  config: PuckConfig;
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
  mode?: 'published' | 'preview';
  onBack: () => void;
}

export const RendererView: React.FC<RendererViewProps> = ({
  pageKey,
  pageName,
  config,
  baseURL,
  projectKey,
  businessUnitKey,
  mode = 'preview',
  onBack,
}) => {
  const modeBadgeStyle: React.CSSProperties =
    mode === 'published'
      ? { background: 'var(--color-success-95)', color: 'var(--color-success-40)', border: '1px solid var(--color-success-85)' }
      : { background: 'var(--color-primary-95)', color: 'var(--color-primary-25)', border: '1px solid var(--color-primary-85)' };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          background: 'var(--color-surface, #fff)',
          borderBottom: '1px solid var(--color-neutral-90)',
        }}
      >
        <FlatButton
          label="Back"
          icon={<AngleLeftIcon />}
          iconPosition="left"
          onClick={onBack}
        />
        <Text.Body tone="secondary">/</Text.Body>
        <Text.Body isBold>{pageName}</Text.Body>
        <Spacings.Inline scale="s" alignItems="center" justifyContent="flex-end">
          <span
            style={{
              ...modeBadgeStyle,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 10px',
              borderRadius: 'var(--border-radius-20)',
              fontSize: 'var(--font-size-10)',
              fontWeight: 'var(--font-weight-600)',
            }}
          >
            {mode === 'published' ? 'Published' : 'Preview'}
          </span>
        </Spacings.Inline>
      </div>

      <PuckRenderer
        baseURL={baseURL}
        projectKey={projectKey}
        businessUnitKey={businessUnitKey}
        pageKey={pageKey}
        mode={mode}
        config={config}
      />
    </div>
  );
};

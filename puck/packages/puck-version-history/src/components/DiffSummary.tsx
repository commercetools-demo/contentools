import React from 'react';
import type { PuckDataDiff } from '../types';
import Stamp from '@commercetools-uikit/stamp';
import { Tag } from '@commercetools-uikit/tag';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import Card from '@commercetools-uikit/card';
interface DiffSummaryProps {
  diff: PuckDataDiff;
}

type StatusTone = 'positive' | 'critical' | 'warning';

const STATUS_META: Record<string, { tone: StatusTone; label: string }> = {
  added:   { tone: 'positive',  label: 'Added' },
  removed: { tone: 'critical',  label: 'Removed' },
  changed: { tone: 'warning',   label: 'Changed' },
};

/**
 * Renders a compact diff summary listing which components changed, were
 * added, or were removed between the selected historical version and the
 * current draft.
 */
export const DiffSummary: React.FC<DiffSummaryProps> = ({ diff }) => {
  if (!diff.hasChanges) {
    return (
      <Text.Body tone="secondary">No differences from current version</Text.Body>
    );
  }

  return (
    <Spacings.Stack scale="s">
      <Text.Detail isBold>Changes vs current</Text.Detail>

      {diff.components.map((c) => {
        const meta = STATUS_META[c.status];
        return (
          <Card
            key={c.id}
           
          >
            <Spacings.Stack scale="xs">
              <Spacings.Inline scale="s" alignItems="center">
                <Text.Detail isBold>{c.type}</Text.Detail>
                <Stamp tone={meta.tone} label={meta.label} isCondensed />
              </Spacings.Inline>

              {c.status === 'changed' && c.changedProps.length > 0 && (
                <div style={{ paddingLeft: '4px', display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                  {c.changedProps.map((prop) => (
                    <Tag key={prop} type="normal">{prop}</Tag>
                  ))}
                </div>
              )}
            </Spacings.Stack>
          </Card>
        );
      })}

      {diff.rootChanges.length > 0 && (
        <Card
       
        >
          <Spacings.Stack scale="xs">
            <Spacings.Inline scale="s" alignItems="center">
              <Text.Detail isBold>Root</Text.Detail>
              <Stamp tone="warning" label="Changed" isCondensed />
            </Spacings.Inline>
            <div style={{ paddingLeft: '4px', display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
              {diff.rootChanges.map((prop) => (
                <Tag key={prop} type="normal">{prop}</Tag>
              ))}
            </div>
          </Spacings.Stack>
        </Card>
      )}
    </Spacings.Stack>
  );
};

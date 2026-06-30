import React from 'react';
import type { PuckDataDiff } from '../types';
import { Badge, Card, Stack, Text } from '@commercetools/nimbus';

interface DiffSummaryProps {
  diff: PuckDataDiff;
}

type StatusPalette = 'positive' | 'critical' | 'warning';

const STATUS_META: Record<string, { colorPalette: StatusPalette; label: string }> = {
  added:   { colorPalette: 'positive', label: 'Added' },
  removed: { colorPalette: 'critical', label: 'Removed' },
  changed: { colorPalette: 'warning',  label: 'Changed' },
};

/**
 * Renders a compact diff summary listing which components changed, were
 * added, or were removed between the selected historical version and the
 * current draft.
 */
export const DiffSummary: React.FC<DiffSummaryProps> = ({ diff }) => {
  if (!diff.hasChanges) {
    return <Text color="neutral.11">No differences from current version</Text>;
  }

  return (
    <Stack direction="column" gap="200">
      <Text fontSize="sm" fontWeight="700">Changes vs current</Text>

      {diff.components.map((c) => {
        const meta = STATUS_META[c.status];
        return (
          <Card.Root key={c.id} variant="outlined" size="sm">
            <Card.Body>
              <Stack direction="column" gap="100">
                <Stack direction="row" gap="200" alignItems="center">
                  <Text fontSize="sm" fontWeight="700">{c.type}</Text>
                  <Badge colorPalette={meta.colorPalette} size="xs">{meta.label}</Badge>
                </Stack>

                {c.status === 'changed' && c.changedProps.length > 0 && (
                  <Stack direction="row" gap="100" wrap="wrap" paddingLeft="100">
                    {c.changedProps.map((prop) => (
                      <Badge key={prop} colorPalette="neutral" size="xs">{prop}</Badge>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Card.Body>
          </Card.Root>
        );
      })}

      {diff.rootChanges.length > 0 && (
        <Card.Root variant="outlined" size="sm">
          <Card.Body>
            <Stack direction="column" gap="100">
              <Stack direction="row" gap="200" alignItems="center">
                <Text fontSize="sm" fontWeight="700">Root</Text>
                <Badge colorPalette="warning" size="xs">Changed</Badge>
              </Stack>
              <Stack direction="row" gap="100" wrap="wrap" paddingLeft="100">
                {diff.rootChanges.map((prop) => (
                  <Badge key={prop} colorPalette="neutral" size="xs">{prop}</Badge>
                ))}
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  );
};

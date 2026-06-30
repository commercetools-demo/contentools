import React, { useState } from 'react';
import type { ThemeTokens } from '@commercetools-demo/puck-types';
import { Button, Stack } from '@commercetools/nimbus';
import {
  themePresets,
  paradigmLabels,
  PRESET_KEYS_SELECTOR,
  type DesignParadigm,
} from '../presets';

const PRESET_OPTIONS = [
  { value: '', label: 'Choose a preset…' },
  ...PRESET_KEYS_SELECTOR.map((key: DesignParadigm) => ({
    value: key,
    label: paradigmLabels[key],
  })),
];

const SELECT_STYLE: React.CSSProperties = {
  display: 'block',
  padding: '6px 8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
  background: '#fff',
  cursor: 'pointer',
};

interface ThemePresetSelectorProps {
  onSelectPreset: (tokens: ThemeTokens) => void;
}

const ThemePresetSelector: React.FC<ThemePresetSelectorProps> = ({
  onSelectPreset,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('');

  const handleApply = () => {
    if (selectedKey && selectedKey in themePresets) {
      onSelectPreset(themePresets[selectedKey as DesignParadigm]);
    }
  };

  return (
    <Stack direction="column" gap="200">
      <label
        htmlFor="theme-preset-select"
        style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 600 }}
      >
        Quick apply preset
      </label>
      <Stack direction="row" gap="200" alignItems="center">
        <select
          id="theme-preset-select"
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          style={SELECT_STYLE}
        >
          {PRESET_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <Button variant="solid" onPress={handleApply} isDisabled={!selectedKey}>
          Apply
        </Button>
      </Stack>
    </Stack>
  );
};

export default ThemePresetSelector;

import React, { useState } from 'react';
import type { ThemeTokens } from '@commercetools-demo/puck-types';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import FieldLabel from '@commercetools-uikit/field-label';
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
    <Spacings.Stack scale="s">
      <FieldLabel title="Quick apply preset" htmlFor="theme-preset-select" />
      <Spacings.Inline scale="s" alignItems="center">
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
        <PrimaryButton
          label="Apply"
          onClick={handleApply}
          isDisabled={!selectedKey}
        />
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

export default ThemePresetSelector;

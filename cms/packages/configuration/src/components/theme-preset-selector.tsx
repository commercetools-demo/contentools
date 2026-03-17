import React, { useState } from 'react';
import { ThemeTokens } from '@commercetools-demo/contentools-types';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SelectInput from '@commercetools-uikit/select-input';
import Spacings from '@commercetools-uikit/spacings';
import FieldLabel from '@commercetools-uikit/field-label';
import {
  themePresets,
  paradigmLabels,
  PRESET_KEYS_SELECTOR,
  DesignParadigm,
} from '../presets';

const PRESET_OPTIONS = [
  { value: '', label: 'Choose a preset…' },
  ...PRESET_KEYS_SELECTOR.map((key: DesignParadigm) => ({
    value: key,
    label: paradigmLabels[key],
  })),
];

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
        <SelectInput
          id="theme-preset-select"
          value={selectedKey}
          onChange={(e) => {
            const v = e.target.value;
            setSelectedKey(typeof v === 'string' ? v : Array.isArray(v) ? v[0] ?? '' : '');
          }}
          options={PRESET_OPTIONS}
        />
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

import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useConfigurationState } from '@commercetools-demo/contentools-state';
import { ThemeTokens } from '@commercetools-demo/contentools-types';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import FieldLabel from '@commercetools-uikit/field-label';
import NumberInput from '@commercetools-uikit/number-input';
import SelectInput from '@commercetools-uikit/select-input';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextInput from '@commercetools-uikit/text-input';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import styled from 'styled-components';
import { DEFAULT_THEME } from '../constants';
import Grid from '@commercetools-uikit/grid';

const BORDER_RADIUS_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'full', label: 'Full' },
];

const BORDER_WIDTH_OPTIONS = [
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
];

const BUTTON_STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'outline', label: 'Outline' },
  { value: 'ghost', label: 'Ghost' },
];

const CARD_SHADOW_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

const HEADER_STYLE_OPTIONS = [
  { value: 'transparent', label: 'Transparent' },
  { value: 'solid', label: 'Solid' },
  { value: 'minimal', label: 'Minimal' },
];

interface Props {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormSection = styled(Grid.Item)`
  margin-bottom: 1.5rem;
`;

const ThemeEditor: React.FC<Props> = ({
  baseURL,
  businessUnitKey,
  backButton,
}) => {
  const hydratedUrl = `${baseURL}/${businessUnitKey}`;
  const history = useHistory();
  const {
    theme,
    loading,
    error,
    fetchTheme,
    saveTheme,
    updateTheme,
    clearError,
  } = useConfigurationState();

  const [formValues, setFormValues] = useState<ThemeTokens>(DEFAULT_THEME);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const applyThemeToForm = useCallback((t: ThemeTokens | null | undefined) => {
    if (t == null || typeof t !== 'object') {
      setFormValues(DEFAULT_THEME);
      return;
    }
    setFormValues({
      ...DEFAULT_THEME,
      ...t,
      colorPrimary: t.colorPrimary ?? DEFAULT_THEME.colorPrimary,
      colorPrimaryHover: t.colorPrimaryHover ?? DEFAULT_THEME.colorPrimaryHover,
      colorSecondary: t.colorSecondary ?? DEFAULT_THEME.colorSecondary,
      colorBackground: t.colorBackground ?? DEFAULT_THEME.colorBackground,
      colorSurface: t.colorSurface ?? DEFAULT_THEME.colorSurface,
      colorText: t.colorText ?? DEFAULT_THEME.colorText,
      colorTextMuted: t.colorTextMuted ?? DEFAULT_THEME.colorTextMuted,
      borderRadius: t.borderRadius ?? DEFAULT_THEME.borderRadius,
      borderWidth: t.borderWidth ?? DEFAULT_THEME.borderWidth,
      fontFamily: t.fontFamily ?? DEFAULT_THEME.fontFamily,
      fontHeading: t.fontHeading ?? DEFAULT_THEME.fontHeading,
      spacingScale:
        typeof t.spacingScale === 'number'
          ? t.spacingScale
          : DEFAULT_THEME.spacingScale,
      buttonStyle: t.buttonStyle ?? DEFAULT_THEME.buttonStyle,
      cardShadow: t.cardShadow ?? DEFAULT_THEME.cardShadow,
      headerStyle: t.headerStyle ?? DEFAULT_THEME.headerStyle,
      // Extended optional ThemeTokens
      colorPrimaryForeground: t.colorPrimaryForeground ?? undefined,
      colorSecondaryForeground: t.colorSecondaryForeground ?? undefined,
      colorForeground: t.colorForeground ?? undefined,
      colorMuted: t.colorMuted ?? undefined,
      colorMutedForeground: t.colorMutedForeground ?? undefined,
      colorDestructive: t.colorDestructive ?? undefined,
      colorDestructiveForeground: t.colorDestructiveForeground ?? undefined,
      colorAccent: t.colorAccent ?? undefined,
      colorAccentForeground: t.colorAccentForeground ?? undefined,
      colorBorder: t.colorBorder ?? undefined,
      colorInput: t.colorInput ?? undefined,
      colorRing: t.colorRing ?? undefined,
    });
  }, []);

  useEffect(() => {
    fetchTheme(hydratedUrl);
  }, [fetchTheme]);

  useEffect(() => {
    applyThemeToForm(theme);
  }, [theme, applyThemeToForm]);

  const handleChange = useCallback(
    <K extends keyof ThemeTokens>(key: K, value: ThemeTokens[K]) => {
      setFormValues((prev) => ({ ...prev, [key]: value }));
      setSaveSuccess(false);
    },
    []
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveSuccess(false);
    clearError();
    try {
      await saveTheme(hydratedUrl, formValues);
      setSaveSuccess(true);
    } finally {
      setSaving(false);
    }
  }, [formValues, saveTheme, clearError]);

  const handleResetToDefault = useCallback(async () => {
    setFormValues(DEFAULT_THEME);
    setSaveSuccess(false);
    if (theme != null) {
      setSaving(true);
      clearError();
      try {
        await updateTheme(hydratedUrl, DEFAULT_THEME);
        setSaveSuccess(true);
      } finally {
        setSaving(false);
      }
    }
  }, [theme, updateTheme, clearError]);

  if (loading && theme == null) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Spacings.Stack scale="l">
      {backButton && (
        <FlatButton
          onClick={() => history.push('/')}
          label={backButton.label}
          icon={backButton.icon as React.ReactElement}
        >
          {backButton.label}
        </FlatButton>
      )}
      <Text.Headline as="h1">Theme</Text.Headline>
      <Text.Body tone="secondary">
        Customize colors, typography, spacing, and component styles.
      </Text.Body>

      {error && (
        <Card>
          <Spacings.Stack scale="m">
            <Text.Headline as="h2">Error</Text.Headline>
            <Text.Body tone="critical">{error}</Text.Body>
          </Spacings.Stack>
        </Card>
      )}

      {saveSuccess && (
        <Text.Body tone="positive">Theme saved successfully.</Text.Body>
      )}

      <Card>
        <Spacings.Stack scale="xl">
          <Text.Headline as="h2">Colors</Text.Headline>
          <Grid
            gridGap="16px"
            gridAutoColumns="1fr"
            gridTemplateColumns="repeat(4, 1fr)"
          >
            <FormSection>
              <FieldLabel title="Primary" htmlFor="colorPrimary" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorPrimary"
                  value={formValues.colorPrimary}
                  onChange={(e) => handleChange('colorPrimary', e.target.value)}
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorPrimary}
                  onChange={(e) => handleChange('colorPrimary', e.target.value)}
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Primary Hover" htmlFor="colorPrimaryHover" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorPrimaryHover"
                  value={formValues.colorPrimaryHover}
                  onChange={(e) =>
                    handleChange('colorPrimaryHover', e.target.value)
                  }
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorPrimaryHover}
                  onChange={(e) =>
                    handleChange('colorPrimaryHover', e.target.value)
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Secondary" htmlFor="colorSecondary" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorSecondary"
                  value={formValues.colorSecondary}
                  onChange={(e) =>
                    handleChange('colorSecondary', e.target.value)
                  }
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorSecondary}
                  onChange={(e) =>
                    handleChange('colorSecondary', e.target.value)
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Background" htmlFor="colorBackground" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorBackground"
                  value={formValues.colorBackground}
                  onChange={(e) =>
                    handleChange('colorBackground', e.target.value)
                  }
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorBackground}
                  onChange={(e) =>
                    handleChange('colorBackground', e.target.value)
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Surface" htmlFor="colorSurface" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorSurface"
                  value={formValues.colorSurface}
                  onChange={(e) => handleChange('colorSurface', e.target.value)}
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorSurface}
                  onChange={(e) => handleChange('colorSurface', e.target.value)}
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Text" htmlFor="colorText" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorText"
                  value={formValues.colorText}
                  onChange={(e) => handleChange('colorText', e.target.value)}
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorText}
                  onChange={(e) => handleChange('colorText', e.target.value)}
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Text Muted" htmlFor="colorTextMuted" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorTextMuted"
                  value={formValues.colorTextMuted}
                  onChange={(e) =>
                    handleChange('colorTextMuted', e.target.value)
                  }
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorTextMuted}
                  onChange={(e) =>
                    handleChange('colorTextMuted', e.target.value)
                  }
                />
              </Spacings.Inline>
            </FormSection>
          </Grid>

          <Text.Headline as="h2">Extended colors</Text.Headline>
          <Text.Body tone="secondary">
            Optional theme tokens for foregrounds, muted, destructive, accent,
            border, input, and ring.
          </Text.Body>
          <Grid
            gridGap="16px"
            gridAutoColumns="1fr"
            gridTemplateColumns="repeat(4, 1fr)"
          >
            <FormSection>
              <FieldLabel
                title="Primary Foreground"
                htmlFor="colorPrimaryForeground"
              />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorPrimaryForeground"
                  value={formValues.colorPrimaryForeground || '#000000'}
                  onChange={(e) =>
                    handleChange('colorPrimaryForeground', e.target.value)
                  }
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorPrimaryForeground ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'colorPrimaryForeground',
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel
                title="Secondary Foreground"
                htmlFor="colorSecondaryForeground"
              />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorSecondaryForeground"
                  value={formValues.colorSecondaryForeground || '#000000'}
                  onChange={(e) =>
                    handleChange('colorSecondaryForeground', e.target.value)
                  }
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorSecondaryForeground ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'colorSecondaryForeground',
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Foreground" htmlFor="colorForeground" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorForeground"
                  value={formValues.colorForeground || '#000000'}
                  onChange={(e) =>
                    handleChange('colorForeground', e.target.value)
                  }
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorForeground ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'colorForeground',
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Muted" htmlFor="colorMuted" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorMuted"
                  value={formValues.colorMuted || '#000000'}
                  onChange={(e) => handleChange('colorMuted', e.target.value)}
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorMuted ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'colorMuted',
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel
                title="Muted Foreground"
                htmlFor="colorMutedForeground"
              />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorMutedForeground"
                  value={formValues.colorMutedForeground || '#000000'}
                  onChange={(e) =>
                    handleChange('colorMutedForeground', e.target.value)
                  }
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorMutedForeground ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'colorMutedForeground',
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Destructive" htmlFor="colorDestructive" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorDestructive"
                  value={formValues.colorDestructive || '#000000'}
                  onChange={(e) =>
                    handleChange('colorDestructive', e.target.value)
                  }
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorDestructive ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'colorDestructive',
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel
                title="Destructive Foreground"
                htmlFor="colorDestructiveForeground"
              />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorDestructiveForeground"
                  value={formValues.colorDestructiveForeground || '#000000'}
                  onChange={(e) =>
                    handleChange('colorDestructiveForeground', e.target.value)
                  }
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorDestructiveForeground ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'colorDestructiveForeground',
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Accent" htmlFor="colorAccent" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorAccent"
                  value={formValues.colorAccent || '#000000'}
                  onChange={(e) => handleChange('colorAccent', e.target.value)}
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorAccent ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'colorAccent',
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel
                title="Accent Foreground"
                htmlFor="colorAccentForeground"
              />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorAccentForeground"
                  value={formValues.colorAccentForeground || '#000000'}
                  onChange={(e) =>
                    handleChange('colorAccentForeground', e.target.value)
                  }
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorAccentForeground ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'colorAccentForeground',
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Border" htmlFor="colorBorder" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorBorder"
                  value={formValues.colorBorder || '#000000'}
                  onChange={(e) => handleChange('colorBorder', e.target.value)}
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorBorder ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'colorBorder',
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Input" htmlFor="colorInput" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorInput"
                  value={formValues.colorInput || '#000000'}
                  onChange={(e) => handleChange('colorInput', e.target.value)}
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorInput ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'colorInput',
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </Spacings.Inline>
            </FormSection>
            <FormSection>
              <FieldLabel title="Ring" htmlFor="colorRing" />
              <Spacings.Inline alignItems="center" scale="s">
                <input
                  type="color"
                  id="colorRing"
                  value={formValues.colorRing || '#000000'}
                  onChange={(e) => handleChange('colorRing', e.target.value)}
                  style={{ width: 40, height: 32, cursor: 'pointer' }}
                />
                <TextInput
                  value={formValues.colorRing ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'colorRing',
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </Spacings.Inline>
            </FormSection>
          </Grid>

          <Text.Headline as="h2">Typography</Text.Headline>
          <Grid
            gridGap="16px"
            gridAutoColumns="1fr"
            gridTemplateColumns="repeat(4, 1fr)"
          >
            <FormSection>
              <FieldLabel title="Font Family" htmlFor="fontFamily" />
              <TextInput
                id="fontFamily"
                value={formValues.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
              />
            </FormSection>
            <FormSection>
              <FieldLabel title="Heading Font" htmlFor="fontHeading" />
              <TextInput
                id="fontHeading"
                value={formValues.fontHeading}
                onChange={(e) => handleChange('fontHeading', e.target.value)}
              />
            </FormSection>
          </Grid>

          <Text.Headline as="h2">Layout &amp; Components</Text.Headline>
          <Grid
            gridGap="16px"
            gridAutoColumns="1fr"
            gridTemplateColumns="repeat(4, 1fr)"
          >
            <FormSection>
              <FieldLabel title="Spacing Scale" htmlFor="spacingScale" />
              <NumberInput
                id="spacingScale"
                value={formValues.spacingScale}
                onChange={(e) =>
                  handleChange(
                    'spacingScale',
                    e.target.value === '' ? 0 : Number(e.target.value)
                  )
                }
              />
            </FormSection>
            <FormSection>
              <FieldLabel title="Border Radius" htmlFor="borderRadius" />
              <SelectInput
                id="borderRadius"
                value={formValues.borderRadius}
                onChange={(e) =>
                  handleChange(
                    'borderRadius',
                    e.target.value as ThemeTokens['borderRadius']
                  )
                }
                options={BORDER_RADIUS_OPTIONS}
              />
            </FormSection>
            <FormSection>
              <FieldLabel title="Border Width" htmlFor="borderWidth" />
              <SelectInput
                id="borderWidth"
                value={formValues.borderWidth}
                onChange={(e) =>
                  handleChange(
                    'borderWidth',
                    e.target.value as ThemeTokens['borderWidth']
                  )
                }
                options={BORDER_WIDTH_OPTIONS}
              />
            </FormSection>
            <FormSection>
              <FieldLabel title="Button Style" htmlFor="buttonStyle" />
              <SelectInput
                id="buttonStyle"
                value={formValues.buttonStyle}
                onChange={(e) =>
                  handleChange(
                    'buttonStyle',
                    e.target.value as ThemeTokens['buttonStyle']
                  )
                }
                options={BUTTON_STYLE_OPTIONS}
              />
            </FormSection>
            <FormSection>
              <FieldLabel title="Card Shadow" htmlFor="cardShadow" />
              <SelectInput
                id="cardShadow"
                value={formValues.cardShadow}
                onChange={(e) =>
                  handleChange(
                    'cardShadow',
                    e.target.value as ThemeTokens['cardShadow']
                  )
                }
                options={CARD_SHADOW_OPTIONS}
              />
            </FormSection>
            <FormSection>
              <FieldLabel title="Header Style" htmlFor="headerStyle" />
              <SelectInput
                id="headerStyle"
                value={formValues.headerStyle}
                onChange={(e) =>
                  handleChange(
                    'headerStyle',
                    e.target.value as ThemeTokens['headerStyle']
                  )
                }
                options={HEADER_STYLE_OPTIONS}
              />
            </FormSection>
          </Grid>

          <Spacings.Inline>
            <PrimaryButton
              label={saving ? 'Saving…' : 'Save'}
              onClick={handleSave}
              isDisabled={saving}
            />
            <SecondaryButton
              label="Reset to default"
              onClick={handleResetToDefault}
              isDisabled={saving}
            />
          </Spacings.Inline>
        </Spacings.Stack>
      </Card>
    </Spacings.Stack>
  );
};

export default ThemeEditor;

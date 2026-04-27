import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { usePuckConfiguration } from '@commercetools-demo/puck-api';
import type { ThemeTokens } from '@commercetools-demo/puck-types';
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
import Grid from '@commercetools-uikit/grid';
import { DEFAULT_THEME } from '../constants';
import ThemePresetSelector from './theme-preset-selector';

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

const SHADOW_STYLE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'soft', label: 'Soft' },
  { value: 'hard-offset', label: 'Hard offset' },
  { value: 'neumorphic', label: 'Neumorphic' },
  { value: 'clay', label: 'Clay' },
  { value: 'glow', label: 'Glow' },
];

const SURFACE_BLUR_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

const FONT_WEIGHT_BASE_OPTIONS = [
  { value: '300', label: '300' },
  { value: '400', label: '400' },
  { value: '500', label: '500' },
];

const FONT_WEIGHT_HEADING_OPTIONS = [
  { value: '400', label: '400' },
  { value: '500', label: '500' },
  { value: '700', label: '700' },
  { value: '900', label: '900' },
];

const LETTER_SPACING_OPTIONS = [
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Wide' },
  { value: 'wider', label: 'Wider' },
];

const TEXT_TRANSFORM_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'Uppercase' },
];

const BORDER_STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'double', label: 'Double' },
];

const BACKGROUND_STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'noise', label: 'Noise' },
];

interface Props {
  parentUrl?: string;
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
}

const ThemeEditor: React.FC<Props> = ({ backButton }) => {
  const history = useHistory();
  const {
    theme,
    loading,
    error,
    fetchTheme,
    saveTheme,
    updateTheme,
    clearError,
  } = usePuckConfiguration();

  const [formValues, setFormValues] = useState<ThemeTokens>(DEFAULT_THEME);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);

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
      colorShadowLight: t.colorShadowLight ?? DEFAULT_THEME.colorShadowLight,
      colorShadowDark: t.colorShadowDark ?? DEFAULT_THEME.colorShadowDark,
      colorSurfaceGlass: t.colorSurfaceGlass ?? DEFAULT_THEME.colorSurfaceGlass,
      shadowStyle: t.shadowStyle ?? DEFAULT_THEME.shadowStyle,
      surfaceBlur: t.surfaceBlur ?? DEFAULT_THEME.surfaceBlur,
      surfaceOpacity:
        typeof t.surfaceOpacity === 'number'
          ? t.surfaceOpacity
          : DEFAULT_THEME.surfaceOpacity,
      fontWeightBase: t.fontWeightBase ?? DEFAULT_THEME.fontWeightBase,
      fontWeightHeading: t.fontWeightHeading ?? DEFAULT_THEME.fontWeightHeading,
      letterSpacing: t.letterSpacing ?? DEFAULT_THEME.letterSpacing,
      textTransform: t.textTransform ?? DEFAULT_THEME.textTransform,
      borderStyle: t.borderStyle ?? DEFAULT_THEME.borderStyle,
      backgroundStyle: t.backgroundStyle ?? DEFAULT_THEME.backgroundStyle,
    });
  }, []);

  useEffect(() => {
    void fetchTheme();
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
      await saveTheme(formValues);
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
        await updateTheme(DEFAULT_THEME);
        setSaveSuccess(true);
      } finally {
        setSaving(false);
      }
    }
  }, [theme, updateTheme, clearError]);

  if (loading && theme == null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Spacings.Stack scale="l">
      {backButton && (
        <FlatButton
          onClick={() => history.push('/')}
          label={backButton.label}
          icon={backButton.icon as any}
        >
          {backButton.label}
        </FlatButton>
      )}
      <div style={{ padding: '0 20px' }}>
        <Spacings.Stack scale="l" alignItems="flex-start">
          <Text.Headline as="h1">Theme</Text.Headline>
          <Text.Body tone="secondary">
            Customize colors, typography, spacing, and component styles.
          </Text.Body>
        </Spacings.Stack>
      </div>
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

      <Spacings.Stack scale="l">
        <div style={{ padding: '0 20px' }}>
          <Spacings.Inline scale="s">
            <ThemePresetSelector onSelectPreset={applyThemeToForm} />
          </Spacings.Inline>
        </div>
        <Spacings.Stack scale="s">
          <div style={{ padding: '0 20px' }}>
            <button
              type="button"
              onClick={() => setIsConfigExpanded((prev) => !prev)}
              aria-expanded={isConfigExpanded}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '12px 16px',
                margin: 0,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                font: 'inherit',
                textAlign: 'left',
                background: 'transparent',
              }}
            >
              <Text.Headline as="h2">Theme configuration</Text.Headline>
              <span
                style={{
                  display: 'inline-block',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '6px solid currentColor',
                  transform: isConfigExpanded ? 'rotate(180deg)' : 'none',
                  opacity: 0.7,
                }}
              />
            </button>
          </div>
          {isConfigExpanded && (
            <div style={{ padding: '0 20px' }}>
              <Spacings.Stack scale="l">
                <Spacings.Stack scale="xl">
                  <Text.Headline as="h2">Colors</Text.Headline>
                  <Grid
                    gridGap="16px"
                    gridAutoColumns="1fr"
                    gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                  >
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Primary" htmlFor="colorPrimary" />
                        <Spacings.Inline alignItems="center" scale="s">
                          <input
                            type="color"
                            id="colorPrimary"
                            value={formValues.colorPrimary}
                            onChange={(e) =>
                              handleChange('colorPrimary', e.target.value)
                            }
                            style={{ width: 40, height: 32, cursor: 'pointer' }}
                          />
                          <TextInput
                            value={formValues.colorPrimary}
                            onChange={(e) =>
                              handleChange('colorPrimary', e.target.value)
                            }
                            horizontalConstraint={3}
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel
                          title="Primary Hover"
                          htmlFor="colorPrimaryHover"
                        />
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
                            horizontalConstraint={3}
                            value={formValues.colorPrimaryHover}
                            onChange={(e) =>
                              handleChange('colorPrimaryHover', e.target.value)
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
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
                            horizontalConstraint={3}
                            value={formValues.colorSecondary}
                            onChange={(e) =>
                              handleChange('colorSecondary', e.target.value)
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel
                          title="Background"
                          htmlFor="colorBackground"
                        />
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
                            horizontalConstraint={3}
                            value={formValues.colorBackground}
                            onChange={(e) =>
                              handleChange('colorBackground', e.target.value)
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Surface" htmlFor="colorSurface" />
                        <Spacings.Inline alignItems="center" scale="s">
                          <input
                            type="color"
                            id="colorSurface"
                            value={formValues.colorSurface}
                            onChange={(e) =>
                              handleChange('colorSurface', e.target.value)
                            }
                            style={{ width: 40, height: 32, cursor: 'pointer' }}
                          />
                          <TextInput
                            horizontalConstraint={3}
                            value={formValues.colorSurface}
                            onChange={(e) =>
                              handleChange('colorSurface', e.target.value)
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Text" htmlFor="colorText" />
                        <Spacings.Inline alignItems="center" scale="s">
                          <input
                            type="color"
                            id="colorText"
                            value={formValues.colorText}
                            onChange={(e) =>
                              handleChange('colorText', e.target.value)
                            }
                            style={{ width: 40, height: 32, cursor: 'pointer' }}
                          />
                          <TextInput
                            horizontalConstraint={3}
                            value={formValues.colorText}
                            onChange={(e) =>
                              handleChange('colorText', e.target.value)
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
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
                            horizontalConstraint={3}
                            value={formValues.colorTextMuted}
                            onChange={(e) =>
                              handleChange('colorTextMuted', e.target.value)
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                  </Grid>

                  <Text.Headline as="h2">Extended colors</Text.Headline>
                  <Text.Body tone="secondary">
                    Optional theme tokens for foregrounds, muted, destructive,
                    accent, border, input, and ring.
                  </Text.Body>
                  <Grid
                    gridGap="16px"
                    gridAutoColumns="1fr"
                    gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                  >
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
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
                            horizontalConstraint={3}
                            value={formValues.colorPrimaryForeground ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorPrimaryForeground',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
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
                            horizontalConstraint={3}
                            value={formValues.colorSecondaryForeground ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorSecondaryForeground',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
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
                            horizontalConstraint={3}
                            value={formValues.colorForeground ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorForeground',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Muted" htmlFor="colorMuted" />
                        <Spacings.Inline alignItems="center" scale="s">
                          <input
                            type="color"
                            id="colorMuted"
                            value={formValues.colorMuted || '#000000'}
                            onChange={(e) =>
                              handleChange('colorMuted', e.target.value)
                            }
                            style={{ width: 40, height: 32, cursor: 'pointer' }}
                          />
                          <TextInput
                            horizontalConstraint={3}
                            value={formValues.colorMuted ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorMuted',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
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
                            horizontalConstraint={3}
                            value={formValues.colorMutedForeground ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorMutedForeground',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
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
                            horizontalConstraint={3}
                            value={formValues.colorDestructive ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorDestructive',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
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
                            horizontalConstraint={3}
                            value={formValues.colorDestructiveForeground ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorDestructiveForeground',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Accent" htmlFor="colorAccent" />
                        <Spacings.Inline alignItems="center" scale="s">
                          <input
                            type="color"
                            id="colorAccent"
                            value={formValues.colorAccent || '#000000'}
                            onChange={(e) =>
                              handleChange('colorAccent', e.target.value)
                            }
                            style={{ width: 40, height: 32, cursor: 'pointer' }}
                          />
                          <TextInput
                            horizontalConstraint={3}
                            value={formValues.colorAccent ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorAccent',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
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
                            horizontalConstraint={3}
                            value={formValues.colorAccentForeground ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorAccentForeground',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Border" htmlFor="colorBorder" />
                        <Spacings.Inline alignItems="center" scale="s">
                          <input
                            type="color"
                            id="colorBorder"
                            value={formValues.colorBorder || '#000000'}
                            onChange={(e) =>
                              handleChange('colorBorder', e.target.value)
                            }
                            style={{ width: 40, height: 32, cursor: 'pointer' }}
                          />
                          <TextInput
                            horizontalConstraint={3}
                            value={formValues.colorBorder ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorBorder',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Input" htmlFor="colorInput" />
                        <Spacings.Inline alignItems="center" scale="s">
                          <input
                            type="color"
                            id="colorInput"
                            value={formValues.colorInput || '#000000'}
                            onChange={(e) =>
                              handleChange('colorInput', e.target.value)
                            }
                            style={{ width: 40, height: 32, cursor: 'pointer' }}
                          />
                          <TextInput
                            horizontalConstraint={3}
                            value={formValues.colorInput ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorInput',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Ring" htmlFor="colorRing" />
                        <Spacings.Inline alignItems="center" scale="s">
                          <input
                            type="color"
                            id="colorRing"
                            value={formValues.colorRing || '#000000'}
                            onChange={(e) =>
                              handleChange('colorRing', e.target.value)
                            }
                            style={{ width: 40, height: 32, cursor: 'pointer' }}
                          />
                          <TextInput
                            horizontalConstraint={3}
                            value={formValues.colorRing ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorRing',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                  </Grid>

                  <Text.Headline as="h2">Typography</Text.Headline>
                  <Grid
                    gridGap="16px"
                    gridAutoColumns="1fr"
                    gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                  >
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Font Family" htmlFor="fontFamily" />
                        <TextInput
                          horizontalConstraint={4}
                          id="fontFamily"
                          value={formValues.fontFamily}
                          onChange={(e) =>
                            handleChange('fontFamily', e.target.value)
                          }
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Heading Font" htmlFor="fontHeading" />
                        <TextInput
                          horizontalConstraint={4}
                          id="fontHeading"
                          value={formValues.fontHeading}
                          onChange={(e) =>
                            handleChange('fontHeading', e.target.value)
                          }
                        />
                      </div>
                    </Grid.Item>
                  </Grid>

                  <Text.Headline as="h2">Layout &amp; Components</Text.Headline>
                  <Grid
                    gridGap="16px"
                    gridAutoColumns="1fr"
                    gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                  >
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Spacing Scale" htmlFor="spacingScale" />
                        <NumberInput
                          id="spacingScale"
                          horizontalConstraint={3}
                          value={formValues.spacingScale}
                          onChange={(e) =>
                            handleChange(
                              'spacingScale',
                              e.target.value === '' ? 0 : Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Border Radius" htmlFor="borderRadius" />
                        <SelectInput
                          id="borderRadius"
                          horizontalConstraint={3}
                          value={formValues.borderRadius}
                          onChange={(e) =>
                            handleChange(
                              'borderRadius',
                              e.target.value as ThemeTokens['borderRadius']
                            )
                          }
                          options={BORDER_RADIUS_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Border Width" htmlFor="borderWidth" />
                        <SelectInput
                          id="borderWidth"
                          horizontalConstraint={3}
                          value={formValues.borderWidth}
                          onChange={(e) =>
                            handleChange(
                              'borderWidth',
                              e.target.value as ThemeTokens['borderWidth']
                            )
                          }
                          options={BORDER_WIDTH_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Button Style" htmlFor="buttonStyle" />
                        <SelectInput
                          id="buttonStyle"
                          horizontalConstraint={3}
                          value={formValues.buttonStyle}
                          onChange={(e) =>
                            handleChange(
                              'buttonStyle',
                              e.target.value as ThemeTokens['buttonStyle']
                            )
                          }
                          options={BUTTON_STYLE_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Card Shadow" htmlFor="cardShadow" />
                        <SelectInput
                          id="cardShadow"
                          horizontalConstraint={3}
                          value={formValues.cardShadow}
                          onChange={(e) =>
                            handleChange(
                              'cardShadow',
                              e.target.value as ThemeTokens['cardShadow']
                            )
                          }
                          options={CARD_SHADOW_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Header Style" htmlFor="headerStyle" />
                        <SelectInput
                          id="headerStyle"
                          horizontalConstraint={3}
                          value={formValues.headerStyle}
                          onChange={(e) =>
                            handleChange(
                              'headerStyle',
                              e.target.value as ThemeTokens['headerStyle']
                            )
                          }
                          options={HEADER_STYLE_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
                  </Grid>

                  <Text.Headline as="h2">Shadow &amp; surface</Text.Headline>
                  <Grid
                    gridGap="16px"
                    gridAutoColumns="1fr"
                    gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                  >
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Shadow Light" htmlFor="colorShadowLight" />
                        <Spacings.Inline alignItems="center" scale="s">
                          <input
                            type="color"
                            id="colorShadowLight"
                            value={formValues.colorShadowLight ?? '#ffffff'}
                            onChange={(e) =>
                              handleChange('colorShadowLight', e.target.value)
                            }
                            style={{ width: 40, height: 32, cursor: 'pointer' }}
                          />
                          <TextInput
                            horizontalConstraint={3}
                            value={formValues.colorShadowLight ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorShadowLight',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Shadow Dark" htmlFor="colorShadowDark" />
                        <Spacings.Inline alignItems="center" scale="s">
                          <input
                            type="color"
                            id="colorShadowDark"
                            value={formValues.colorShadowDark ?? '#b8bec7'}
                            onChange={(e) =>
                              handleChange('colorShadowDark', e.target.value)
                            }
                            style={{ width: 40, height: 32, cursor: 'pointer' }}
                          />
                          <TextInput
                            horizontalConstraint={3}
                            value={formValues.colorShadowDark ?? ''}
                            onChange={(e) =>
                              handleChange(
                                'colorShadowDark',
                                (e.target as HTMLInputElement).value
                              )
                            }
                          />
                        </Spacings.Inline>
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Surface Glass" htmlFor="colorSurfaceGlass" />
                        <TextInput
                          horizontalConstraint={3}
                          id="colorSurfaceGlass"
                          value={formValues.colorSurfaceGlass ?? ''}
                          onChange={(e) =>
                            handleChange(
                              'colorSurfaceGlass',
                              (e.target as HTMLInputElement).value
                            )
                          }
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Shadow Style" htmlFor="shadowStyle" />
                        <SelectInput
                          id="shadowStyle"
                          horizontalConstraint={3}
                          value={formValues.shadowStyle ?? DEFAULT_THEME.shadowStyle}
                          onChange={(e) =>
                            handleChange(
                              'shadowStyle',
                              e.target.value as ThemeTokens['shadowStyle']
                            )
                          }
                          options={SHADOW_STYLE_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Surface Blur" htmlFor="surfaceBlur" />
                        <SelectInput
                          id="surfaceBlur"
                          horizontalConstraint={3}
                          value={formValues.surfaceBlur ?? DEFAULT_THEME.surfaceBlur}
                          onChange={(e) =>
                            handleChange(
                              'surfaceBlur',
                              e.target.value as ThemeTokens['surfaceBlur']
                            )
                          }
                          options={SURFACE_BLUR_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Surface Opacity" htmlFor="surfaceOpacity" />
                        <NumberInput
                          id="surfaceOpacity"
                          horizontalConstraint={3}
                          value={formValues.surfaceOpacity ?? 1}
                          onChange={(e) =>
                            handleChange(
                              'surfaceOpacity',
                              e.target.value === ''
                                ? 0
                                : Math.min(1, Math.max(0, Number(e.target.value)))
                            )
                          }
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Border Style" htmlFor="borderStyle" />
                        <SelectInput
                          id="borderStyle"
                          horizontalConstraint={3}
                          value={formValues.borderStyle ?? DEFAULT_THEME.borderStyle}
                          onChange={(e) =>
                            handleChange(
                              'borderStyle',
                              e.target.value as ThemeTokens['borderStyle']
                            )
                          }
                          options={BORDER_STYLE_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Background Style" htmlFor="backgroundStyle" />
                        <SelectInput
                          id="backgroundStyle"
                          horizontalConstraint={3}
                          value={formValues.backgroundStyle ?? DEFAULT_THEME.backgroundStyle}
                          onChange={(e) =>
                            handleChange(
                              'backgroundStyle',
                              e.target.value as ThemeTokens['backgroundStyle']
                            )
                          }
                          options={BACKGROUND_STYLE_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
                  </Grid>

                  <Text.Headline as="h2">
                    Typography (weight &amp; transform)
                  </Text.Headline>
                  <Grid
                    gridGap="16px"
                    gridAutoColumns="1fr"
                    gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                  >
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Font Weight Base" htmlFor="fontWeightBase" />
                        <SelectInput
                          id="fontWeightBase"
                          horizontalConstraint={3}
                          value={formValues.fontWeightBase ?? DEFAULT_THEME.fontWeightBase}
                          onChange={(e) =>
                            handleChange(
                              'fontWeightBase',
                              e.target.value as ThemeTokens['fontWeightBase']
                            )
                          }
                          options={FONT_WEIGHT_BASE_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Font Weight Heading" htmlFor="fontWeightHeading" />
                        <SelectInput
                          id="fontWeightHeading"
                          horizontalConstraint={3}
                          value={formValues.fontWeightHeading ?? DEFAULT_THEME.fontWeightHeading}
                          onChange={(e) =>
                            handleChange(
                              'fontWeightHeading',
                              e.target.value as ThemeTokens['fontWeightHeading']
                            )
                          }
                          options={FONT_WEIGHT_HEADING_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Letter Spacing" htmlFor="letterSpacing" />
                        <SelectInput
                          id="letterSpacing"
                          horizontalConstraint={3}
                          value={formValues.letterSpacing ?? DEFAULT_THEME.letterSpacing}
                          onChange={(e) =>
                            handleChange(
                              'letterSpacing',
                              e.target.value as ThemeTokens['letterSpacing']
                            )
                          }
                          options={LETTER_SPACING_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
                    <Grid.Item>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <FieldLabel title="Text Transform" htmlFor="textTransform" />
                        <SelectInput
                          id="textTransform"
                          horizontalConstraint={3}
                          value={formValues.textTransform ?? DEFAULT_THEME.textTransform}
                          onChange={(e) =>
                            handleChange(
                              'textTransform',
                              e.target.value as ThemeTokens['textTransform']
                            )
                          }
                          options={TEXT_TRANSFORM_OPTIONS}
                        />
                      </div>
                    </Grid.Item>
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
              </Spacings.Stack>
            </div>
          )}
        </Spacings.Stack>
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

export default ThemeEditor;

import React from 'react';
import { RichTextInput } from '@commercetools/nimbus';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RichTextFieldProps {
  /** HTML string. */
  value: string | undefined;
  onChange: (value: string) => void;
}

// ---------------------------------------------------------------------------
// RichTextField — custom Puck field component (HTML in / HTML out)
//
// Thin wrapper around Nimbus `RichTextInput`, which accepts and emits HTML
// strings (converting to/from its internal Slate representation). The props
// contract is unchanged, so every consumer (the RichText block and the cms/*
// components) keeps working without modification, and stored page data needs
// no migration.
// ---------------------------------------------------------------------------

export const RichTextField: React.FC<RichTextFieldProps> = ({ value, onChange }) => (
  <RichTextInput
    value={value ?? ''}
    onChange={onChange}
    placeholder="Start typing…"
  />
);

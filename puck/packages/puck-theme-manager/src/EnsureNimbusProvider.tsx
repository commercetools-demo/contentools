import React, { type PropsWithChildren } from 'react';
import { NimbusProvider } from '@commercetools/nimbus';

/**
 * Ensures a Nimbus context (theme + Chakra + React Aria i18n) exists for the
 * Nimbus components rendered by this package.
 *
 * NimbusProvider is safe to nest: locale overrides the nearest ancestor, color
 * mode is global, and the Inter font links are deduplicated across instances.
 */
export const EnsureNimbusProvider: React.FC<PropsWithChildren<{ locale?: string }>> = ({
  locale = 'en',
  children,
}) => <NimbusProvider locale={locale}>{children}</NimbusProvider>;

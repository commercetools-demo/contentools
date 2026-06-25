import React, { useContext, type PropsWithChildren } from 'react';
import { IntlContext, IntlProvider, ReactIntlErrorCode } from 'react-intl';

/**
 * Ensures a react-intl context exists for the commercetools UIKit components
 * rendered by this package.
 *
 * UIKit components (DataTable, Text, buttons, …) call react-intl internally and
 * require an `<IntlProvider>` in the ancestry. If the host already provides one
 * (e.g. the Merchant Center ApplicationShell, or a storefront that set up
 * react-intl), it is reused as-is. Otherwise a minimal English provider is
 * mounted so the package also works standalone.
 *
 * Detection mirrors react-intl's own `useIntl`: `IntlContext` defaults to `null`
 * when no provider is present.
 */
export const EnsureIntlProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const intl = useContext(IntlContext);

  if (intl) {
    return <>{children}</>;
  }

  return (
    <IntlProvider
      locale="en"
      defaultLocale="en"
      messages={{}}
      onError={(err) => {
        // UIKit ships `defaultMessage`s, so a missing-translation against an
        // empty catalog is expected and would otherwise flood the console.
        if (err.code === ReactIntlErrorCode.MISSING_TRANSLATION) return;
        // eslint-disable-next-line no-console
        console.error(err);
      }}
    >
      {children}
    </IntlProvider>
  );
};

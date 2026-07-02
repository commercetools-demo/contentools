import React from 'react';
import { type ComponentConfig } from '@measured/puck';
import type { IntlShape } from 'react-intl';

export interface DeliveryMessageProps {
  message: string;
  threshold: string;
}

export const createDeliveryMessageConfig = (
  intl: IntlShape
): ComponentConfig<DeliveryMessageProps> => ({
  label: intl.formatMessage({ id: 'Editor.cfg.deliveryMessage.label' }),
  fields: {
    message: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.deliveryMessage.field.message' }) },
    threshold: { type: 'text', label: intl.formatMessage({ id: 'Editor.cfg.deliveryMessage.field.threshold' }) },
  },
  defaultProps: { message: 'Free delivery on orders over $50', threshold: '' },
  render: ({ message, threshold }) => {
    if (!message) return <></>;
    const text = threshold
      ? message.replace(/\$\d+/g, `$${threshold}`)
      : message;
    return (
      <div
        style={{
          padding: '0.75rem 1rem',
          background: '#f0f7f0',
          borderRadius: '4px',
          fontSize: '0.95rem',
          color: '#2c5530',
        }}
      >
        {text}
      </div>
    );
  },
});

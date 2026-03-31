import React from 'react';
import { type ComponentConfig } from '@measured/puck';

export interface DeliveryMessageProps {
  message: string;
  threshold: string;
}

export const DeliveryMessage: ComponentConfig<DeliveryMessageProps> = {
  label: 'Delivery Message',
  fields: {
    message: { type: 'text', label: 'Message (use $XX for threshold)' },
    threshold: { type: 'text', label: 'Threshold Amount (e.g. 50)' },
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
};

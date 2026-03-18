import React from 'react';
import { useFormikContext } from 'formik';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  HeaderConfiguration,
  HeaderMainRowSlot,
} from '@commercetools-demo/contentools-types';
import { DEFAULT_MAIN_ROW_ORDER } from '../../constants';
import { ArrowDownIcon, ArrowUpIcon } from '@commercetools-uikit/icons';

const SLOT_LABELS: Record<HeaderMainRowSlot, string> = {
  logo: 'Logo',
  navigation: 'Navigation',
  search: 'Search',
  utility: 'Utility',
};

function moveItem<T>(arr: T[], index: number, direction: 'up' | 'down'): T[] {
  const next = [...arr];
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export const MainRowOrderSection: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<HeaderConfiguration>();
  const order =
    values.mainRowOrder && values.mainRowOrder.length > 0
      ? values.mainRowOrder
      : DEFAULT_MAIN_ROW_ORDER;

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setFieldValue('mainRowOrder', moveItem(order, index, 'up'));
  };

  const handleMoveDown = (index: number) => {
    if (index >= order.length - 1) return;
    setFieldValue('mainRowOrder', moveItem(order, index, 'down'));
  };

  const handleReset = () => {
    setFieldValue('mainRowOrder', [...DEFAULT_MAIN_ROW_ORDER]);
  };

  return (
    <Card>
      <Spacings.Stack scale="m">
        <Text.Headline as="h2">Main row order</Text.Headline>
        <Text.Body tone="secondary">
          Order of slots in the main header row (left to right).
        </Text.Body>
        <Spacings.Stack scale="s">
          {order.map((slot, index) => (
            <Spacings.Inline
              key={slot}
              scale="s"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text.Body>
                {index + 1}. {SLOT_LABELS[slot]}
              </Text.Body>
              <Spacings.Inline scale="xs">
                <FlatButton
                  label="Up"
                  onClick={() => handleMoveUp(index)}
                  isDisabled={index === 0}
                  icon={<ArrowUpIcon />}
                />
                <FlatButton
                  label="Down"
                  onClick={() => handleMoveDown(index)}
                  isDisabled={index === order.length - 1}
                  icon={<ArrowDownIcon />}
                />
              </Spacings.Inline>
            </Spacings.Inline>
          ))}
        </Spacings.Stack>
        <FlatButton
          label="Reset to default"
          onClick={handleReset}
          tone="secondary"
        />
      </Spacings.Stack>
    </Card>
  );
};

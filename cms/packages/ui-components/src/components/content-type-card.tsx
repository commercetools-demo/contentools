import { ContentTypeData } from '@commercetools-demo/contentools-types';
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import Spacings from '@commercetools-uikit/spacings'
import Text from '@commercetools-uikit/text'

const ComponentItem = styled.div`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: grab;
  background: white;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    border-color: #007acc;
    background: #f0f8ff;
  }

  &:active {
    cursor: grabbing;
  }

  &.dragging {
    opacity: 0.5;
    transform: rotate(2deg);
  }
`;

type Props = {
  contentType: ContentTypeData
}

const ContentTypeCard = ({ contentType, ...props }: Props & HTMLAttributes<HTMLDivElement>) => {
  return (
    <ComponentItem
      {...props}
    >
      <Spacings.Stack scale="xs">
        <Text.Subheadline as="h4">
          {contentType.metadata.icon && (
            <span style={{ marginRight: '8px' }}>
              {contentType.metadata.icon}
            </span>
          )}
          {contentType.metadata.name}
        </Text.Subheadline>
        <Text.Detail tone="secondary">{contentType.metadata.type}</Text.Detail>
        <Text.Detail tone="secondary" as="small">
          {`${Object.keys(contentType.metadata.propertySchema || {}).length} properties`}
        </Text.Detail>
      </Spacings.Stack>
    </ComponentItem>
  )
}

export default ContentTypeCard
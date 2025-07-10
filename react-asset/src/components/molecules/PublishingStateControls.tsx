import React from 'react';
import styled from 'styled-components';
import { Button } from '../atoms/Button';
import { StatusTag } from '../atoms/StatusTag';
import { Select, SelectOption } from '../atoms/Select';

export interface PublishingStateControlsProps {
  currentState: 'draft' | 'published' | 'archived';
  onStateChange: (state: 'draft' | 'published' | 'archived') => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  isLoading?: boolean;
  canPublish?: boolean;
  canUnpublish?: boolean;
  canArchive?: boolean;
  canRestore?: boolean;
  showQuickActions?: boolean;
  showSelect?: boolean;
  lastModified?: string;
  lastPublished?: string;
  className?: string;
}

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
`;

const StateSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const StateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StateLabel = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const MetadataSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #e1e5e9;
`;

const MetadataItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
`;

const MetadataLabel = styled.span`
  font-weight: 500;
`;

const MetadataValue = styled.span`
  color: #333;
`;

const stateOptions: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' }
];

const getStateActions = (
  state: PublishingStateControlsProps['currentState'],
  props: PublishingStateControlsProps
) => {
  const actions = [];

  switch (state) {
    case 'draft':
      if (props.canPublish && props.onPublish) {
        actions.push({
          key: 'publish',
          label: 'Publish',
          onClick: props.onPublish,
          variant: 'success' as const
        });
      }
      if (props.canArchive && props.onArchive) {
        actions.push({
          key: 'archive',
          label: 'Archive',
          onClick: props.onArchive,
          variant: 'secondary' as const
        });
      }
      break;

    case 'published':
      if (props.canUnpublish && props.onUnpublish) {
        actions.push({
          key: 'unpublish',
          label: 'Unpublish',
          onClick: props.onUnpublish,
          variant: 'warning' as const
        });
      }
      if (props.canArchive && props.onArchive) {
        actions.push({
          key: 'archive',
          label: 'Archive',
          onClick: props.onArchive,
          variant: 'secondary' as const
        });
      }
      break;

    case 'archived':
      if (props.canRestore && props.onRestore) {
        actions.push({
          key: 'restore',
          label: 'Restore',
          onClick: props.onRestore,
          variant: 'primary' as const
        });
      }
      break;
  }

  return actions;
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
};

export const PublishingStateControls: React.FC<PublishingStateControlsProps> = ({
  currentState,
  onStateChange,
  isLoading = false,
  canPublish = true,
  canUnpublish = true,
  canArchive = true,
  canRestore = true,
  showQuickActions = true,
  showSelect = true,
  lastModified,
  lastPublished,
  className,
  ...props
}) => {
  const quickActions = getStateActions(currentState, {
    ...props,
    currentState,
    onStateChange,
    canPublish,
    canUnpublish,
    canArchive,
    canRestore
  });

  return (
    <ControlsContainer className={className}>
      <StateSection>
        <StateInfo>
          <StateLabel>Status:</StateLabel>
          <StatusTag 
            status={currentState === 'published' ? 'success' : currentState} 
            size="small"
          >
            {currentState.charAt(0).toUpperCase() + currentState.slice(1)}
          </StatusTag>
        </StateInfo>
        
        {showSelect && (
          <Select
            options={stateOptions}
            value={currentState}
            onChange={(value) => onStateChange(value as any)}
            disabled={isLoading}
            placeholder="Select state..."
          />
        )}
      </StateSection>

      {showQuickActions && quickActions.length > 0 && (
        <QuickActions>
          {quickActions.map(action => (
            <Button
              key={action.key}
              variant={action.variant}
              size="small"
              onClick={action.onClick}
              disabled={isLoading}
            >
              {action.label}
            </Button>
          ))}
        </QuickActions>
      )}

      {(lastModified || lastPublished) && (
        <MetadataSection>
          {lastModified && (
            <MetadataItem>
              <MetadataLabel>Last Modified:</MetadataLabel>
              <MetadataValue>{formatDate(lastModified)}</MetadataValue>
            </MetadataItem>
          )}
          {lastPublished && currentState === 'published' && (
            <MetadataItem>
              <MetadataLabel>Published:</MetadataLabel>
              <MetadataValue>{formatDate(lastPublished)}</MetadataValue>
            </MetadataItem>
          )}
        </MetadataSection>
      )}
    </ControlsContainer>
  );
}; 
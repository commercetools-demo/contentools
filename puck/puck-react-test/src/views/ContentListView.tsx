import React from 'react';
import { ContentManager } from '@commercetools-demo/puck-content-manager';
import type { PuckContentListItem } from '@commercetools-demo/puck-types';

interface ContentListViewProps {
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
  jwtToken: string;
  onEdit: (item: PuckContentListItem) => void;
}

export const ContentListView: React.FC<ContentListViewProps> = ({
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
  onEdit,
}) => (
  <ContentManager
    baseURL={baseURL}
    projectKey={projectKey}
    businessUnitKey={businessUnitKey}
    jwtToken={jwtToken}
    onEdit={onEdit}
  />
);

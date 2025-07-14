import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ContentItemEditorCreateForm from './create-form';
import ContentItemEditorEditForm from './edit-form';

interface ContentItemEditorProps {
  locale?: string;
  baseURL?: string;
  businessUnitKey?: string;
}

const ContentItemEditor: React.FC<ContentItemEditorProps> = (props: ContentItemEditorProps) => {
  const { contentItemKey, contentTypeKey } = useParams<{
    contentItemKey?: string;
    contentTypeKey?: string;
  }>();
  const isNew = !contentItemKey && !!contentTypeKey;
  
  return (
    <>
      {isNew ? (
        <ContentItemEditorCreateForm {...props} />
      ) : (
        <ContentItemEditorEditForm {...props} />
      )}
    </>
  );
};

export default ContentItemEditor;

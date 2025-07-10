import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ContentTypeData, RootState } from '../../types';
import { store } from '../../store';
import {
  fetchContentTypesThunk,
  addContentTypeThunk,
  updateContentTypeThunk,
  removeContentTypeThunk,
} from '../../store/content-type.slice';
import {
  Button,
  Modal,
  LabeledInput,
  ErrorMessage,
  LoadingSpinner,
  StatusTag,
} from '../../components';

const Container = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  font-family: system-ui, sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e1e5e9;
  background-color: white;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #333;
`;

const Content = styled.div`
  padding: 20px;
  height: calc(100% - 80px);
  overflow-y: auto;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 0;
`;

interface ContentTypeAppProps {
  baseURL: string;
}

interface ContentTypeForm {
  type: string;
  name: string;
  icon: string;
}

export const ContentTypeApp: React.FC<ContentTypeAppProps> = ({ baseURL }) => {
  const dispatch = useDispatch();
  const { contentTypes, loading, error } = useSelector((state: RootState) => state.contentType);
  
  const [selectedContentType, setSelectedContentType] = useState<ContentTypeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ContentTypeForm>({
    type: '',
    name: '',
    icon: '🧩'
  });

  useEffect(() => {
    if (baseURL) {
      dispatch(fetchContentTypesThunk({ baseUrl: baseURL, businessUnitKey: 'default' }) as any);
    }
  }, [dispatch, baseURL]);

  const handleCreate = () => {
    setSelectedContentType(null);
    setIsEditing(false);
    setFormData({
      type: '',
      name: '',
      icon: '🧩'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (contentType: ContentTypeData) => {
    setSelectedContentType(contentType);
    setIsEditing(true);
    setFormData({
      type: contentType.metadata.type,
      name: contentType.metadata.name,
      icon: contentType.metadata.icon || '🧩'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (type: string) => {
    if (window.confirm('Are you sure you want to delete this content type?')) {
      await dispatch(removeContentTypeThunk({ baseUrl: baseURL, key: type }) as any);
    }
  };

  const handleSave = async () => {
    if (!formData.type || !formData.name) {
      alert('Please fill in all required fields');
      return;
    }

    const contentTypeData: ContentTypeData = {
      metadata: {
        type: formData.type,
        name: formData.name,
        icon: formData.icon || '🧩',
        defaultProperties: {},
        propertySchema: {}
      },
      deployedUrl: selectedContentType?.deployedUrl || ''
    };

    try {
      if (isEditing && selectedContentType) {
        await dispatch(updateContentTypeThunk({
          baseUrl: baseURL,
          contentType: contentTypeData
        }) as any);
      } else {
        await dispatch(addContentTypeThunk({
          baseUrl: baseURL,
          contentType: contentTypeData
        }) as any);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving content type:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <LoadingSpinner size="large" />
          <p>Loading content types...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Content Types</Title>
        <Button variant="primary" onClick={handleCreate}>
          + Create Content Type
        </Button>
      </Header>

      <Content>
        {error && (
          <ErrorMessage 
            message={error}
            type="error"
            dismissible
          />
        )}

        {contentTypes.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🧩</EmptyIcon>
            <h3>No Content Types</h3>
            <p>Create your first content type to define the structure of your content.</p>
            <Button variant="primary" onClick={handleCreate}>
              Create Content Type
            </Button>
          </EmptyState>
        ) : (
          <div>
            <h3>Content Types ({contentTypes.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              {contentTypes.map((contentType) => (
                <div 
                  key={contentType.metadata.type}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{contentType.metadata.icon}</span>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#333' }}>{contentType.metadata.name}</h4>
                      <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '14px' }}>{contentType.metadata.type}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <StatusTag status={contentType.deployedUrl ? "success" : "draft"} size="small">
                      {contentType.deployedUrl ? "Deployed" : "Draft"}
                    </StatusTag>
                    <Button variant="text" size="small" onClick={() => handleEdit(contentType)}>
                      Edit
                    </Button>
                    <Button variant="text" size="small" onClick={() => handleDelete(contentType.metadata.type)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Content>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Content Type' : 'Create Content Type'}
        size="medium"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <FormContainer>
          <LabeledInput
            label="Content Type ID"
            value={formData.type}
            onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            placeholder="e.g., hero-banner"
            required
            disabled={isEditing}
            helperText={isEditing ? "ID cannot be changed after creation" : "Unique identifier for this content type"}
          />
          <LabeledInput
            label="Display Name"
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            placeholder="e.g., Hero Banner"
            required
          />
          <LabeledInput
            label="Icon"
            value={formData.icon}
            onChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
            placeholder="🧩"
            helperText="Emoji or icon to represent this content type"
          />
        </FormContainer>
      </Modal>
    </Container>
  );
}; 
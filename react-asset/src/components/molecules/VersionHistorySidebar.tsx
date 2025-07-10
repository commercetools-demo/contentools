import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../atoms/Button';
import { StatusTag } from '../atoms/StatusTag';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export interface VersionHistoryItem {
  id: string;
  versionNumber: number;
  comment?: string;
  created: string;
  createdBy: string;
  isAutoSave?: boolean;
  isCurrent?: boolean;
}

export interface VersionHistorySidebarProps {
  versions: VersionHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onVersionSelect: (versionId: string) => void;
  onVersionRestore: (versionId: string) => void;
  onVersionCompare: (versionId1: string, versionId2: string) => void;
  selectedVersionId?: string;
  compareMode?: boolean;
  selectedForCompare?: string[];
  loading?: boolean;
  className?: string;
}

const SidebarOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: flex-end;
  z-index: 1000;
`;

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: 400px;
  height: 100vh;
  background-color: white;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s ease-out;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f9fa;
`;

const SidebarTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background-color: #e9ecef;
  }
  
  &::before {
    content: '×';
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const VersionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const VersionItem = styled.div<{ isSelected?: boolean; isForCompare?: boolean }>`
  padding: 12px;
  border: 1px solid ${props => {
    if (props.isSelected) return '#3498db';
    if (props.isForCompare) return '#f39c12';
    return '#e1e5e9';
  }};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => {
    if (props.isSelected) return '#f0f8ff';
    if (props.isForCompare) return '#fef9e7';
    return 'white';
  }};
  
  &:hover {
    border-color: #3498db;
    background-color: #f8f9fa;
  }
`;

const VersionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const VersionNumber = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const VersionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VersionInfo = styled.div`
  font-size: 12px;
  color: #666;
  line-height: 1.4;
`;

const VersionComment = styled.div`
  font-size: 13px;
  color: #333;
  margin-top: 4px;
  font-style: ${props => props.children ? 'normal' : 'italic'};
  opacity: ${props => props.children ? 1 : 0.7};
`;

const VersionActions = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
`;

const CompareControls = styled.div`
  padding: 16px;
  border-top: 1px solid #e1e5e9;
  background-color: #f8f9fa;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-style: italic;
`;

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch {
    return dateString;
  }
};

const formatRelativeTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
};

export const VersionHistorySidebar: React.FC<VersionHistorySidebarProps> = ({
  versions,
  isOpen,
  onClose,
  onVersionSelect,
  onVersionRestore,
  onVersionCompare,
  selectedVersionId,
  compareMode = false,
  selectedForCompare = [],
  loading = false,
  className
}) => {
  const [localCompareMode, setLocalCompareMode] = useState(compareMode);
  const [localSelectedForCompare, setLocalSelectedForCompare] = useState<string[]>(selectedForCompare);

  const handleVersionClick = (versionId: string) => {
    if (localCompareMode) {
      if (localSelectedForCompare.includes(versionId)) {
        setLocalSelectedForCompare(prev => prev.filter(id => id !== versionId));
      } else if (localSelectedForCompare.length < 2) {
        setLocalSelectedForCompare(prev => [...prev, versionId]);
      }
    } else {
      onVersionSelect(versionId);
    }
  };

  const handleCompareClick = () => {
    if (localSelectedForCompare.length === 2) {
      onVersionCompare(localSelectedForCompare[0], localSelectedForCompare[1]);
    }
  };

  const toggleCompareMode = () => {
    setLocalCompareMode(!localCompareMode);
    setLocalSelectedForCompare([]);
  };

  return (
    <SidebarOverlay isOpen={isOpen} onClick={onClose}>
      <SidebarContainer 
        isOpen={isOpen} 
        onClick={(e) => e.stopPropagation()}
        className={className}
      >
        <SidebarHeader>
          <SidebarTitle>Version History</SidebarTitle>
          <CloseButton onClick={onClose} aria-label="Close version history" />
        </SidebarHeader>

        <SidebarContent>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : versions.length === 0 ? (
            <EmptyState>
              No version history available
            </EmptyState>
          ) : (
            <VersionList>
              {versions.map(version => (
                <VersionItem
                  key={version.id}
                  isSelected={selectedVersionId === version.id}
                  isForCompare={localSelectedForCompare.includes(version.id)}
                  onClick={() => handleVersionClick(version.id)}
                >
                  <VersionHeader>
                    <VersionNumber>
                      Version {version.versionNumber}
                    </VersionNumber>
                    <VersionMeta>
                      {version.isCurrent && (
                        <StatusTag status="success" size="small">
                          Current
                        </StatusTag>
                      )}
                      {version.isAutoSave && (
                        <StatusTag status="info" size="small">
                          Auto
                        </StatusTag>
                      )}
                    </VersionMeta>
                  </VersionHeader>

                  <VersionInfo>
                    By {version.createdBy} • {formatRelativeTime(version.created)}
                  </VersionInfo>

                  <VersionComment>
                    {version.comment || 'No comment provided'}
                  </VersionComment>

                  {!localCompareMode && (
                    <VersionActions>
                      <Button
                        size="small"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onVersionRestore(version.id);
                        }}
                        disabled={version.isCurrent}
                      >
                        Restore
                      </Button>
                    </VersionActions>
                  )}
                </VersionItem>
              ))}
            </VersionList>
          )}
        </SidebarContent>

        {!loading && versions.length > 0 && (
          <CompareControls>
            <Button
              variant={localCompareMode ? 'secondary' : 'outline'}
              size="small"
              onClick={toggleCompareMode}
              style={{ marginBottom: '8px', width: '100%' }}
            >
              {localCompareMode ? 'Exit Compare Mode' : 'Compare Versions'}
            </Button>

            {localCompareMode && (
              <Button
                variant="primary"
                size="small"
                onClick={handleCompareClick}
                disabled={localSelectedForCompare.length !== 2}
                style={{ width: '100%' }}
              >
                Compare Selected ({localSelectedForCompare.length}/2)
              </Button>
            )}
          </CompareControls>
        )}
      </SidebarContainer>
    </SidebarOverlay>
  );
}; 
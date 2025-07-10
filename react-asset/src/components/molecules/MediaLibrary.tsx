import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import styled from 'styled-components';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  lastModified: Date;
}

export interface MediaLibraryProps {
  onSelect?: (media: MediaItem) => void;
  onUpload?: (files: File[]) => Promise<void>;
  selectedItems?: string[];
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;

const SearchContainer = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e1e5e9;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const UploadArea = styled.div<{ isDragOver: boolean }>`
  padding: 2rem;
  border: 2px dashed ${props => props.isDragOver ? '#3b82f6' : '#d1d5db'};
  border-radius: 8px;
  text-align: center;
  background: ${props => props.isDragOver ? '#f0f9ff' : '#f9fafb'};
  margin: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
  }
`;

const UploadText = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
`;

const MediaCard = styled.div<{ selected: boolean }>`
  position: relative;
  border: 2px solid ${props => props.selected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  
  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MediaPreview = styled.div`
  width: 100%;
  height: 120px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #9ca3af;
`;

const MediaInfo = styled.div`
  padding: 0.75rem;
`;

const MediaName = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 12px;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MediaDetails = styled.p`
  margin: 0;
  font-size: 11px;
  color: #6b7280;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6b7280;
`;

const HiddenInput = styled.input`
  display: none;
`;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (type: string): string => {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎥';
  if (type.startsWith('audio/')) return '🎵';
  if (type.includes('pdf')) return '📄';
  if (type.includes('zip') || type.includes('rar')) return '📦';
  return '📎';
};

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onSelect,
  onUpload,
  selectedItems = [],
  multiple = false,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  searchQuery = '',
  onSearchChange,
  loading = false,
  error,
  className,
}) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter items based on search query
  React.useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [items, searchQuery]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} is too large (${formatFileSize(file.size)})`);
        return false;
      }
      return true;
    });

    if (onUpload && validFiles.length > 0) {
      try {
        await onUpload(validFiles);
        // Simulate adding uploaded files to the library
        const newItems: MediaItem[] = validFiles.map(file => ({
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size,
          lastModified: new Date(file.lastModified),
        }));
        setItems(prev => [...prev, ...newItems]);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const handleItemClick = (item: MediaItem) => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Container className={className}>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search media..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </SearchContainer>

      <UploadArea
        isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <UploadText>
          {isDragOver
            ? 'Drop files here...'
            : 'Click to upload or drag and drop files here'
          }
        </UploadText>
        <UploadText style={{ fontSize: '12px', marginTop: '0.5rem' }}>
          Max size: {formatFileSize(maxSize)}
        </UploadText>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
        />
      </UploadArea>

      {error && (
        <div style={{ padding: '1rem', color: '#dc2626', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <EmptyState>
          <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</span>
          <p>No media files found</p>
          {searchQuery && <p style={{ fontSize: '12px' }}>Try adjusting your search</p>}
        </EmptyState>
      ) : (
        <MediaGrid>
          {filteredItems.map((item) => (
            <MediaCard
              key={item.id}
              selected={selectedItems.includes(item.id)}
              onClick={() => handleItemClick(item)}
            >
              <MediaPreview>
                {item.type.startsWith('image/') ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  getFileIcon(item.type)
                )}
              </MediaPreview>
              <MediaInfo>
                <MediaName title={item.name}>{item.name}</MediaName>
                <MediaDetails>
                  {formatFileSize(item.size)} • {new Date(item.lastModified).toLocaleDateString()}
                </MediaDetails>
              </MediaInfo>
            </MediaCard>
          ))}
        </MediaGrid>
      )}
    </Container>
  );
}; 
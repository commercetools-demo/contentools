import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMediaLibrary } from '@commercetools-demo/puck-api';
import type { MediaFile } from '@commercetools-demo/puck-types';

// ---------------------------------------------------------------------------
// Inline styles (no external styling deps — this runs inside the Puck editor)
// ---------------------------------------------------------------------------

const s = {
  root: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    fontFamily: 'inherit',
    fontSize: '13px',
  },
  preview: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    background: '#f9fafb',
  },
  previewImg: {
    width: '48px',
    height: '48px',
    objectFit: 'cover' as const,
    borderRadius: '4px',
    flexShrink: 0,
  },
  previewInfo: { flex: 1, minWidth: 0 },
  previewUrl: {
    fontSize: '12px',
    color: '#374151',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  btnRow: { display: 'flex', gap: '6px', flexWrap: 'wrap' as const },
  btn: (primary?: boolean): React.CSSProperties => ({
    padding: '5px 12px',
    borderRadius: '4px',
    border: primary ? 'none' : '1px solid #d1d5db',
    background: primary ? '#1a1a2e' : '#fff',
    color: primary ? '#fff' : '#374151',
    fontWeight: 500,
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }),
  dangerBtn: {
    padding: '5px 12px',
    borderRadius: '4px',
    border: '1px solid #fca5a5',
    background: '#fff',
    color: '#dc2626',
    fontWeight: 500,
    fontSize: '12px',
    cursor: 'pointer',
  } as React.CSSProperties,
  // Modal
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    background: '#fff',
    borderRadius: '8px',
    width: '640px',
    maxWidth: '95vw',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
  },
  modalTitle: { margin: 0, fontSize: '16px', fontWeight: 600 },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#6b7280',
    lineHeight: 1,
  },
  modalBody: {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    borderTop: '1px solid #e5e7eb',
    gap: '12px',
  },
  // Upload form
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    marginBottom: '12px',
  },
  label: { fontSize: '12px', fontWeight: 600, color: '#374151' },
  input: {
    padding: '7px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  dropZone: {
    border: '2px dashed #d1d5db',
    borderRadius: '6px',
    padding: '24px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    color: '#6b7280',
    fontSize: '13px',
    transition: 'border-color .2s',
  },
  dropZoneActive: {
    border: '2px dashed #3b82f6',
    borderRadius: '6px',
    padding: '24px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    color: '#3b82f6',
    fontSize: '13px',
  },
  // Media grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
    gap: '12px',
    marginTop: '4px',
  },
  gridItem: (selected: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    border: `2px solid ${selected ? '#3b82f6' : 'transparent'}`,
    borderRadius: '6px',
    padding: '6px',
    background: selected ? 'rgba(59,130,246,0.07)' : '#f9fafb',
  }),
  thumb: {
    width: '80px',
    height: '80px',
    objectFit: 'cover' as const,
    borderRadius: '4px',
    background: '#e5e7eb',
  },
  thumbPlaceholder: {
    width: '80px',
    height: '80px',
    borderRadius: '4px',
    background: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
  },
  itemName: {
    marginTop: '6px',
    fontSize: '11px',
    textAlign: 'center' as const,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    color: '#374151',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: '16px',
    fontSize: '12px',
    color: '#6b7280',
  },
  errorMsg: {
    fontSize: '12px',
    color: '#dc2626',
    marginTop: '4px',
  },
  selectedInfo: {
    flex: 1,
    fontSize: '12px',
    color: '#374151',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
} as const;

// ---------------------------------------------------------------------------
// Upload modal
// ---------------------------------------------------------------------------

interface UploadModalProps {
  uploading: boolean;
  error: string | null;
  onUpload: (file: File, title: string, description: string) => void;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  uploading,
  error,
  onUpload,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    if (!title) setTitle(f.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.modalHeader}>
          <h3 style={s.modalTitle}>Upload a file</h3>
          <button style={s.modalClose} onClick={onClose}>×</button>
        </div>
        <div style={s.modalBody}>
          <div style={s.formGroup}>
            <label style={s.label}>Title</label>
            <input
              style={s.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="File title"
            />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Description</label>
            <input
              style={s.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>
          <div
            style={dragging ? s.dropZoneActive : s.dropZone}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            {file ? (
              <>
                <div>📎 {file.name}</div>
                <div style={{ fontSize: '11px', marginTop: '4px', color: '#9ca3af' }}>
                  {(file.size / 1024).toFixed(0)} KB
                </div>
              </>
            ) : (
              <>
                <div>📁 Click or drag &amp; drop to select a file</div>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
          {error && <div style={s.errorMsg}>{error}</div>}
        </div>
        <div style={s.modalFooter}>
          <span style={s.selectedInfo}>{file?.name ?? 'No file selected'}</span>
          <div style={s.btnRow}>
            <button style={s.btn()} onClick={onClose}>Cancel</button>
            <button
              style={s.btn(true)}
              disabled={!file || uploading}
              onClick={() => file && onUpload(file, title, description)}
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Library modal
// ---------------------------------------------------------------------------

interface LibraryModalProps {
  files: MediaFile[];
  pagination: { currentPage: number; totalPages: number };
  loading: boolean;
  error: string | null;
  onNextPage: () => void;
  onPrevPage: () => void;
  onSelect: (file: MediaFile) => void;
  onClose: () => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({
  files,
  pagination,
  loading,
  error,
  onNextPage,
  onPrevPage,
  onSelect,
  onClose,
}) => {
  const [selected, setSelected] = useState<MediaFile | null>(null);

  const handleConfirm = () => {
    if (selected) onSelect(selected);
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.modalHeader}>
          <h3 style={s.modalTitle}>Select from Media Library</h3>
          <button style={s.modalClose} onClick={onClose}>×</button>
        </div>
        <div style={s.modalBody}>
          {loading ? (
            <div style={{ color: '#6b7280', fontSize: '13px' }}>Loading…</div>
          ) : files.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: '13px' }}>No files found.</div>
          ) : (
            <>
              <div style={s.grid}>
                {files.map((file) => (
                  <div
                    key={file.url}
                    style={s.gridItem(selected?.url === file.url)}
                    onClick={() => setSelected(file)}
                    title={file.title ?? file.name}
                  >
                    {file.isImage ? (
                      <img src={file.url} alt={file.name} style={s.thumb} />
                    ) : (
                      <div style={s.thumbPlaceholder}>📄</div>
                    )}
                    <div style={s.itemName}>{file.title ?? file.name}</div>
                  </div>
                ))}
              </div>
              {pagination.totalPages > 1 && (
                <div style={s.pagination}>
                  <button
                    style={s.btn()}
                    disabled={pagination.currentPage <= 1}
                    onClick={onPrevPage}
                  >
                    ← Prev
                  </button>
                  <span>{pagination.currentPage} / {pagination.totalPages}</span>
                  <button
                    style={s.btn()}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    onClick={onNextPage}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
          {error && <div style={s.errorMsg}>{error}</div>}
        </div>
        <div style={s.modalFooter}>
          <span style={s.selectedInfo}>
            {selected ? (selected.title ?? selected.name) : 'Nothing selected'}
          </span>
          <div style={s.btnRow}>
            <button style={s.btn()} onClick={onClose}>Cancel</button>
            <button
              style={s.btn(true)}
              disabled={!selected}
              onClick={handleConfirm}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ImagePickerField — the Puck custom field component
// ---------------------------------------------------------------------------

export interface ImagePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Only show images (default: true) */
  imagesOnly?: boolean;
}

export const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  value,
  onChange,
  imagesOnly = true,
}) => {
  const {
    files,
    pagination,
    loading,
    uploading,
    error,
    fetchMedia,
    uploadFile,
    loadNextPage,
    loadPreviousPage,
  } = useMediaLibrary();

  const [showUpload, setShowUpload] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const extensions = imagesOnly ? ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'] : [];

  const openLibrary = useCallback(() => {
    void fetchMedia(extensions, 1, 20);
    setShowLibrary(true);
  }, [fetchMedia, extensions]);

  const handleUpload = useCallback(
    async (file: File, title: string, description: string) => {
      const mediaFile = await uploadFile(file, title, description);
      onChange(mediaFile.url);
      setShowUpload(false);
    },
    [uploadFile, onChange]
  );

  const handleSelect = useCallback(
    (file: MediaFile) => {
      onChange(file.url);
      setShowLibrary(false);
    },
    [onChange]
  );

  // Close modals on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowUpload(false);
        setShowLibrary(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={s.root}>
      {value ? (
        <div style={s.preview}>
          <img src={value} alt="" style={s.previewImg} />
          <div style={s.previewInfo}>
            <div style={s.previewUrl}>{value}</div>
          </div>
          <button style={s.dangerBtn} onClick={() => onChange('')}>
            Remove
          </button>
        </div>
      ) : (
        <div style={{ color: '#9ca3af', fontSize: '12px', padding: '4px 0' }}>
          No image selected
        </div>
      )}

      <div style={s.btnRow}>
        <button style={s.btn()} onClick={() => setShowUpload(true)}>
          Upload
        </button>
        <button style={s.btn(true)} onClick={openLibrary}>
          Media Library
        </button>
      </div>

      {showUpload && (
        <UploadModal
          uploading={uploading}
          error={error}
          onUpload={(file, title, desc) => void handleUpload(file, title, desc)}
          onClose={() => setShowUpload(false)}
        />
      )}

      {showLibrary && (
        <LibraryModal
          files={files}
          pagination={pagination}
          loading={loading}
          error={error}
          onNextPage={() => void loadNextPage(extensions)}
          onPrevPage={() => void loadPreviousPage(extensions)}
          onSelect={handleSelect}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
};

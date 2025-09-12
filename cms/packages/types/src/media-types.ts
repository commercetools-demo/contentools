export interface MediaFile {
  url: string;
  name: string;
  description?: string;
  title?: string;
  isImage: boolean;
  createdAt?: Date;
  size?: number;
}

export interface MediaLibraryResult {
  files: MediaFile[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

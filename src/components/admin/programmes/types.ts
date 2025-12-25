export interface ProgrammeFormData {
  // Step 1
  title: string;
  description: string;
  videoFile: File | null;

  // Step 2
  categories: string[];
  thumbnailFile: File | null;
  isFeatured: boolean;
  isPublished: boolean;
}

export interface DraftResponse {
  programme: {
    productId: string;
    title: string;
    muxAssetId?: string;
    muxPlaybackId?: string;
  };
  product: {
    id: string;
  };
}


import http from "./http";

export interface Programme {
  productId: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  duration?: number;
  categories?: string[];
  isPublished: boolean;
  isFeatured: boolean;
  muxPlaybackId?: string | null;
}

export interface CreateProgrammeResponse {
  uploadUrl: string;
  uploadId: string;
  productId: string;
}

export async function createProgrammeWithVideo(
  title: string,
  description: string,
  videoFile: File
) {
  const formData = new FormData();
  formData.append("title", title);
  if (description) formData.append("description", description);
  formData.append("video", videoFile);

  return http.post<{ message: string; data: any }>(
    "/product/programme/create-with-video",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
}

export async function fetchProgrammes(params?: {
  page?: number;
  limit?: number;
  isPublished?: boolean;
  search?: string;
  categories?: string[];
}) {
  return http.get<{
    message: string;
    data: {
      items: Programme[];
      pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasMore: boolean;
        hasPrev: boolean;
      };
    };
  }>("/product/programme", { params });
}

export async function fetchProgrammeById(productId: string) {
  return http.get<{ message: string; data: Programme }>(
    `/product/programme/${productId}`
  );
}

export async function uploadProgrammeThumbnail(productId: string, file: File) {
  const form = new FormData();
  form.append("thumbnail", file);
  form.append("productId", productId);
  return http.post<{ message: string; data: any }>(
    "/product/programme/thumbnail",
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
}

export async function fetchSecureProgrammeById(productId: string) {
  return http.get<{
    message: string;
    data: Programme & { signedPlaybackToken?: string };
  }>(`/product/programme/secure/${productId}`);
}

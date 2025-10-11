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
  const response = await http.get<{
    message: string;
    data: Programme & {
      playback?: { playbackId: string; signedToken: string; expiresAt: Date };
    };
  }>(`/product/programme/secure/${productId}`);
  return response.data.data;
}

export async function createProgrammeDraft(title: string, videoFile: File) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("video", videoFile);

  return http.post<{ message: string; data: any }>(
    "/product/programme/create-draft",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
}

export async function updateProgrammeDetails(
  productId: string,
  description?: string,
  categories?: string[],
  isFeatured?: boolean,
  isPublished?: boolean,
  thumbnailFile?: File
) {
  const formData = new FormData();
  if (description) formData.append("description", description);
  if (categories && categories.length > 0) {
    formData.append("categories", JSON.stringify(categories));
  }
  if (isFeatured !== undefined)
    formData.append("isFeatured", String(isFeatured));
  if (isPublished !== undefined)
    formData.append("isPublished", String(isPublished));
  if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

  return http.patch<{ message: string; data: any }>(
    `/product/programme/update-details/${productId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
}

export async function deleteProgramme(productId: string) {
  return http.delete<{ message: string; data: any }>(
    `/product/programme/${productId}`
  );
}

import axios from "axios";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

const client = axios.create({
  baseURL: `${STRAPI_URL}/api`,
});

export type Author = {
  fullName: string;
  externalLink?: string;
  bio?: string;
  pictureUrl?: string;
};

export type BlogEntity = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description?: string;
  tags?: string | string[];
  content: any;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  coverImage?: {
    url?: string;
    alternativeText?: string;
    data?: { attributes?: { url?: string; alternativeText?: string } };
  } | null;
  authors?: Author[];
  readTime?: number;
};

export type Paginated<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export function mediaUrl(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${STRAPI_URL}${path}`;
}

export async function fetchBlogs(page = 1, pageSize = 9) {
  const { data } = await client.get<Paginated<BlogEntity>>("/blogs", {
    params: {
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      "filters[publishedAt][$notNull]": true,
      sort: "publishedAt:desc",
      "populate[coverImage]": true,
    },
  });
  return data;
}

export async function fetchBlogBySlug(slug: string) {
  const { data } = await client.get<Paginated<BlogEntity>>("/blogs", {
    params: {
      "filters[slug][$eq]": slug,
      "filters[publishedAt][$notNull]": true,
      sort: "publishedAt:desc",
      "populate[coverImage]": true,
    },
  });
  return data.data[0] ?? null;
}

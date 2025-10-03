import axios from "axios";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

const client = axios.create({
  baseURL: `${STRAPI_URL}/api`,
});

export type BlogAttributes = {
  title: string;
  slug: string;
  description?: string;
  tags?: string[];
  content: any; // Strapi Blocks content
  publishedAt?: string;
  coverImage?: {
    data?: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
  };
};

export type BlogEntity = {
  id: number;
  attributes: BlogAttributes & {
    createdAt: string;
    updatedAt: string;
  };
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
      populate: "coverImage",
      sort: "publishedAt:desc",
    },
  });
  return data;
}

export async function fetchBlogBySlug(slug: string) {
  const { data } = await client.get<Paginated<BlogEntity>>("/blogs", {
    params: {
      "filters[slug][$eq]": slug,
      "filters[publishedAt][$notNull]": true,
      populate: "coverImage",
      sort: "publishedAt:desc",
    },
  });
  return data.data[0] ?? null;
}

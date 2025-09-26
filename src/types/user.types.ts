// Types inferred from backend schema at src/database/schema.ts

export interface UserRole {
  USER: "USER";
  ADMIN: "ADMIN";
  COACH: "COACH";
}

export type User = {
  id: string;
  email: string;
  password?: string | null;
  firstName: string;
  lastName: string;
  phone?: string | null;
  googleId?: string | null;
  role: UserRole;
  city?: string | null;
  address?: string | null;
  bio?: string | null;
  profilePicture?: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date | null;
};

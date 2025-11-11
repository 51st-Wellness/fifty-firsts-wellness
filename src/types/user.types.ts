// Types inferred from backend schema at src/database/schema.ts

export interface UserRole {
  USER: "USER";
  ADMIN: "ADMIN";
  MODERATOR: "MODERATOR";
}

export type User = {
  id: string;
  email: string;
  password?: string | null;
  firstName: string;
  lastName: string;
  phone?: string | null;
  googleId?: string | null;
  role: "USER" | "ADMIN" | "MODERATOR";
  bio?: string | null;
  profilePicture?: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date | null;
};

export type DeliveryAddress = {
  id: string;
  userId: string;
  contactName: string;
  contactPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryInstructions?: string | null;
  isDefault: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date | null;
};

export type SessionUser = {
  user?: {
    id?: string;
    name?: string;
    lastName?: string | null;
    email?: string;
    emailVerified?: boolean;
    image?: string | null;
    role?: string;
    documentType?: string | null;
    documentNumber?: string | null;
    phone?: string | null;
  };
} | null;
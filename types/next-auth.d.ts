export type SessionUser = {
  id: string;
  name: string;
  lastName?: string | null;
  email: string;
  role: 'USER' | 'SELLER' | 'ADMIN';
  documentType?: 'DNI' | 'RUC' | 'CE' | 'PASAPORTE' | null;
  documentNumber?: string | null;
  phone?: string | null;
  image?: string | null;
};

export type Session = {
  user: SessionUser;
} | null;
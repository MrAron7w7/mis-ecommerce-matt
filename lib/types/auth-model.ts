export type UserRole = 'USER' | 'SELLER' | 'ADMIN';

export function toUserRole(role?: string): UserRole {
  if (role === 'SELLER' || role === 'ADMIN') return role;
  return 'USER';
}
/**
 * Genera un slug amigable a partir de un texto
 * @param text - Texto a convertir en slug
 * @returns Slug generado
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '')    // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-')             // Reemplazar espacios por guiones
    .replace(/-+/g, '-');             // Evitar guiones múltiples
}

/**
 * Genera un slug único agregando un número si ya existe
 * @param baseSlug - Slug base
 * @param existingSlugs - Lista de slugs existentes
 * @returns Slug único
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}
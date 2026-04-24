import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface SaveImageOptions {
  folder?: string;        // Carpeta dentro de public (ej: 'categorias', 'productos')
  keepOriginalName?: boolean;
  prefix?: string;        // Prefijo para el nombre del archivo (ej: 'cat_', 'prod_')
}

/**
 * Guarda una imagen en el sistema de archivos
 */
export async function saveImage(
  base64Data: string,
  options: SaveImageOptions = {}
): Promise<string> {
  const { folder = 'uploads', keepOriginalName = false, prefix = '' } = options;

  // Validar que sea base64 válido
  if (!base64Data || !base64Data.includes('base64,')) {
    throw new Error('Formato de imagen inválido');
  }

  // Extraer el tipo de imagen y los datos
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Formato de imagen no soportado');
  }

  const extension = matches[1];
  const imageData = matches[2];
  const buffer = Buffer.from(imageData, 'base64');

  // Generar nombre único
  const uniqueId = uuidv4();
  const fileName = keepOriginalName 
    ? `${prefix}${uniqueId}.${extension}`
    : `${prefix}${uniqueId}.${extension}`;

  // Construir rutas
  const publicDir = path.join(process.cwd(), 'public');
  const targetDir = path.join(publicDir, folder);
  const filePath = path.join(targetDir, fileName);
  const publicPath = `/${folder}/${fileName}`;

  try {
    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(filePath, buffer);
    return publicPath;
  } catch  {
    //console.error('Error al guardar la imagen:', error);
    throw new Error('No se pudo guardar la imagen');
  }
}

/**
 * Elimina una imagen del sistema de archivos
 */
export async function deleteImage(imageUrl: string | null): Promise<boolean> {
  if (!imageUrl) return true;

  try {
    const publicPath = path.join(process.cwd(), 'public', imageUrl);
    
    try {
      await fs.access(publicPath);
    } catch {
      return true; // El archivo no existe
    }

    await fs.unlink(publicPath);
    return true;
  } catch  {
    //console.error('Error al eliminar la imagen:', error);
    return false;
  }
}

/**
 * Valida y optimiza imagen (opcional)
 */
export async function validateImage(
  base64Data: string,
  maxSizeMB: number = 5
): Promise<{ isValid: boolean; sizeMB: number; extension: string; error?: string }> {
  if (!base64Data || !base64Data.includes('base64,')) {
    return { isValid: false, sizeMB: 0, extension: '', error: 'Formato inválido' };
  }

  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    return { isValid: false, sizeMB: 0, extension: '', error: 'Formato no soportado' };
  }

  const extension = matches[1];
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  
  if (!allowedExtensions.includes(extension.toLowerCase())) {
    return { 
      isValid: false, 
      sizeMB: 0, 
      extension, 
      error: `Formato ${extension} no permitido. Usa: ${allowedExtensions.join(', ')}` 
    };
  }

  const imageData = matches[2];
  const sizeBytes = Buffer.from(imageData, 'base64').length;
  const sizeMB = sizeBytes / (1024 * 1024);

  if (sizeMB > maxSizeMB) {
    return { 
      isValid: false, 
      sizeMB, 
      extension, 
      error: `La imagen excede el límite de ${maxSizeMB}MB (${sizeMB.toFixed(2)}MB)` 
    };
  }

  return { isValid: true, sizeMB, extension };
}

/**
 * Múltiples imágenes (para galerías de productos)
 */
export async function saveMultipleImages(
  imagesBase64: string[],
  options: SaveImageOptions = {}
): Promise<string[]> {
  const promises = imagesBase64.map(img => saveImage(img, options));
  return Promise.all(promises);
}

/**
 * Eliminar múltiples imágenes
 */
export async function deleteMultipleImages(imageUrls: string[]): Promise<boolean[]> {
  const promises = imageUrls.map(url => deleteImage(url));
  return Promise.all(promises);
}

/**
 * Reemplazar imagen (elimina la anterior y guarda la nueva)
 */
export async function replaceImage(
  oldImageUrl: string | null,
  newImageBase64: string,
  options: SaveImageOptions = {}
): Promise<string> {
  // Eliminar imagen anterior si existe
  if (oldImageUrl) {
    await deleteImage(oldImageUrl);
  }
  
  // Guardar nueva imagen
  return saveImage(newImageBase64, options);
}
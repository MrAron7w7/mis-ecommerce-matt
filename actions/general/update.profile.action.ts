'use server';

import { deleteImage, saveImage } from '@/lib/helpers/save-image-helper';
import { requireSession } from '@/lib/helpers/session';
import prisma from '@/lib/prisma';

export async function updateAvatar(base64Data: string) {
  const session = await requireSession();
  if (!session?.user?.id) return { error: 'No autorizado' };

  // Obtener imagen actual para eliminarla
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  });

  // Eliminar avatar anterior si existe y no es una URL externa
  if (user?.image && user.image.startsWith('/avatars/')) {
    await deleteImage(user.image);
  }

  // Guardar nueva imagen
  const imagePath = await saveImage(base64Data, {
    folder: 'avatars',
    prefix: 'avatar_',
  });

  // Actualizar en base de datos
  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: imagePath },
  });

  return { success: true, imagePath };
}

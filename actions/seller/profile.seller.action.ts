'use server';

import { replaceImage, validateImage } from '@/lib/helpers/save-image-helper';
import { requireRole } from '@/lib/helpers/session';
import prisma from '@/lib/prisma';
import { SellerProfile } from '@/lib/types/type.models';


export type SaveProfileDto = {
  storeName: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  socialMedia: Record<string, { url: string; enabled: boolean }>;
  businessHours: Record<string, { open: string; close: string; isOpen: boolean }>;
};

export async function saveStoreProfile(data: SaveProfileDto) {
  const session = await requireRole(['SELLER']);
  const userId = session.user.id;
  try {
    const profile = await prisma.sellerProfile.upsert({
      where: { userId },
      update: {
        storeName: data.storeName,
        description: data.description,
        logo: data.logo,
        coverImage: data.coverImage,
        email: data.email,
        phone: data.phone,
        address: data.address,
        website: data.website,
        socialMedia: data.socialMedia,
        businessHours: data.businessHours,
      },
      create: {
        userId,
        storeName: data.storeName,
        description: data.description,
        logo: data.logo,
        coverImage: data.coverImage,
        email: data.email,
        phone: data.phone,
        address: data.address,
        website: data.website,
        socialMedia: data.socialMedia,
        businessHours: data.businessHours,
      },
    });
    return { success: true as const, profile };
  } catch (error) {
    console.error(error);
    return { success: false as const, error: 'Error al guardar' };
  }
}


export async function getSellerProfile() {
  const session = await requireRole(['SELLER']);
  const userId = session.user.id;
  try {
    const profile = await prisma.sellerProfile.findUnique({ where: { userId } });
    return { success: true as const, profile };
  } catch (error) {
    console.error(error);
    return { success: false as const, error: 'Error al obtener perfil', profile: null };
  }
}

export async function uploadSellerLogo(base64Data: string) {
  const session = await requireRole(['SELLER']);
  const userId = session.user.id;

  try {
    const validation = await validateImage(base64Data, 2); // máx 2MB
    if (!validation.isValid) {
      return { success: false as const, error: validation.error };
    }

    // Obtener logo anterior para eliminarlo
    const existing = await prisma.sellerProfile.findUnique({
      where: { userId },
      select: { logo: true },
    });

    const logoUrl = await replaceImage(existing?.logo ?? null, base64Data, {
      folder: 'logo_vendedor',
      prefix: 'logo_',
    });

    await prisma.sellerProfile.upsert({
      where: { userId },
      update: { logo: logoUrl },
      create: { userId, storeName: '', logo: logoUrl },
    });

    return { success: true as const, logoUrl };
  } catch (error) {
    console.error(error);
    return { success: false as const, error: 'Error al subir el logo' };
  }
}

export async function uploadSellerCover(base64Data: string) {
  const session = await requireRole(['SELLER']);
  const userId = session.user.id;

  try {
    const validation = await validateImage(base64Data, 5); // máx 5MB
    if (!validation.isValid) {
      return { success: false as const, error: validation.error };
    }

    const existing = await prisma.sellerProfile.findUnique({
      where: { userId },
      select: { coverImage: true },
    });

    const coverUrl = await replaceImage(existing?.coverImage ?? null, base64Data, {
      folder: 'cover_vendedor',
      prefix: 'cover_',
    });

    await prisma.sellerProfile.upsert({
      where: { userId },
      update: { coverImage: coverUrl },
      create: { userId, storeName: '', coverImage: coverUrl },
    });

    return { success: true as const, coverUrl };
  } catch (error) {
    console.error(error);
    return { success: false as const, error: 'Error al subir la portada' };
  }
}
'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

type SellerRegisterData = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  businessType: string;
  taxIdType: string;
  taxIdNumber: string;
  address: string;
  experience: string;
};

export async function registerSellerAction(data: SellerRegisterData) {
  try {
    // 0. Validar duplicados ANTES de crear el usuario
    const [existingEmail, existingDoc, existingPhone] = await Promise.all([
      prisma.user.findUnique({ where: { email: data.email } }),
      prisma.user.findUnique({ where: { documentNumber: data.taxIdNumber } }),
      prisma.user.findFirst({ where: { phone: data.phone } }),
    ]);

    if (existingEmail) return { error: 'Este correo ya está registrado' };
    if (existingDoc)   return { error: 'Este número de documento ya está registrado' };
    if (existingPhone) return { error: 'Este número de celular ya está registrado' };

    // 1. Registrar usuario con better-auth
    const result = await auth.api.signUpEmail({
      body: {
        name:     data.name,
        email:    data.email,
        password: data.password,
      },
      headers: await headers(),
    });

    if (!result?.user?.id) {
      return { error: 'Error al crear la cuenta' };
    }

    // 2. Actualizar datos extra del usuario
    await prisma.user.update({
      where: { id: result.user.id },
      data: {
        lastName:       data.lastName,
        phone:          data.phone,
        documentType:   data.taxIdType as 'DNI' | 'RUC' | 'CE' | 'PASAPORTE',
        documentNumber: data.taxIdNumber,
      },
    });

    // 3. Crear la solicitud de vendedor
    await prisma.sellerRequest.create({
      data: {
        userId:       result.user.id,
        businessName: data.businessName,
        businessType: data.businessType,
        taxId:        `${data.taxIdType}: ${data.taxIdNumber}`,
        phone:        data.phone,
        address:      data.address,
        experience:   data.experience,
        status:       'PENDING',
      },
    });

    return { success: true };
  } catch (error: unknown) {
    console.error('Error en registerSellerAction:', error);

    // Capturar P2002 por si acaso hay race condition
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return { error: 'Ya existe una cuenta con ese documento, celular o correo' };
    }

    return { error: 'Error al procesar la solicitud' };
  }
}
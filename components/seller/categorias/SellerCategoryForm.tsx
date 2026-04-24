'use client';

import { useTransition, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Tag, Loader2, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import {
  CreateCategoryInput,
  createCategorySchema,
  UpdateCategoryInput,
} from '@/lib/schemas/seller/category.schema';
import { createCategory, updateCategory } from '@/actions/seller/category.seller.action';

type EditValues = UpdateCategoryInput;

type Props = {
  defaultValues?: EditValues;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function CategoryForm({ defaultValues, onSuccess, onCancel }: Props) {
  const isEditing = !!defaultValues?.id;
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(defaultValues?.imageUrl || '');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('imageBase64', {
        message: 'Formato no válido. Usa JPG, PNG, WEBP o GIF',
      });
      return;
    }

    // Validar tamaño original máximo (10MB antes de comprimir)
    const MAX_ORIGINAL_SIZE_MB = 10;
    if (file.size > MAX_ORIGINAL_SIZE_MB * 1024 * 1024) {
      setError('imageBase64', {
        message: `La imagen no puede superar los ${MAX_ORIGINAL_SIZE_MB}MB antes de comprimir`,
      });
      return;
    }

    setIsCompressing(true);

    try {
      // Opciones de compresión
      const options = {
        maxSizeMB: 1, // Tamaño máximo después de comprimir (1MB)
        maxWidthOrHeight: 1920, // Máximo ancho o alto
        useWebWorker: true, // Usar web worker para no bloquear el UI
        fileType: 'image/jpeg', // Convertir a JPEG para mejor compresión
      };

      // Comprimir imagen
      const compressedFile = await imageCompression(file, options);

      // Convertir a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue('imageBase64', base64String);
        setImagePreview(base64String);
        setError('imageBase64', { message: '' });
        setIsCompressing(false);
      };
      reader.readAsDataURL(compressedFile);
    } catch {
      //console.error('Error al comprimir la imagen:', error);
      setError('imageBase64', {
        message: 'Error al procesar la imagen. Intenta con otra imagen más pequeña.',
      });
      setIsCompressing(false);
    }
  };

  function onSubmit(data: CreateCategoryInput) {
    setServerError(null);
    startTransition(async () => {
      const submitData = { ...data };
      if (!submitData.imageBase64) {
        delete submitData.imageBase64;
      }

      const result = isEditing
        ? await updateCategory({ ...submitData, id: defaultValues!.id! })
        : await createCategory(submitData);

      if (!result.success) {
        setServerError(result.error);
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            setError(field as keyof CreateCategoryInput, { message: messages[0] });
          });
        }
        return;
      }
      onSuccess();
    });
  }

  return (
    <div>
      {/* Modal header - igual */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
            <Tag className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-base font-bold text-gray-900">
            {isEditing ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
        {/* Error global */}
        {serverError && (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            <span className="text-red-500">⚠</span>
            {serverError}
          </div>
        )}

        {/* Nombre */}
        <Field label="Nombre" error={errors.name?.message}>
          <input
            {...register('name')}
            placeholder="Ej: Electrónica"
            autoFocus
            className={input(!!errors.name)}
          />
        </Field>

        {/* Imagen */}
        <Field label="Imagen" error={errors.imageBase64?.message} optional>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="hidden"
              disabled={isCompressing}
            />

            {isCompressing && (
              <div className="w-full h-32 border-2 border-dashed border-emerald-300 rounded-lg flex flex-col items-center justify-center gap-2 bg-emerald-50">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="text-sm text-emerald-600">Comprimiendo imagen...</span>
              </div>
            )}

            {!isCompressing && imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setValue('imageBase64', '');
                    setValue('imageUrl', '');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {!isCompressing && !imagePreview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-400 transition-colors flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">Haz clic para subir una imagen</span>
                <span className="text-xs text-gray-400">
                  JPG, PNG, WEBP o GIF (max 10MB, se comprimirá a 1MB)
                </span>
              </button>
            )}
          </div>
        </Field>

        {/* Estado */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-gray-700">Estado activo</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Las categorías inactivas no aparecen en la tienda
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register('isActive')} className="sr-only peer" />
            <div className="w-10 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
          </label>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending || isCompressing}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {(isPending || isCompressing) && <Loader2 className="w-4 h-4 animate-spin" />}
            {isCompressing
              ? 'Comprimiendo...'
              : isPending
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear categoría'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Helpers (igual) ───────────────────────────
function input(hasError: boolean) {
  return [
    'w-full px-3.5 py-2.5 rounded-xl bg-white border text-gray-900 text-sm',
    'placeholder:text-gray-400 outline-none transition-all',
    'focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400',
    hasError
      ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
      : 'border-gray-200 hover:border-gray-300',
  ].join(' ');
}

function Field({
  label,
  error,
  hint,
  optional,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {optional && <span className="ml-1.5 text-xs text-gray-400 font-normal">(opcional)</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

'use client';

import { useTransition, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X,
  Loader2,
  Upload,
  Package,
  Plus,
  Trash2,
  DollarSign,
  PackageSearch,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { createProduct } from '@/actions/seller/product.seller.action';
import { CreateProductInput, createProductSchema } from '@/lib/schemas/seller/product.schema';

type Props = {
  categories: { id: number; name: string }[];
};

type FormData = {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  imageBase64?: string;
  imageUrl?: string;
  categoryId: number;
  supplierId?: number;
  variants: { type: string; value: string }[];
};

export default function CreateProductForm({ categories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: undefined,
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const nameValue = watch('name');

  // Auto-generar slug
  useEffect(() => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setValue('slug', slug);
    }
  }, [nameValue, setValue]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('imageBase64', { message: 'Formato no válido. Usa JPG, PNG, WEBP o GIF' });
      return;
    }

    const MAX_ORIGINAL_SIZE_MB = 10;
    if (file.size > MAX_ORIGINAL_SIZE_MB * 1024 * 1024) {
      setError('imageBase64', {
        message: `La imagen no puede superar los ${MAX_ORIGINAL_SIZE_MB}MB`,
      });
      return;
    }

    setIsCompressing(true);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg',
      };

      const compressedFile = await imageCompression(file, options);
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
      setError('imageBase64', { message: 'Error al procesar la imagen' });
      setIsCompressing(false);
    }
  };

  const onSubmit = (data: FormData) => {
    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const submitData: CreateProductInput = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        variants: data.variants,
        ...(data.imageBase64 && { imageBase64: data.imageBase64 }),
      };

      const result = await createProduct(submitData);

      if (!result.success) {
        setServerError(result.error);
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            setError(field as keyof FormData, { message: messages[0] });
          });
        }
        return;
      }

      setSuccessMessage('¡Producto creado exitosamente! Redirigiendo...');
      setTimeout(() => {
        router.push('/seller/productos');
        router.refresh();
      }, 1500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crear nuevo producto</h1>
              <p className="text-gray-500 mt-1">
                Completa los datos para agregar un producto a tu tienda
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Server Error */}
          {serverError && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {serverError}
            </div>
          )}

          {/* Información básica */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900">Información básica</h2>
              <p className="text-sm text-gray-500 mt-0.5">Datos principales del producto</p>
            </div>
            <div className="p-6 space-y-5">
              <Field label="Nombre del producto" error={errors.name?.message} required>
                <input
                  {...register('name')}
                  placeholder="Ej: Laptop Gamer Pro"
                  autoFocus
                  className={input(!!errors.name)}
                />
              </Field>

              <Field
                label="Slug"
                error={errors.slug?.message}
                hint="Generado automáticamente a partir del nombre"
                required
              >
                <input
                  {...register('slug')}
                  placeholder="laptop-gamer-pro"
                  className={input(!!errors.slug)}
                  readOnly
                />
              </Field>

              <Field label="Descripción" error={errors.description?.message} optional>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Descripción detallada del producto..."
                  className={input(!!errors.description)}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Precio (PEN)" error={errors.price?.message} required>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', { valueAsNumber: true })}
                      className={input(!!errors.price, 'pl-9')}
                      placeholder="0.00"
                    />
                  </div>
                </Field>

                <Field label="Stock inicial" error={errors.stock?.message} required>
                  <input
                    type="number"
                    {...register('stock', { valueAsNumber: true })}
                    className={input(!!errors.stock)}
                    placeholder="0"
                  />
                </Field>
              </div>

              <Field label="Categoría" error={errors.categoryId?.message} required>
                <select
                  {...register('categoryId', { valueAsNumber: true })}
                  className={input(!!errors.categoryId)}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Variantes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Variantes</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Opciones como talla, color, etc.</p>
                </div>
                <button
                  type="button"
                  onClick={() => append({ type: '', value: '' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar variante
                </button>
              </div>
            </div>
            <div className="p-6">
              {fields.length === 0 ? (
                <div className="text-center py-8">
                  <PackageSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No hay variantes</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Haz clic en "Agregar variante" para añadir
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-1">
                        <input
                          {...register(`variants.${index}.type`)}
                          placeholder="Tipo (Ej: Talla, Color)"
                          className={input(false, 'bg-white')}
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          {...register(`variants.${index}.value`)}
                          placeholder="Valor (Ej: M, Rojo)"
                          className={input(false, 'bg-white')}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Imagen */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900">Imagen del producto</h2>
              <p className="text-sm text-gray-500 mt-0.5">Imagen principal del producto</p>
            </div>
            <div className="p-6">
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
                  <div className="w-full h-64 border-2 border-dashed border-emerald-300 rounded-xl flex flex-col items-center justify-center gap-3 bg-emerald-50/30">
                    <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                    <span className="text-sm text-emerald-600 font-medium">
                      Comprimiendo imagen...
                    </span>
                  </div>
                )}

                {!isCompressing && imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-full h-64 object-cover rounded-xl border border-gray-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setValue('imageBase64', '');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {!isCompressing && !imagePreview && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-400 transition-all flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 group"
                  >
                    <Upload className="w-12 h-12 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                    <div>
                      <span className="text-sm text-gray-500 group-hover:text-gray-700">
                        Haz clic para subir una imagen
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, WEBP o GIF (max 10MB, se comprimirá a 1MB)
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || isCompressing}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {(isPending || isCompressing) && <Loader2 className="w-4 h-4 animate-spin" />}
              {isCompressing
                ? 'Comprimiendo imagen...'
                : isPending
                  ? 'Creando producto...'
                  : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────
function input(hasError: boolean, extraClasses: string = '') {
  return [
    'w-full px-3.5 py-2.5 rounded-xl bg-white border text-gray-900 text-sm',
    'placeholder:text-gray-400 outline-none transition-all',
    'focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400',
    'disabled:bg-gray-50 disabled:cursor-not-allowed',
    hasError
      ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
      : 'border-gray-200 hover:border-gray-300',
    extraClasses,
  ].join(' ');
}

function Field({
  label,
  error,
  hint,
  required,
  optional,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
        {optional && <span className="ml-1.5 text-xs text-gray-400 font-normal">(opcional)</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

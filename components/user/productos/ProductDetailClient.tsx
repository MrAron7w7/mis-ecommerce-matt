'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Share2,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
  Clock,
  Star,
  ChevronLeft,
} from 'lucide-react';
import { PublicProduct } from '@/actions/user/product.user.action';

type ProductDetailClientProps = {
  product: PublicProduct;
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'returns'>('description');

  // Separar variantes
  const colors = useMemo(() => product.colors || [], [product.colors]);
  const sizes = useMemo(() => product.sizes || [], [product.sizes]);

  // Otras variantes
  const otherVariants = useMemo(
    () => product.variants?.filter((v) => v.type !== 'color' && v.type !== 'size') || [],
    [product.variants],
  );

  // Imagen principal
  const mainImage = product.imageUrl;

  // Resetear estado cuando cambia el producto
  useEffect(() => {
    setSelectedColor(colors.length > 0 ? colors[0] : null);
    setSelectedSize(null);
    setQuantity(1);
    setAddedToCart(false);
  }, [product.id, colors]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (sizes.length > 0 && !selectedSize) {
      alert('Por favor selecciona un talle');
      return;
    }

    setIsAddingToCart(true);

    // Aquí va tu lógica de carrito
    console.log('Agregando al carrito:', {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsAddingToCart(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || `Mira este producto: ${product.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const handleWishlist = () => {
    setIsLiked(!isLiked);
    // Aquí va tu lógica de favoritos
    console.log('Wishlist:', product.id, !isLiked);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Galería de imágenes - Lado izquierdo */}
        <div className="lg:w-1/2">
          <div className="lg:sticky lg:top-24">
            {/* Imagen principal */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-100">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <ShoppingBag size={64} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm">Sin imagen disponible</p>
                  </div>
                </div>
              )}

              {product.stock < 5 && product.stock > 0 && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm px-3 py-1.5 rounded-full z-10">
                  ¡Últimas {product.stock}!
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
                    Agotado
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información del producto - Lado derecho */}
        <div className="lg:w-1/2">
          {/* Categoría y título */}
          <div className="mb-4">
            <Link
              href={`/productos?categoria=${product.category.toLowerCase()}`}
              className="text-xs text-gray-400 uppercase tracking-wider hover:text-gray-600 transition"
            >
              {product.category}
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mt-2">
              {product.name}
            </h1>
          </div>

          {/* Precio */}
          <div className="mb-6">
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            </div>
          </div>

          {/* Descripción */}
          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6 pb-6 border-b border-gray-100">
              {product.description}
            </p>
          )}

          {/* Variantes */}
          <div className="space-y-6 mb-8">
            {/* Colores */}
            {colors.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  {selectedColor && <span className="text-xs text-gray-500">{selectedColor}</span>}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={`color-${color}-${index}`}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        relative w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-200
                        ring-2 ring-offset-2 hover:scale-110
                        ${
                          selectedColor === color
                            ? 'ring-gray-900 ring-offset-2'
                            : 'ring-gray-200 hover:ring-gray-400'
                        }
                      `}
                      style={{ backgroundColor: color }}
                      aria-label={`Color ${color}`}
                    >
                      {selectedColor === color && (
                        <Check
                          size={14}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Talles */}
            {sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Talle</h3>
                  <button className="text-xs text-gray-500 hover:text-gray-900 underline">
                    Guía de talles
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={`size-${size}-${index}`}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        min-w-[44px] h-10 sm:h-11 px-3 sm:px-4 rounded-full border text-sm font-medium transition-all
                        ${
                          selectedSize === size
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Otras variantes */}
            {otherVariants.length > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {otherVariants.map((variant, index) => (
                  <div
                    key={`${variant.type}-${variant.value}-${index}`} // ✅ Key único
                    className="bg-gray-50 rounded-xl p-3"
                  >
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      {variant.type}
                    </h3>
                    <p className="text-sm text-gray-900 font-medium">{variant.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cantidad y stock */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Cantidad</h3>
              <p className="text-xs text-gray-500">Stock: {product.stock} unidades</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-full">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 sm:p-3 hover:bg-gray-100 rounded-l-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2 sm:p-3 hover:bg-gray-100 rounded-r-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Acciones rápidas */}
              <button
                onClick={handleShare}
                className="p-2 sm:p-3 border border-gray-300 rounded-full hover:border-gray-900 hover:bg-gray-50 transition"
                aria-label="Compartir"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={handleWishlist}
                className={`p-2 sm:p-3 border rounded-full transition ${
                  isLiked
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 hover:border-gray-900 hover:bg-gray-50'
                }`}
                aria-label="Agregar a favoritos"
              >
                <Heart size={18} className={isLiked ? 'fill-white' : ''} />
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              className={`
                w-full py-3.5 sm:py-4 rounded-full transition-all flex items-center justify-center gap-2
                font-medium text-sm sm:text-base
                ${
                  !isOutOfStock
                    ? 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
                ${addedToCart ? 'bg-green-600 hover:bg-green-600' : ''}
              `}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Agregando...
                </>
              ) : addedToCart ? (
                <>
                  <Check size={18} />
                  ¡Agregado al carrito!
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  {isOutOfStock ? 'Producto agotado' : 'Agregar al carrito'}
                </>
              )}
            </button>

            {!isOutOfStock && (
              <Link
                href="/cart"
                className="block w-full py-3.5 sm:py-4 text-center border border-gray-300 rounded-full hover:border-gray-900 hover:bg-gray-50 transition font-medium text-sm sm:text-base"
              >
                Comprar ahora
              </Link>
            )}
          </div>

          {/* Tabs de información */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex gap-4 sm:gap-6 border-b border-gray-100 overflow-x-auto">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  activeTab === 'description'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Descripción
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-3 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  activeTab === 'shipping'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Envíos
              </button>
              <button
                onClick={() => setActiveTab('returns')}
                className={`pb-3 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  activeTab === 'returns'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Devoluciones
              </button>
            </div>

            <div className="pt-6">
              {activeTab === 'description' && (
                <div className="prose prose-sm max-w-none text-gray-600">
                  <p className="text-sm leading-relaxed">
                    {product.description || 'No hay descripción disponible para este producto.'}
                  </p>
                  {product.variants && product.variants.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Especificaciones:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {product.variants.map((variant, i) => (
                          <li
                            key={`spec-${variant.type}-${variant.value}-${i}`}
                            className="text-sm"
                          >
                            <span className="font-medium capitalize">{variant.type}:</span>{' '}
                            {variant.value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Envío gratis</p>
                      <p className="text-sm">En compras superiores a $100</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Tiempo de entrega</p>
                      <p className="text-sm">3 a 7 días hábiles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Seguimiento</p>
                      <p className="text-sm">Recibirás un código de seguimiento por email</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'returns' && (
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Devoluciones gratis</p>
                      <p className="text-sm">Hasta 30 días después de la compra</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Compra protegida</p>
                      <p className="text-sm">
                        Reembolso garantizado si hay problemas con el producto
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">¿Cómo devolver?</span>
                      <br />
                      1. Contacta con nuestro soporte
                      <br />
                      2. Genera la etiqueta de devolución
                      <br />
                      3. Envía el producto
                      <br />
                      4. Recibe tu reembolso
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

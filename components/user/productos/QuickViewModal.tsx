// components/user/productos/QuickViewModal.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { X, Heart, ShoppingBag, Plus, Minus, Check } from 'lucide-react';
import Image from 'next/image';
import { PublicProduct } from '@/actions/user/product.user.action';

type Props = {
  product: PublicProduct;
  isOpen: boolean;
  onClose: () => void;
};

export default function QuickViewModal({ product, isOpen, onClose }: Props) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Separar variantes por tipo
  const colors = useMemo(() => product.colors || [], [product.colors]);
  const sizes = useMemo(() => product.sizes || [], [product.sizes]);

  // Otras variantes (como material, etc.)
  const otherVariants = useMemo(
    () => product.variants?.filter((v) => v.type !== 'color' && v.type !== 'size') || [],
    [product.variants],
  );

  // Resetear estado cuando cambia el producto
  useEffect(() => {
    setSelectedColor(colors[0] || null);
    setSelectedSize(null);
    setQuantity(1);
    setAddedToCart(false);
  }, [product.id, colors]);

  // Bloquear scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize && sizes.length > 0) {
      alert('Por favor selecciona un talle');
      return;
    }

    setIsAddingToCart(true);
    // Aquí iría tu lógica real de carrito
    console.log('Agregando al carrito:', {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsAddingToCart(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleAddToWishlist = async () => {
    setIsLiked(!isLiked);
    console.log('Agregando a favoritos:', product.id);
  };

  if (!isOpen) return null;

  const hasColorAndSize = colors.length > 0 && sizes.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in duration-300 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-all hover:scale-110"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 p-6 bg-gray-50">
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-100 relative group">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <ShoppingBag size={48} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Sin imagen disponible</p>
                  </div>
                </div>
              )}

              {product.stock < 5 && product.stock > 0 && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  ¡Últimas {product.stock} unidades!
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
                    Agotado
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="md:w-1/2 p-6 md:p-8">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              {product.category}
            </span>

            <h2 className="text-2xl font-light text-gray-900 mt-1 mb-2">{product.name}</h2>

            <p className="text-2xl font-medium text-gray-900 mb-6">${product.price}</p>

            {product.description && (
              <p className="text-sm text-gray-600 mb-8 leading-relaxed border-b border-gray-100 pb-6">
                {product.description}
              </p>
            )}

            {/* Variants Section - Grid layout */}
            <div className="space-y-6 mb-8">
              {/* Colors & Sizes side by side */}
              {(colors.length > 0 || sizes.length > 0) && (
                <div
                  className={
                    hasColorAndSize ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'space-y-6'
                  }
                >
                  {/* Colors */}
                  {colors.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Colores
                        {selectedColor && (
                          <span className="text-gray-500 font-normal ml-2">({selectedColor})</span>
                        )}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {colors.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedColor(color)}
                            className={`
                              relative w-10 h-10 rounded-full transition-all duration-200
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

                  {/* Sizes */}
                  {sizes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Talles
                        {selectedSize && (
                          <span className="text-gray-500 font-normal ml-2">({selectedSize})</span>
                        )}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`
                              min-w-[40px] h-10 px-3 rounded-full border text-sm font-medium transition-all
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
                      <button className="text-xs text-gray-500 hover:text-gray-900 underline mt-2 inline-block">
                        Guía de talles →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Other Variants (Material, etc.) - Grid responsive */}
              {otherVariants.length > 0 && (
                <div
                  className={`
                  grid gap-4
                  ${otherVariants.length === 1 ? 'grid-cols-1' : ''}
                  ${otherVariants.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : ''}
                  ${otherVariants.length >= 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}
                `}
                >
                  {otherVariants.map((variant) => (
                    <div key={variant.type} className="bg-gray-50 rounded-lg p-3">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        {variant.type}
                      </h3>
                      <p className="text-sm text-gray-900 font-medium">{variant.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Cantidad</h3>
              <div className="flex items-center gap-3 border border-gray-300 rounded-full w-fit">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 rounded-l-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="p-2 hover:bg-gray-100 rounded-r-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={16} />
                </button>
              </div>
              {product.stock > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Stock disponible: {product.stock} unidades
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className={`
                w-full py-3 rounded-full transition-all flex items-center justify-center gap-2 mb-4
                ${
                  product.stock > 0
                    ? 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
                ${addedToCart ? 'bg-green-600 hover:bg-green-600' : ''}
              `}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                  Agregar al carrito
                </>
              )}
            </button>

            {/* Add to Wishlist Button */}
            <button
              onClick={handleAddToWishlist}
              className="w-full py-3 border border-gray-300 rounded-full hover:border-gray-900 transition-all flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Heart
                size={18}
                className={`transition-all ${isLiked ? 'fill-gray-900 text-gray-900' : ''}`}
              />
              {isLiked ? 'Agregado a favoritos' : 'Agregar a favoritos'}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                🚚 Envío gratis en compras mayores a $100
              </p>
              <p className="text-xs text-gray-400 text-center mt-2">
                🔄 Devoluciones gratis hasta 30 días
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

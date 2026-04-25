import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'María González',
      role: 'Cliente frecuente',
      comment: 'Excelente servicio y productos de calidad. Los envíos son muy rápidos.',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Comprador verificado',
      comment: 'Me encanta la variedad de productos. Siempre encuentro lo que busco.',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      role: 'Cliente premium',
      comment: 'El soporte al cliente es increíble. Muy recomendable.',
      rating: 5,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-center mb-8 sm:mb-12">
          Lo que dicen nuestros clientes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">{testimonial.comment}</p>
              <div>
                <p className="font-medium text-gray-900">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

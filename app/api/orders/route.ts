import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, items, deliveryMethod, paymentMethod, total, deliveryAddress, selectedStore } =
      await req.json();

    console.log('Enviando correo a:', email);

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
      }).format(price);
    };

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const shippingCost = deliveryMethod === 'delivery' ? 15 : 0;

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: '✨ ¡Pedido confirmado! Gracias por comprar en Matt',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de pedido - Matt</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width: 560px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 35px -10px rgba(0,0,0,0.05); overflow: hidden;">
            
            <!-- Header con gradiente -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 32px; text-align: center;">
              <i class="fas fa-shopping-bag" style="font-size: 48px; color: #ffffff; margin-bottom: 16px;"></i>
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0 0 8px 0; letter-spacing: -0.5px;">
                ¡Gracias por tu compra!
              </h1>
              <p style="color: #d1d5db; font-size: 15px; margin: 0; line-height: 1.5;">
                Hemos recibido tu pedido y lo estamos procesando
              </p>
            </div>

            <!-- Contenido principal -->
            <div style="padding: 32px;">
              
              <!-- Badge de estado -->
              <div style="background-color: #f0fdf4; border-left: 3px solid #22c55e; padding: 14px 16px; border-radius: 12px; margin-bottom: 32px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <i class="fas fa-check-circle" style="color: #22c55e; font-size: 18px;"></i>
                  <span style="color: #166534; font-weight: 500; font-size: 14px;">Pedido confirmado</span>
                </div>
              </div>

              <!-- Productos -->
              <div style="margin-bottom: 28px;">
                <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
                  <i class="fas fa-box" style="font-size: 20px; color: #6b7280;"></i> Resumen del pedido
                </h2>
                
                <div style="background-color: #f9fafb; border-radius: 16px; padding: 4px 0;">
                  ${items
                    .map(
                      (item: any) => `
                    <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; gap-8;">
                      <div style="flex: 1;">
                        <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${item.name}</div>
                        <div style="font-size: 13px; color: #6b7280;">Cantidad: ${item.quantity}</div>
                      </div>
                      <div style="font-weight: 600; color: #111827;">${formatPrice(item.price * item.quantity)}</div>
                    </div>
                  `,
                    )
                    .join('')}
                </div>
              </div>

              <!-- Detalles del pago -->
              <div style="background-color: #f9fafb; border-radius: 16px; padding: 20px; margin-bottom: 28px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; gap-8;">
                  <span style="color: #6b7280;">Subtotal</span>
                  <span style="color: #111827;">${formatPrice(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; gap-8;">
                  <span style="color: #6b7280;">Envío</span>
                  <span style="color: #111827;">${deliveryMethod === 'delivery' ? formatPrice(15) : 'Gratis'}</span>
                </div>
                <div style="border-top: 2px solid #e5e7eb; margin: 16px 0; padding-top: 16px;">
                  <div style="display: flex; justify-content: space-between; gap-8;">
                    <span style="font-weight: 700; color: #111827; font-size: 18px;">Total</span>
                    <span style="font-weight: 700; color: #111827; font-size: 20px;">${formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <!-- Información de entrega -->
              <div style="margin-bottom: 28px;">
                <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
                  <i class="fas ${deliveryMethod === 'delivery' ? 'fa-truck' : 'fa-store'}" style="font-size: 20px; color: #6b7280;"></i>
                  ${deliveryMethod === 'delivery' ? 'Detalles de envío' : 'Punto de recojo'}
                </h2>
                
                <div style="background-color: #f9fafb; border-radius: 16px; padding: 20px;">
                  ${
                    deliveryMethod === 'delivery'
                      ? `
                    <div style="margin-bottom: 12px;">
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Dirección</div>
                      <div style="color: #111827; font-weight: 500;">${deliveryAddress?.address || '-'}</div>
                    </div>
                    <div style="margin-bottom: 12px;">
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Destinatario</div>
                      <div style="color: #111827;">${deliveryAddress?.recipientName || '-'}</div>
                    </div>
                    <div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Teléfono</div>
                      <div style="color: #111827;">${deliveryAddress?.phone || '-'}</div>
                    </div>
                  `
                      : `
                    <div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Tienda</div>
                      <div style="color: #111827; font-weight: 500;">${selectedStore?.name || '-'}</div>
                      ${
                        selectedStore?.address
                          ? `
                        <div style="font-size: 13px; color: #6b7280; margin-top: 8px;">${selectedStore.address}</div>
                      `
                          : ''
                      }
                    </div>
                  `
                  }
                </div>
              </div>

              <!-- Método de pago -->
              <div style="margin-bottom: 28px;">
                <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
                  <i class="fas fa-credit-card" style="font-size: 20px; color: #6b7280;"></i> Método de pago
                </h2>
                
                <div style="background-color: #f9fafb; border-radius: 16px; padding: 16px 20px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas ${paymentMethod === 'card' ? 'fa-credit-card' : paymentMethod === 'yape' ? 'fa-mobile-alt' : 'fa-money-bill-wave'}" style="font-size: 22px; color: #6b7280;"></i>
                    <span style="color: #111827; font-weight: 500;">
                      ${paymentMethod === 'card' ? 'Tarjeta de crédito/débito' : paymentMethod === 'yape' ? 'Yape / Plin' : 'Efectivo contra entrega'}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Mensaje adicional -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <i class="fas fa-headset" style="font-size: 28px; color: #ffffff; margin-bottom: 12px;"></i>
                <p style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px; line-height: 1.5;">
                  ¿Tienes alguna pregunta sobre tu pedido?
                </p>
                <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 13px;">
                  Contáctanos y te atenderemos encantados
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <i class="fas fa-store" style="color: #9ca3af; font-size: 20px; margin-bottom: 8px;"></i>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                Matt Store — Moda con estilo
              </p>
              <p style="color: #d1d5db; font-size: 11px; margin: 4px 0 0 0;">
                Este es un correo automático, por favor no responder
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Error de Resend:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    console.log('Correo enviado correctamente:', data);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error('Error en API:', error);
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 });
  }
}

🔄 COMANDOS IMPORTANTES
➕ Crear nueva migración
npx prisma migrate dev --name nombre_del_cambio
🔄 Aplicar migraciones existentes
npx prisma migrate dev
🧹 Resetear base de datos (DEV ONLY)
npx prisma migrate reset

⚠️ Elimina todos los datos

⚡ Sin migraciones (solo sincronizar)
npx prisma db push

❌ No usar en producción

🔄 Regenerar cliente
npx prisma generate
👀 Ver base de datos (UI)
npx prisma studio
🌱 Ejecutar seed
npx prisma db seed
🚀 Producción
npx prisma migrate deploy
🧠 CASOS COMUNES
➕ Agregar nueva tabla
Editar schema.prisma
Ejecutar:
npx prisma migrate dev --name add_table

✔ No borra datos

➕ Agregar nueva columna
✅ Forma segura
phone String?
npx prisma migrate dev --name add_phone
⚠️ Si debe ser obligatoria
Crear como opcional:
phone String?
Migrar:
npx prisma migrate dev --name add_phone_optional
Llenar datos manualmente
Hacer obligatoria:
phone String
Migrar:
npx prisma migrate dev --name make_phone_required
✏️ Modificar columnas

⚠️ Puede fallar si rompe datos
Usar migraciones graduales

❌ Eliminar tablas o columnas
// eliminar modelo o campo

Luego:

npx prisma migrate dev --name remove_field

⚠️ Esto elimina datos

🧨 Eliminar todas las migraciones (extremo)
rm -rf prisma/migrations

Luego:

npx prisma migrate dev --name init
# mis-ecommerce-matt

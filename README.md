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

La causa real (lee el final del error)
cause: 'RSA public key is not available client side. Either set option
`cachingRsaPublicKey` to indicate public key path, or allow public key
retrieval with option `allowPublicKeyRetrieval`'
Tu MySQL (versión 8+) usa por defecto el plugin de autenticación caching_sha2_password, que requiere encriptar la contraseña con una clave RSA pública. El driver MariaDB que usa Prisma no puede obtenerla → falla silenciosamente → el pool nunca consigue una conexión → después de 10 segundos explota con el pool timeout.
El pool timeout es el síntoma, no la causa.

Solución
Agrega allowPublicKeyRetrieval: true en la configuración del adapter en lib/prisma.ts:
tsimport { PrismaClient } from "../app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaMariaDb({
host: process.env.DATABASE_HOST ?? "localhost",
user: process.env.DATABASE_USER ?? "root",
password: process.env.DATABASE_PASSWORD ?? "",
database: process.env.DATABASE_NAME ?? "",
port: Number(process.env.DATABASE_PORT ?? 3306),
connectionLimit: 5,
allowPublicKeyRetrieval: true, // 👈 esto soluciona el error RSA
});

const prisma =
globalForPrisma.prisma ||
new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

Alternativa más limpia (recomendada para producción)
En lugar de allowPublicKeyRetrieval, cambiar el usuario de MySQL para que use el plugin de autenticación antiguo que no necesita RSA. En tu terminal MySQL:
sqlALTER USER 'root'@'localhost'
IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;
Esto es más seguro porque no expones la recuperación pública de claves, y funciona sin tocar el código.

Resumen
OpciónProsContrasallowPublicKeyRetrieval: trueRápido, sin tocar MySQLLigero riesgo en producción sin SSLmysql_native_passwordMás seguro, sin cambios en códigoHay que ejecutar SQL en el servidor
Para desarrollo local, cualquiera de las dos funciona. Si usas esto en producción eventualmente, prefiere el cambio de plugin o configura SSL.

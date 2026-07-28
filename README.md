# Colección de Vinos

Una aplicación web elegante para gestionar y explorar una colección de vinos, construida con Next.js, TypeScript, Tailwind CSS y Neon (PostgreSQL).

## Características

- 🍷 Visualización de vinos con diseño elegante
- 🔍 Búsqueda y filtrado avanzado
- 📄 Paginación integrada
- ❤️ Favoritos
- 📊 Estadísticas de la colección
- 🔐 Panel de administración protegido por contraseña
- ✉️ Formularios de contacto y newsletter (UI; aún sin backend conectado)
- 📱 Diseño responsivo
- 🎨 Tema oscuro con tonos vinosos

## Requisitos

- Node.js 18.x o superior
- npm o yarn
- Una base de datos PostgreSQL (Neon) accesible vía `DATABASE_URL`

## Configuración Local

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd vinosNext
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno en `.env.local`:
```
# Base de datos (Neon / PostgreSQL)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Contraseña del panel de administración
ADMIN_PASSWORD="tu-password-de-admin"
```

4. Inicia el servidor de desarrollo (puerto 3001):
```bash
npm run dev
```

## Scripts

```bash
npm run dev      # desarrollo en el puerto 3001
npm run build    # build de producción
npm run start    # servir el build
npm run lint     # linter
npm run test     # tests con Vitest
```

## Despliegue en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Importa el repositorio
3. Configura las variables de entorno en el dashboard:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD`

## Estructura de la Base de Datos

La tabla `vinos` en Neon se consulta directamente con `pg` (`app/utils/db.ts` + `app/utils/wines-db.ts`). Campos:

- Id (int8)
- Title (text)
- Vintage (int4)
- Country (text)
- Province (text)
- Variety (text)
- Points (int4)
- Price (float8)
- Winery (text)
- Designation (text, opcional)

## Tecnologías Utilizadas

- [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Neon](https://neon.tech/) (PostgreSQL) con el driver [`pg`](https://node-postgres.com/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (formularios y validación)
- [Headless UI](https://headlessui.com/) + [Heroicons](https://heroicons.com/)
- [react-hot-toast](https://react-hot-toast.com/) (notificaciones)
- [Vitest](https://vitest.dev/) (tests)

> Nota: el proyecto migró de Supabase a Neon. Quedan variables/código de Supabase (`app/utils/supabase.ts`) como legado, pero ya no se usan.

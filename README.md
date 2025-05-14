# Colección de Vinos

Una aplicación web elegante para gestionar y explorar una colección de vinos, construida con Next.js, TypeScript, Tailwind CSS y Supabase.

## Características

- 🍷 Visualización de vinos con diseño elegante
- 🔍 Búsqueda y filtrado avanzado
- 📱 Diseño responsivo
- 🎨 Tema oscuro con tonos vinosos
- 📊 Paginación integrada

## Requisitos

- Node.js 18.x o superior
- npm o yarn
- Cuenta de Supabase

## Configuración Local

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd wine-collection
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env.local` con:
```
NEXT_PUBLIC_SUPABASE_URL="tu-url-de-supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-clave-anonima"
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Despliegue en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Instala Vercel CLI:
```bash
npm i -g vercel
```

3. Despliega:
```bash
vercel
```

4. Configura las variables de entorno en el dashboard de Vercel:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

## Estructura de la Base de Datos

La tabla `vinos` en Supabase debe tener los siguientes campos:

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

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)

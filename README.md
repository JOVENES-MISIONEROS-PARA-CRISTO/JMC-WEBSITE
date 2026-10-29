# JMC · Jóvenes Misioneros para Cristo

Sitio web del grupo de jóvenes de la Parroquia del Señor de la Misericordia (Ocotlán, Jalisco).

**Stack:** React + TypeScript + Vite · Tailwind CSS · componentes estilo shadcn/ui · Motion · Supabase · Vercel

## Correr en local
```bash
npm install
cp .env.example .env     # pega tus claves de Supabase
npm run dev
```

## Qué editar primero
- `src/data/site.ts`: horarios de reuniones, WhatsApp, Instagram, Facebook, correo, textos de actividades y galería.
- Fotos: súbelas a `public/galeria/` y agrega `src: '/galeria/foto.jpg'` en `GALERIA`.
- Logos: `src/assets/` (JMC, Ea's y Señor de la Misericordia).

## Supabase
1. Crea un proyecto y ejecuta `supabase/schema.sql` en el SQL Editor.
2. En Authentication desactiva el registro público y crea manualmente los usuarios administradores.
3. Pega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env`.
4. Entra a `/admin` para publicar eventos y ver quién quiere unirse.

## Publicar en Vercel
Sube el repo a GitHub, impórtalo en Vercel y agrega las dos variables de entorno. `vercel.json` ya maneja las rutas (`/admin`).

## Paleta
`#A3098D` · `#C2188B` · `#582078` · `#FFFFFF` · `#242124`

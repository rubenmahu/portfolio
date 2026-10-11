<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reglas del proyecto

Mi portfolio personal. El plan, las etapas, las decisiones y el estado viven en el Tablero "Tareas personales" de Notion (una tarjeta por etapa). Consúltalo solo si te lo pido; al cerrar un paso, actualiza la tarjeta de su etapa.

## Stack

- Next.js (App Router) + React + TypeScript estricto.
- Estilos: CSS Modules. Sin Tailwind ni otras librerías de estilos.
- Contenido: ficheros JSON separados del código, fuente única que leen la web y la IA. Añadir una tecnología o un proyecto es editar datos, no componentes.
- Tests: Vitest + Testing Library.
- Formato: Prettier.
- Despliegue: Vercel. Repo público con licencia MIT; el contenido personal no se reutiliza.
- Accesibilidad WCAG AA y diseño responsive.

## Estructura

```
content/                 # datos en JSON (fuente única)
src/
  app/                   # rutas de Next: page.tsx, layout.tsx, globals.css
  components/
    sections/<Seccion>/  # una sección de la web: Seccion.tsx, .module.css y .test.tsx
    ui/<Componente>/     # piezas reutilizables del estilo C (bloque, etiqueta...)
  lib/                   # acceso a datos y utilidades (content.ts)
  types/                 # tipos (content.ts)
```

- Cada carpeta se crea cuando hace falta, no antes.
- `ui` no importa de `sections`. `sections` puede usar `ui`, `lib` y `types`.
- Sin archivos barrel (`index.ts`).
- Los datos se leen solo con `getProfile()` y `getStack()` de `src/lib/content.ts`; los componentes no importan los JSON.

## Comandos

- `npm run lint`: ESLint.
- `npm run build`: compila y comprueba tipos.
- `npm run test`: Vitest, una sola pasada (también para hooks y CI).
- `npm run test:watch`: Vitest en modo vigilancia.
- `npm run format`: Prettier, reescribe los archivos.
- `npm run format:check`: Prettier, solo comprueba.
- Antes de dar un paso por cerrado: `lint`, `test`, `format:check` y `build`.

## Código

- Componentes React: se declaran como `function Nombre() {}` y el `export` va al final del archivo (`export default Nombre;`), no en la declaración.

## Idioma

- Código, nombres, commits (Conventional Commits) y ramas: inglés.
- Documentación y contenido de la web: español, sin rayas largas ni tópicos de IA (skill `humanizar-es`).

## Forma de trabajar

- Antes de editar, di qué archivos tocas y qué cambia en cada uno. Espera mi OK si son más de 3 archivos o cambia una interfaz pública, una API o el modelo de datos.
- Pasos pequeños: un cambio lógico por vez, revisable en menos de 5 minutos. Sin refactors ni cambios fuera de lo pedido; las mejoras se mencionan al final.
- Yo reviso cada diff y hago los commits. No hagas commit ni push.
- Al terminar cada paso, resume qué cambió y cómo se verificó (lint, build, tests).
- Si algo es ambiguo, pregunta antes de suponer.

## Documentación de librerías

- Antes de usar una API de Next, React, Vitest u otra librería, consulta su documentación con Context7. En Next, además, lee la guía correspondiente de `node_modules/next/dist/docs/`.

## Etapas

- Al empezar una etapa, lee su tarjeta en Notion (campo Contexto: skills a usar y criterio de hecho).
- Una etapa no empieza hasta cerrar la anterior.
- Las decisiones técnicas se anotan en la tarjeta de la etapa.

## No tocar

- El bloque de Next de este archivo (arriba), que regenera `next dev`.
- `next-env.d.ts`.

## Diseño

- Dirección visual: estilo C, "Taller de bloques": bloques con bordes gruesos y sombra dura, paleta arena, oliva y cobalto. El mockup está en la tarjeta de la etapa 2 en Notion.
- Respeta `prefers-reduced-motion`.
- No instales three.js ni React Three Fiber hasta que yo lo pida.

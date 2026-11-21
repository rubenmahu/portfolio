@AGENTS.md

# Criterios de frontend

Orden de prioridad: reglas de `AGENTS.md` > seguridad > memory leaks > correctitud > ESLint > rendimiento > accesibilidad.

## Seguridad

- No uses `dangerouslySetInnerHTML` ni `innerHTML` sin sanear antes. Si hace falta, explica por qué.
- No guardes tokens ni datos sensibles en `localStorage` ni `sessionStorage`.
- No dejes secretos en el código ni datos sensibles en logs.
- Trata toda entrada externa (formularios, URL, respuestas de API) como no confiable.

## Memory leaks

- Todo timer, listener u observer (`setInterval`, `addEventListener`, `IntersectionObserver`) tiene su limpieza en el `return` del `useEffect`.

## Correctitud

- Cubre los estados vacío, carga y error en cada vista que pida datos.
- Valida los formularios y maneja los errores de la API.
- Revisa las condiciones de carrera (peticiones solapadas, navegación rápida).

## TypeScript

- Sin `any`, sin casts inseguros y sin `!` injustificados. Si no hay alternativa, comenta el motivo.
- Modela el dominio con tipos precisos (uniones discriminadas, `unknown` en vez de `any` para datos externos).

## Diseño

- Responsabilidad única: un componente o hook hace una cosa. Si mezcla pedir datos, transformarlos y pintarlos, sepáralo.
- Componentes de más de ~200 líneas o funciones de más de ~40 se dividen o se justifican.
- Extiende por composición (`props`, `children`), no con flags booleanos añadidos a componentes existentes.
- La UI no llama a la API directamente: pasa por una función de `lib` o un hook.
- Props mínimas. Si un componente recibe más de ~7, replantea su responsabilidad.
- Composición antes que herencia.
- No crees abstracciones hasta que haya un segundo uso real.
- Nada de carpetas `utils` o `helpers` genéricas: nombra por lo que hace.

## Rendimiento

- `key` estable en las listas.
- Evita recálculos y renders innecesarios, y no añadas librerías pesadas sin avisar.

## Accesibilidad

- HTML semántico, `alt`, labels, `aria` donde haga falta y uso con teclado.

## Tests

- Prueba comportamiento, no implementación.

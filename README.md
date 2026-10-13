# NEON STRIKE 3D

Juego de acción 3D en primera persona para navegador, construido con Three.js y Vite. Incluye movimiento FPS, salto/gravedad, colisiones con plataformas, sprint, disparo por raycasting, munición/recarga, tres sectores, enemigos con comportamientos diferentes, vida, puntuación, audio sintetizado y guardado local.

## Requisitos
- Node.js 20.19+ o 22.12+ recomendado.
- Navegador moderno con WebGL habilitado.

## Ejecutar en local
1. Descomprime el proyecto.
2. Abre una terminal dentro de `neon-strike-3d`.
3. Ejecuta `npm install`.
4. Ejecuta `npm run dev`.
5. Abre la URL que Vite muestra (normalmente `http://localhost:5173`).

Para comprobar la compilación de producción: `npm run build`. Después puedes servir `dist/` con cualquier hosting estático compatible.

## Controles
- **W A S D**: moverse.
- **Ratón**: mirar.
- **Clic izquierdo**: disparar / capturar el ratón.
- **Espacio**: saltar.
- **Shift**: correr.
- **R**: recargar.
- **Esc**: pausar y liberar el ratón.

## Notas
- El progreso y el mejor resultado se guardan en `localStorage` del navegador.
- Los efectos de audio se habilitan tras la primera interacción del usuario.
- El juego necesita un servidor HTTP local; abrir `index.html` directamente puede bloquear los módulos ES.
- Es un proyecto independiente jugable y ampliable, no una producción comercial certificada. Los navegadores y equipos varían; ejecuta `npm run build` para comprobarlo en tu entorno.

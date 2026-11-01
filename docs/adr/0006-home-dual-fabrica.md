# ADR-0006: Home dual orientado a acción y ruta `/fabrica`

- **Estado**: Aceptado
- **Fecha**: 2026-11-01
- **Plan**: `plan-fabrica-ia-fase2-2026-11-01.md` (sesión 5, Fase 2)

## Contexto

El dueño navegó el Modo Express en el celular y decidió el giro de producto: el home debe **guiar a la acción** (crear un empleado, entrar a la fábrica), no presentar información. Aprobó dos mockups como dirección (`imag/ui-inicio-minimalista.jpg`, home tipo app para móvil; `imag/ui-nuevo-empleado-burro.jpg`, flujo /crear) y fijó la regla responsive: **escritorio conserva la oficina animada** (`vista-web-desktop.jpg`, home actual con la escena) y **móvil muestra el home tipo app**. Además la Fase 2 del brief (§11.2) exige la pantalla de escena con cámara 2D y hotspots.

Restricciones: SEO (Google indexa mobile-first), LCP < 2,5 s en móvil 4G, aislamiento del resto del monorepo, `prefers-reduced-motion`, un solo CTA primario por pantalla, componentes de servidor por defecto.

## Decisión

1. **Una sola ruta `/[lang]` con ambas estructuras renderizadas en el servidor** y conmutación por CSS breakpoints (<1024 px = home app; ≥1024 px = oficina animada). Sin UA-sniffing ni redirecciones: el HTML lleva todo, Google indexa el home tipo app (que contiene todos los enlaces clave) y no hay flash de hidratación.
2. **La escena tiene un solo montaje en el DOM del home**: en móvil es la *tarjeta* dentro del flujo (overlay "Entrar a la fábrica" → `/[lang]/fabrica`; hotspots y arrastre desactivados por CSS en tarjeta); en escritorio es el *hero* interactivo como hoy. Una sola `next/image`, sin doble descarga.
3. **Ruta nueva `/[lang]/fabrica`**: escena a pantalla completa con cámara, hotspots, ficha y efectos (brief §5/§11.2). Es el destino de "Entrar a la fábrica" (móvil) y de "Explorar" (escritorio, que deja de apuntar a `/`). Enlazable con `?focus=<id>`: zoom de cámara al personaje + ficha abierta. Se añade a `SITE_PATHS` (sitemap/hreflang).
4. **Cabeceras**: en móvil el home usa cabecera de app (avatar circular → menú con Modo ingeniero · Modo express · CV · Soy técnico · idioma; pregunta central; botón "+" verde → `/crear`); las demás páginas conservan el header estándar. En escritorio el header actual cambia su CTA primario a "Crear empleado" → `/crear`. `MobileCtaBar` se oculta en el home (el "+" es el primario) y se mantiene en el resto. Un solo CTA primario por pantalla.
5. **Cámara**: `SceneCamera` ('use client', único componente con estado; el fondo sigue llegando como `children` server-rendered — ADR-0004) anima `--cam-x/--cam-y/--cam-zoom` con rAF y carga diferida (`next/dynamic`). Utilidades puras en `src/scene/camera.ts`. CSS transforms se mantiene (PixiJS solo si no da 60 fps, con ADR propio — ADR-0004).
6. **Herramientas**: `vitest` como **devDependency** para las unitarias de utilidades de cámara que exige el brief §10 (misma lógica que ADR-0005 con `@playwright/test`; impacto en runtime: cero).

## Alternativas consideradas

- **Dos rutas con redirect por User-Agent**: parte el SEO (Google vería una sola variante), duplica URLs y complica caché y back-button. Descartada.
- **Decidir en cliente con `matchMedia`**: flash de contenido incorrecto y JS antes del LCP. Descartada.
- **Dos montajes de la escena (tarjeta + hero)**: doble `<img>` y doble trabajo de cámara; la variante oculta con `priority` descargaría igual. Descartada por el montaje único.
- **Fullscreen con overlay client-side sin ruta**: pierde enlazabilidad (`?focus=<id>`) y el botón atrás nativo. Descartada.

## Consecuencias

- El home móvil pasa a ser lo que Google indexa; su LCP es texto (rápido). El escritorio mantiene la escena con `priority`.
- JS de cliente entra al home por primera vez (cámara, hotspots, efectos): se mide el delta de First Load JS en T8/T11 y todo va en chunks diferidos.
- `/express` y `/ingeniero` no cambian (red SEO intacta); el giro "orientado a acción" del Modo Express queda como decisión futura del dueño.
- La tarjeta móvil muestra el **plate** (sin personajes): correcto por diseño — los 4 personajes ausentes vuelven como sprites (ADR-0004).

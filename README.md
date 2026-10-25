# Portafolio · Abraham Mantilla

Web personal de una sola página: quién soy, qué hago, cómo lo hago, resultados, la galería de proyectos, el caso extra de SoffIA (CoreOS) y la llamada final «Tu próxima web». Español de España, pensada para dueños de negocio.

Es HTML, CSS y JS sin compilación. Todo se sirve desde el propio sitio, también las fuentes y las librerías: no se pide nada a Google ni a otros CDN (mejor para el RGPD y más rápido).

## Estructura

```
index.html                 contenido completo de la página
assets/css/style.css       base: la página se ve entera sin JS y con movimiento reducido
assets/css/flow.css        capa de movimiento (todo cuelga de .flow-on)
assets/js/main.js          cabecera, auroras, pausas fuera de la vista, galería «escenario» y puntos del carrusel
assets/js/flow.js          GSAP + ScrollTrigger + SplitText + Lenis (solo si cargan y no hay movimiento reducido)
assets/vendor/             gsap 3.15.0 (gsap, ScrollTrigger, Flip, SplitText) y lenis 1.3.4
assets/fonts/              Instrument Serif (normal y cursiva), Geist y Geist Mono, subconjunto latino
assets/img/covers/         portadas: {id}-1600/960.webp (16:9, escritorio) y {id}-m-720/480.webp (3:4, móvil)
assets/img/aurora/         texturas de aurora esmeralda (generadas con la skill)
assets/img/brand/          favicon, apple-touch-icon y og.jpg (1200 × 630)
vercel.json                cabeceras de seguridad y caché
```

## Verlo en local

```bash
python3 -m http.server 4380 --directory ~/Documents/PORTAFOLIO
```

Y abre http://127.0.0.1:4380.

## Publicar en Vercel

Con la CLI (la primera vez te pedirá iniciar sesión):

```bash
npx vercel --prod
```

O sube la carpeta a un repositorio de GitHub e impórtalo en vercel.com: no hace falta configurar nada, es un sitio estático.

Antes de publicar, revisa [PENDIENTES.md](PENDIENTES.md): permisos de los clientes, textos legales y dominio.

## Cómo funciona la galería

- **Escritorio con ratón (≥ 1024 px):** modo «escenario». La obra elegida ocupa la fila de arriba y las demás se colocan debajo en su orden. Al pasar el cursor por una portada, pasa a grande con una animación Flip y la anterior vuelve a la fila. Clic: abre la web en una pestaña nueva.
  - Solo reacciona a un movimiento real del ratón (90 ms de intención). Hacer scroll con el cursor quieto no reordena nada.
  - La obra que queda bajo el cursor tras un cambio no se activa hasta que el cursor sale de ella, para que no rebote.
  - Con Tab, la obra enfocada pasa a escena e Intro abre la web.
- **Móvil y tableta:** carrusel deslizable con scroll-snap y puntos. Cada portada es solo un enlace.
- **Sin JS:** carrusel (móvil) o rejilla de dos columnas (escritorio), con toda la información.

La obra que sale en escena al cargar es la que lleva `is-activa` en el HTML (ahora LáminasPro).

### Añadir o cambiar un proyecto

1. Copia un `<li class="obra">` en `index.html` y cambia `data-obra`, los `data-flip-id` (deben ser únicos), el enlace, los textos y las imágenes.
2. Portadas: captura la web a 1440 × 900 y 390 × 844. Exporta 16:9 a 1600 y 960 px y 3:4 a 720 y 480 px en WebP (calidad 80).
3. Con más de cuatro obras en la fila, cambia `repeat(4, …)` en `.galeria.is-escenario` de `style.css`.

## Tu foto

El medallón del héroe tiene el hueco preparado. Cuando tengas la foto (cuadrada, ≥ 800 px, WebP), añádela dentro de `.medallon`:

```html
<img class="medallon__foto" src="assets/img/brand/abraham.webp" alt="Abraham Mantilla" width="800" height="800">
```

Quita entonces `aria-hidden="true"` del `.medallon`, porque la foto sí es contenido. El monograma «AM» se oculta solo.

## WhatsApp

Cada botón abre WhatsApp (+34 643 389 239) con un mensaje distinto, para que sepas de dónde llega cada contacto:

- cabecera, héroe y cierre: «Hola Abraham, me gustaría un diagnóstico gratis de mi web.»
- tarjeta «Tu próxima web»: «Hola Abraham, vengo de tu portafolio y quiero mi próxima web.»

## Verificación (20 de octubre de 2026)

Medido con Chrome sin interfaz y las herramientas de la skill `mejora-landing-verificada`:

| Prueba | Resultado |
| --- | --- |
| Consola y red | 0 errores y 0 respuestas 4xx/5xx en todos los escenarios |
| Desbordamiento horizontal | 0 px en escritorio, móvil, movimiento reducido y sin librerías |
| Contraste (fondo sólido) | 0 fallos AA en 1366, 390 y movimiento reducido |
| Contraste sobre la aurora animada | AA en el peor momento (12 s de calentamiento, 4 momentos). Único aviso «puntual»: el subrayado esmeralda bajo «a su altura» (p5 = 13,4:1) |
| Encuadre del medallón | descentrado ≤ 0,5 px y 43–44 % de aire en 1366, 900 y 390 |
| Aurora | 0 repintados; en pausa fuera de la vista; ~+11 ms/s de hilo principal |
| Galería | 5/5 cambios correctos, sin rebote, sin saltos de scroll; Tab funciona |
| Carrusel móvil | 4/4 deslizamientos avanzan una tarjeta; los puntos la siguen |
| Peso y LCP (móvil, Slow 4G) | primera vista 384 KB; página entera 445 KB; LCP 2,24 s |
| Peso y LCP (escritorio, Slow 4G) | 532 KB; LCP 2,22 s |

# Concepto de diseño

## Punto de partida (respuestas del cuestionario)

- **Marca personal:** Abraham Mantilla, en remoto para toda España desde Almería. Mercado: España.
- **Tono:** premium y sobrio. La IA se menciona con sutileza (en el paso 3 del proceso).
- **Foco:** webs para negocios locales. Cliente ideal: dueños de empresa o negocio.
- **Lo que gana el cliente:** autoridad y confianza.
- **Titular:** «Tu negocio merece una web a su altura.»
- **Galería:** «Escenario» en escritorio (grande arriba, fila debajo) y carrusel en móvil. Portadas fijas.
- **Fondo y color:** oscuro sobrio con acento esmeralda. Movimiento: 4 sobre 5.
- **Precios:** solo presupuesto. Entrada: diagnóstico gratis por WhatsApp.
- **Cifras:** se cuentan tal cual. Círculo Gold vendió más de 15.000 USD y el 61 % de las visitas se registró. LáminasPro llegó a 30 contactos diarios a los 6 meses.

## Color con intención

| Color | Papel |
| --- | --- |
| Casi negro `#0b0d0c` (con un matiz verde) | Fondo único de toda la página, sin costuras entre secciones |
| Marfil `#ece8df` | Texto y **acción**: es el único color de botón |
| Esmeralda `#1f8a65` / `#5bcb9f` / `#9fe3c5` | **Lo que funciona**: resultados medidos, sistemas vivos («en línea», avisos de SoffIA), el aro de marca y la luz con la que la página empieza (aurora del héroe) y termina (aurora del cierre) |

El esmeralda nunca va en los botones. En el caso SoffIA coincide con el verde de WhatsApp, y eso refuerza el «sistema vivo».

## Tipografía

- **Instrument Serif:** titulares, nombres de proyecto, relato y cifras. Aporta la parte editorial y premium.
- **Geist:** texto de lectura.
- **Geist Mono:** etiquetas, numeración y datos. Es el guiño de desarrollador, usado con mesura.

## Estructura

1. **Héroe:** titular, propuesta, CTA de diagnóstico y dos pruebas. A la derecha, el medallón «AM» con el aro esmeralda (hueco para la foto).
2. **Proyectos (01):** galería «escenario» con LáminasPro, Círculo Gold, AutoglassBox, Menigar y «Tu próxima web».
3. **Sobre mí (02):** «Aprendí por mi cuenta. Y aprendí vendiendo.» El relato se ilumina palabra a palabra y después viene el trayecto de oficios.
4. **Qué hago (03):** seis servicios; «Webs para negocios locales» va marcado como especialidad.
5. **Cómo lo hago (04):** «Marketing primero. Código después.» Cinco pasos con una línea de progreso.
6. **Resultados (05):** tres cifras reales con contador y el beneficio, «autoridad y confianza».
7. **Caso extra (06), SoffIA · CoreOS:** caso de estudio con métricas y un chat de WhatsApp que se escribe con el scroll. Los avisos del sistema muestran «el modelo propone, la base de datos decide».
8. **Cierre:** «¿Hablamos de la tuya?», con el CTA de WhatsApp y la aurora de vuelta.

## Movimiento (4/5)

- **Héroe en profundidad:** la aurora va lenta, el emblema a media velocidad y el texto rápido. El scroll suma giro al aro.
- **Titulares:** suben línea a línea desde su máscara (SplitText).
- **Galería:** las portadas vuelan entre la escena y la fila con Flip.
- **Relato:** se ilumina palabra a palabra con el scroll.
- **Trayecto y proceso:** líneas que se llenan con el scroll; el paso en curso se enciende y los demás se atenúan al 72 %, sin bajar de AA.
- **Cifras:** cuentan hasta su valor una sola vez.
- **SoffIA:** el teléfono queda fijo (en escritorio, con el texto) y la conversación avanza con el scroll.
- **Ambiente:** aurora esmeralda en el héroe y el cierre. Solo `transform` y `opacity`, en pausa fuera de la vista.

Sin JS, sin librerías o con movimiento reducido, la página se ve completa y quieta. La capa solo se enciende con `.flow-on`.

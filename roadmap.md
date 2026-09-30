# CalTracker — Roadmap

## MVP actual

- Onboarding y estimación de calorías/macros.
- Dashboard diario y registro local de alimentos/comidas.
- Historial, peso, estadísticas básicas y perfil.
- Temas claro/oscuro y build EAS de APK/AAB configurada.

## Próximos hitos

1. Probar Expo Go en Android real y validar persistencia entre reinicios.
2. Añadir pruebas automatizadas para cálculos y reglas de registro.
3. Recalcular objetivos al cambiar datos personales y añadir equivalencias de porción por alimento.
4. Ampliar catálogo mediante proveedor remoto opcional y caché local.
5. Explorar lector de código de barras, recetas y comidas guardadas.
6. Diseñar y validar la monetización antes de introducir anuncios o compras en producción:
   - Incorporar anuncios con una experiencia no intrusiva y consentimiento/privacidad adecuados.
   - Definir una compra de apoyo al desarrollo que deshabilite los anuncios; el precio y el proveedor de pagos quedan pendientes de decisión.
   - Añadir en Perfil un ajuste para canjear códigos promocionales.
   - Ofrecer un código de prueba de siete días, canjeable una sola vez por usuario/cuenta verificada.
   - Incluir «Restaurar compras» para recuperar la compra de apoyo después de reinstalar o cambiar de dispositivo, sujeto a las reglas de Google Play.
   - Proporcionar una anulación permanente sin anuncios exclusiva de desarrollador solo mediante un mecanismo seguro de QA/servidor; no incluir un secreto fijo o validable únicamente en el cliente.
7. Evaluar sincronización y funciones avanzadas solo cuando el MVP esté validado.

Estas funciones comerciales son propuestas, no existen todavía en la aplicación. Antes de implementarlas hay que decidir modelo/precio, SDK compatible con Expo y requisitos de tienda. Las compras y pruebas deben verificarse contra una fuente confiable, no depender de flags editables en AsyncStorage. Las funciones futuras no deben hacer obligatoria la conexión a Internet ni presentar estimaciones nutricionales como consejo médico.

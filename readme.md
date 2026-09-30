# CalTracker

Contador de calorías local-first para Android con una experiencia rápida, estimaciones transparentes y datos privados en el dispositivo.

## Features implementadas

- Onboarding progresivo con validación, datos personales, actividad y selección de objetivo.
- Estimación BMR con Mifflin–St Jeor, TDEE por factores de actividad, objetivo calórico moderado y macros coherentes.
- Dashboard diario con calorías restantes, consumos, macros, comidas y accesos a alimentos recientes.
- Registro y edición/eliminación de comidas; catálogo local, alimentos personalizados y favoritos.
- Historial diario navegable, registro de peso con gráfico simple y métricas de 7/30 días.
- Perfil: objetivos/macros editables, tema claro/oscuro/sistema y borrado confirmado de datos.
- Persistencia local con AsyncStorage; la app no necesita conexión para el catálogo inicial ni el historial.
- Configuración EAS para APK de prueba y AAB de producción.

Los cálculos son estimaciones educativas, no una prescripción médica. Las necesidades individuales pueden variar. El objetivo automático no baja de 1.200 kcal.

## Tech Stack

- Expo SDK 57, React Native 0.86 y React 19.
- Expo Router y TypeScript estricto.
- AsyncStorage para persistencia local (tras una capa de repositorio migrable).
- npm y EAS Build.

## Requisitos

- Node.js 22.13 o superior (Node 22.14 verificado).
- npm 11, Git y Expo Go actualizado en Android.
- Para las builds remotas: cuenta Expo y EAS CLI mediante `npx eas-cli@latest`.
- No requiere Android Studio para desarrollo con Expo Go ni para EAS Build.

## Instalación

Desde la raíz del repositorio:

```bash
npm install
```

## Desarrollo

```bash
npx expo start
```

Escanea el QR desde Expo Go en Android; el ordenador y el teléfono deben poder comunicarse en la red local. Si la red bloquea multicast, prueba `npx expo start --tunnel`.

## Scripts

- `npm start`: inicia Expo.
- `npm run android`: inicia y solicita abrir en emulador Android disponible.
- `npm run ios`: inicia y solicita abrir simulador iOS disponible.
- `npm run web`: inicia web.
- `npm run typecheck`: comprueba TypeScript sin emitir archivos.
- `npm run lint`: ejecuta Expo lint (requiere configuración ESLint).

## EAS Build

La compilación es remota y no publica automáticamente en ninguna tienda. Inicia sesión con `npx eas-cli@latest login` y luego:

```bash
# APK instalable para pruebas Android
npx eas-cli@latest build --platform android --profile preview

# Android App Bundle (.aab) para Google Play
npx eas-cli@latest build --platform android --profile production
```

El proyecto EAS puede requerir asociar un `projectId` de tu cuenta antes de compilar por primera vez (`npx eas-cli@latest build:configure`). No se ha creado ni publicado un proyecto remoto.

## Estructura

- `app/`: rutas Expo Router, onboarding, dashboard, registro, historial, progreso y perfil.
- `components/`: primitivas de UI accesibles y tokens temáticos.
- `services/`: cálculos nutricionales, alimentos locales y repositorio de almacenamiento.
- `store/`: estado de aplicación e integración con persistencia.
- `types/`: modelos compartidos.
- `constants/`: configuración de tema.

## Estado del proyecto

MVP inicial implementado. Antes de considerar lista una versión de distribución deben completarse comprobaciones en dispositivo Android con Expo Go, las verificaciones TypeScript/lint/Expo Doctor y probar el ciclo de cierre/reapertura. Los campos del perfil, sexo y actividad pueden editarse en Perfil; al cambiar las medidas hay que volver a establecer manualmente el objetivo calórico y los macros deseados. Las porciones usan los valores nutricionales de referencia por 100 g (sin equivalencias específicas por alimento). El catálogo es inicial y local; no integra aún Open Food Facts.

## Roadmap

- Recalcular automáticamente las metas al modificar medidas o actividad; personalización de porciones por alimento.
- Pruebas unitarias automatizadas para cálculos y repositorio.
- Accesibilidad visual/auditiva y comprobación de contraste en dispositivo.
- Catálogo ampliado/API opcional, escáner de código de barras, comidas guardadas y recetas.
- Sincronización opcional, notificaciones y estadísticas avanzadas.

## Notas

- Los datos se guardan localmente en el dispositivo; borrar datos es irreversible.
- No hay datos demo inyectados en perfiles reales; el primer inicio muestra el onboarding y ofrece un catálogo de alimentos de referencia.
- `app.json` declara el nombre CalTracker y el slug `caltracker`.
- Expo Go usa la versión del SDK compatible con SDK 57; mantener paquetes Expo alineados con `npx expo install`.

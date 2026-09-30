# Manual técnico de CalTracker

Este documento describe la implementación que existe en el repositorio. Distingue el comportamiento real de las ideas del roadmap: anuncios, pagos, promociones y restauración **no están implementados** en la app actual.

## 1. Resumen arquitectónico

CalTracker es una aplicación React Native con Expo SDK 57, TypeScript estricto y Expo Router. Está organizada alrededor de rutas de pantalla en `app/`, una capa de estado basada en React Context en `store/`, operaciones y reglas de dominio en `services/`, modelos en `types/` y primitivas visuales en `components/`.

Flujo de datos normal:

1. `app/_layout.tsx` monta `AppProvider`.
2. `AppProvider` carga el objeto `AppData` con `appRepository.load()` desde AsyncStorage; mientras tanto `ready` es falso.
3. El navegador raíz redirige al onboarding si no existe un perfil terminado, o a las pestañas una vez completado.
4. Las pantallas consultan `useApp()` y ejecutan acciones del contexto para mutar datos.
5. El provider crea el siguiente objeto de estado, actualiza React y persiste el objeto completo en AsyncStorage.
6. Las pantallas calculan sus vistas y agregados a partir de ese estado. No se contacta a un backend.

La unidad de persistencia es actualmente un único JSON bajo `@caltracker/data-v1`. `AppData` separa perfil, alimentos, comidas, pesajes y tema, pero el repositorio no es una base relacional ni implementa migraciones de esquema.

## 2. Archivos de configuración y raíz

### `package.json`

Declara el paquete `caltracker`, el punto de entrada `expo-router/entry`, las dependencias Expo/React Native compatibles y los scripts `start`, `android`, `ios`, `web`, `typecheck` y `lint`. AsyncStorage es el almacenamiento nativo utilizado. Las dependencias de navegación y módulos nativos se deben alinear con el SDK usando `npx expo install`.

### `package-lock.json`

Bloquea el árbol de dependencias de npm. Se debe regenerar con npm al cambiar dependencias, no editarlo a mano.

### `app.json`

Configuración Expo: nombre visible CalTracker, slug `caltracker`, esquema de deep link, orientación vertical, iconos, modo automático, plugin Expo Router/splash y rutas tipadas. También contiene el `android.package` y, si el proyecto ya fue enlazado, el `extra.eas.projectId`. Este último identifica el proyecto EAS; no constituye una credencial de compras.

### `eas.json`

Define perfiles de build remota: `preview` usa distribución interna y `android.buildType: apk`, mientras `production` usa `app-bundle` y autoincremento. Esto prepara artefactos; no inicia builds ni publica en Google Play.

### `tsconfig.json`

Extiende la configuración Expo, activa `strict` y define el alias `@/*` hacia la raíz del código (`@/services/...`, `@/types`, etc.).

### `eslint.config.js`

Carga la configuración flat recomendada por Expo y excluye el resultado de exportación `dist/`.

### `.gitignore`

Excluye módulos instalados, cachés/builds Expo, archivos de entorno local y productos TypeScript. El estado presente añade una sección generada por Expo CLI para `expo-env.d.ts`; conservarla al actualizar.

### `readme.md` y `roadmap.md`

El README es la guía breve de instalación, desarrollo y builds, y declara limitaciones. El roadmap describe hitos futuros que no deben presentarse como prestaciones implementadas.

### `assets/`

`assets/images/` contiene iconos y splash consumidos por `app.json`. `assets/fonts/SpaceMono-Regular.ttf` es el recurso de tipografía de la plantilla; las pantallas actuales usan mayormente tipografías del sistema.

## 3. Rutas y navegación: `app/`

### `app/_layout.tsx`

Es el layout raíz. `RootLayout` envuelve la app en `AppProvider`. `RootNavigator` lee `ready` y `onboardingComplete`, configura el color de fondo/status bar y monta un `Stack` de Expo Router. Mientras carga AsyncStorage muestra un indicador. Un efecto redirige a `/onboarding` si falta completar el perfil y a `/(tabs)` cuando el usuario ya terminó el onboarding.

La ruta `add-food` se presenta como modal. La carga del provider precede a la navegación normal.

### `app/onboarding.tsx`

Flujo de cuatro pasos con el nombre opcional; sexo, edad, altura, peso y peso objetivo; actividad; y objetivo (perder, definir o mantener). `Choice` representa opciones accesibles como radios. `validate()` valida edad, estatura y pesos en el paso corporal usando `validateProfileField()`.

`next()` avanza o, en el paso final, crea `Profile`: obtiene TDEE, estima calorías con el déficit correspondiente, calcula macros, persiste mediante `saveProfile()` y navega al dashboard. Las opciones de retroceso conservan el estado mientras la pantalla siga montada. La pantalla avisa que son estimaciones, no prescripción médica.

### `app/(tabs)/_layout.tsx`

Configura cuatro pestañas: Inicio, Historial, Progreso y Perfil. Colores y fondo de la barra se adaptan al tema. `TabIcon` renderiza símbolos de texto mediante componentes nativos.

### `app/(tabs)/index.tsx` — Dashboard

`dateKey()` se importa de `services/date.ts` para determinar el día local actual. La pantalla filtra comidas del día, suma calorías y macros, calcula calorías restantes y progreso porcentual, y presenta el objetivo del perfil, lista de comidas y algunos alimentos ya utilizados. `MealRow` abre la ruta de registro con `mealId` para editar. Los chips de elementos recientes y el botón principal navegan a `add-food`.

Los agregados se derivan al renderizar; no se guardan duplicados. La barra visual limita su ancho al 100% y el saldo visible limita el mínimo a cero aunque los datos hayan excedido el objetivo.

### `app/add-food.tsx` — búsqueda y registro

Lee `foodId` y `mealId` desde parámetros de ruta. Con `foodId` preselecciona un alimento; con `mealId` prepara la edición del registro existente. `searchFoods()` filtra el catálogo local y prioriza favoritos.

Al seleccionar alimento se introduce cantidad (predeterminada 100) y comida. Los nutrientes se escalan como `valor_por_100_g * cantidad / 100`. Es importante: la opción visual «porción» actualmente solo etiqueta la unidad; no implementa conversiones o gramajes por alimento.

La modalidad de alimento personalizado captura nombre y nutrientes por 100 g. `save()` valida nombre, cantidad positiva no superior a 5.000 y campos numéricos no negativos (máximo 1.000); guarda el alimento y crea/actualiza un `MealEntry`, luego vuelve. La edición permite borrar con confirmación nativa. La estrella llama `toggleFavorite()`.

Un detalle del modelo: en edición, el registro conserva la fecha original. Los nutrientes por 100 g se reconstruyen dividiendo los totales guardados por la cantidad original.

### `app/(tabs)/history.tsx` — historial

Mantiene una fecha seleccionada local a la pantalla; anterior/siguiente cambian un día, sin permitir navegar después de hoy. Filtra los `MealEntry` por clave ISO local, resume kcal/macros frente al objetivo actual del perfil y muestra cada comida. No conserva un snapshot del objetivo que estaba vigente históricamente: el valor comparado es el perfil actual.

### `app/(tabs)/progress.tsx` — peso

Ordena localmente `WeightEntry` por fecha. Deriva peso actual, peso inicial y progreso respecto al peso objetivo con `calculateProgress()`. Si existen al menos dos pesajes, dibuja columnas nativas proporcionales con los últimos doce valores; sin datos suficientes muestra instrucciones.

`save()` valida 35–300 kg y llama `addWeight()`. El provider reemplaza una entrada que ya tenga la misma fecha, por lo que solo hay un pesaje diario.

### `app/(tabs)/profile.tsx` — perfil y estadísticas

Calcula promedios de calorías sobre los días con datos de las ventanas 7 y 30 días, cantidad de fechas registradas, peso medio entre pesajes y adherencia aproximada (días cuyo total está dentro de ±10% de la meta actual). La adherencia no evalúa días sin registros.

Los campos locales editables incluyen nombre, sexo, edad, altura, pesos, actividad, objetivo, calorías y macros. `setGoal()` calcula nuevos valores sugeridos a partir de los campos de entrada; `save()` valida y guarda el perfil. Cambiar medidas/actividad no persiste por sí mismo: hay que guardar. Cambiar objetivo propone calorías y macros, que el usuario puede editar antes de guardar.

El selector visual llama `setTheme()`. Borrar datos abre una confirmación; `clearAll()` elimina el objeto local y luego la pantalla retorna al onboarding.

**No existe sección de códigos promocionales, pagos, anuncios ni botón de restauración en la versión actual.** Se planifican en el roadmap.

### `app/+not-found.tsx`

Pantalla localizada para una ruta no encontrada con enlace al inicio.

### `app/modal.tsx`

Ruta de compatibilidad con la plantilla antigua; redirige a las pestañas. La pantalla real de alta usa `app/add-food.tsx`.

### `app/+html.tsx`

Solo afecta al render web: estructura HTML, idioma, viewport, reset de scroll y color base según preferencia de tema. No participa en el flujo Android nativo.

## 4. Dominio y servicios: `services/`

### `services/nutrition.ts`

Contiene funciones puras:

- `ACTIVITY_FACTORS`: multiplicadores desde sedentario 1,2 hasta muy activo 1,9.
- `calculateBMR(input)`: Mifflin–St Jeor, con ajuste +5 hombre, −161 mujer y −78 para `other`, y redondeo a kcal enteras.
- `calculateTDEE(input)`: multiplica BMR por el factor de actividad.
- `calculateCalorieTarget(tdee, goal)`: mantenimiento sin ajuste, definir −250 kcal, perder −400 kcal; redondea a decenas y establece suelo de 1.200 kcal.
- `calculateMacroTargets(calories, weightKg, goal)`: proteína 1,6 g/kg en mantenimiento o 1,8 g/kg para déficit; grasa asigna 28% de energía; carbohidratos reciben las kcal restantes con equivalencias 4/9/4 kcal por gramo. Por redondeo queda una pequeña diferencia posible.
- `calculateMacrosTarget`: alias de compatibilidad con el nombre usado en onboarding.
- `calculateProgress(start,current,target)`: progreso limitado a 0–100.
- `validateProfileField(field,value)`: límites numéricos de edad, estatura, peso, peso objetivo y objetivo calórico; devuelve texto legible o `null`.

### `services/foodService.ts`

`starterFoods` es el catálogo sin conexión con ocho referencias por 100 g. `searchFoods(foods, query)` realiza coincidencia local insensible a mayúsculas y ordena favoritos primero. Es el punto de sustitución previsto para combinar una API remota con caché local en el futuro.

### `services/storage.ts`

`STORAGE_KEY` identifica el único documento persistido. `initialData` crea estado inicial vacío con perfil nulo y catálogo inicial. `appRepository.load()` parsea JSON, aplica valores iniciales como fallback y recupera el catálogo inicial si falta o está vacío. JSON inválido retorna el estado inicial. `save()` reemplaza el documento entero; `clear()` elimina la clave.

No hay cifrado adicional, sincronización, versionado ni migración de datos en este MVP. No guardar secretos ni información de pago aquí.

### `services/date.ts`

`dateKey(date)` construye `YYYY-MM-DD` usando componentes locales del dispositivo (no UTC), para agrupar comidas y pesajes por día local.

## 5. Estado y persistencia: `store/AppProvider.tsx`

`AppData` vive en `useState`. El `useEffect` inicial carga el repositorio y establece `ready`, incluso si ocurre un error de lectura.

`commit(next)` cambia la UI primero y trata de guardar el documento. Si falla el guardado, el error se silencia y los cambios se mantienen solo en memoria durante esa sesión; las llamadas actuales no notifican a la pantalla que la persistencia falló.

Las acciones del contexto son:

- `saveProfile`: guarda perfil y marca onboarding terminado.
- `addMeal`, `updateMeal`, `deleteMeal`: mutan la lista de comidas.
- `addFood`: inserta/actualiza por id al principio del catálogo.
- `toggleFavorite`: alterna favorito.
- `addWeight`: inserta el pesaje y reemplaza el del mismo día.
- `setTheme`: persiste preferencia temática.
- `updateData`: permite actualizar campos generales.
- `clearAll`: elimina AsyncStorage y vuelve al objeto inicial.

`useApp()` recupera el contexto y lanza error claro si se utiliza sin `AppProvider`.

## 6. Modelos: `types/index.ts`

- `Sex`, `Goal`, `Activity`, `MealType`, `ThemeMode`, `Units`: uniones literales que restringen las opciones aceptadas.
- `MacroTargets`: gramos diarios de proteína, carbohidratos y grasas.
- `Profile`: entradas corporales, objetivo, calorías/macros, unidades y nombre.
- `Food`: nutrientes por 100 g más indicadores de favorito y alimento personalizado.
- `MealEntry`: alimento y snapshot de nutrientes calculados para una cantidad, fecha y tipo de comida.
- `WeightEntry`: peso para una fecha.
- `AppData`: documento raíz persistido, con onboarding, tema, perfil y colecciones.

La entrada de comida guarda nutrientes calculados además del `foodId`; por ello la lectura de historial no recalcula comidas antiguas al cambiar los datos del alimento.

## 7. Componentes y temas

### `components/ui.tsx`

- `useColors()` elige `palette.light`/`palette.dark` según preferencia guardada o tema de sistema.
- `Page` ofrece fondo y contenedor desplazable por defecto.
- `Txt` aplica color de texto del tema.
- `Card` aplica fondo, borde, radio y espaciado.
- `Button` ofrece botón accesible principal/secundario y estado disabled.
- `Field` etiqueta un `TextInput`, asigna color de placeholder y accesibilidad.
- `SectionTitle` alinea título y contenido opcional.
- `styles` centraliza estilos base repetidos.

### `constants/theme.ts`

`palette.light` y `palette.dark` contienen los tokens de fondo, superficie, texto, líneas, color principal, secundarios, alerta y tarjetas. Para añadir un color, incorporarlo de forma coherente en ambos temas.

## 8. Flujos que conviene seguir al cambiar el código

### Añadir un campo persistente

1. Añadir el tipo/modelo en `types/index.ts`.
2. Definir un valor inicial compatible en `services/storage.ts` y tratar datos antiguos al cargar.
3. Exponer una acción controlada en `store/AppProvider.tsx`.
4. Conectar UI de la ruta correspondiente.
5. Validar entradas antes de persistir; documentar límites en el README/manual.

### Añadir una fuente de alimentos

Conservar los componentes dependientes del contrato `Food`. Extender `foodService` con un adaptador remoto, tratar fallos de red y combinar resultados con los alimentos locales; no hacer que una llamada de red sea requisito para abrir el catálogo.

### Cambiar cálculo de calorías o macros

Modificar solo `services/nutrition.ts`, llamar la función desde onboarding/perfil y añadir pruebas unitarias para rangos, déficits y coherencia energética. Evitar reproducir la fórmula en componentes.

### Cambiar una pantalla/ruta

Las pantallas están definidas por archivos dentro de `app/`; no introducir archivos auxiliares normales dentro de `app/`, porque Expo Router puede interpretarlos como rutas. Colocar dominio, componentes comunes y hooks fuera de esa carpeta.

## 9. Builds y comandos

```bash
npm install
npx expo start
npm run typecheck
npm run lint
npx expo-doctor
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform android --profile production
```

Expo Go sirve para probar en móvil escaneando el QR del servidor. `preview` prepara APK instalable; `production` prepara AAB. EAS requiere cuenta y proyecto vinculado. Las builds son remotas y no se publican automáticamente.

## 10. Monetización futura: consideraciones de diseño

El roadmap propone anuncios opcionales y una compra de apoyo que los deshabilite, un ajuste en Perfil para canjear promociones, una prueba de siete días de un solo uso y restaurar compras tras reinstalar.

- Elegir SDK de anuncios y compras compatible con Expo Go/build de producción antes de implementarlo; una extensión nativa incompatible con Expo Go requerirá development build.
- El estado premium comprado debe derivarse de validación de compra de App Store/Google Play o de un backend fiable, no de un booleano escrito por la app.
- Las compras deben asociarse a una cuenta/identificador restaurable según las reglas de la tienda y ofrecer una acción explícita «Restaurar compras».
- No incluir un «código secreto de developer» estático en JavaScript, AsyncStorage, configuración pública o APK: puede extraerse. Una anulación de desarrollador para QA debe estar restringida a builds internas y/o validarse en servidor, jamás usarse como bypass secreto de producto.
- Los códigos de prueba de siete días deben validarse de forma centralizada y registrar su redención única por cuenta, para que reinstalar o editar AsyncStorage no vuelva a habilitarlos.
- Aún hay que decidir precio/modelo, plataforma de pagos, política de anuncios, consentimiento/privacidad, elegibilidad de trial y restauración. No hay monetización funcional ahora.

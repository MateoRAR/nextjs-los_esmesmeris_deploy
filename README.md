# Informe Técnico - Sistema ERP Los Esmesmeris

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura de la Aplicación](#arquitectura-de-la-aplicación)
3. [Funcionalidades Implementadas](#funcionalidades-implementadas)
4. [Sistema de Autenticación](#sistema-de-autenticación)
5. [Sistema de Autorización](#sistema-de-autorización)
6. [Gestión del Estado](#gestión-del-estado)
7. [Tecnologías Utilizadas](#tecnologías-utilizadas)

---

## Introducción

El sistema ERP Los Esmesmeris es una aplicación web desarrollada con **Next.js 16** (App Router) que proporciona una solución completa para la gestión empresarial. La aplicación incluye módulos para gestión de usuarios, productos, ventas, clientes, proveedores, órdenes, disposiciones y un dashboard analítico con visualización en tiempo real.

### URL de Deploy

```
https://nextjs-los-esmesmeris-deploy.vercel.app/
```
---

## Arquitectura de la Aplicación

### Estructura de Directorios

```
nextjs-los_esmesmeris/
├── app/
│   ├── (general)/          # Rutas protegidas que requieren autenticación
│   │   ├── home/          # Dashboard principal
│   │   ├── users/         # Gestión de usuarios
│   │   ├── products/      # Gestión de productos
│   │   ├── sales/         # Gestión de ventas
│   │   ├── customers/     # Gestión de clientes
│   │   ├── suppliers/    # Gestión de proveedores
│   │   ├── orders/        # Gestión de órdenes (incluye mapa de tracking)
│   │   └── disposals/     # Gestión de disposiciones
│   ├── (landing)/         # Rutas públicas
│   │   ├── login/        # Página de inicio de sesión
│   │   └── page.tsx      # Landing page
│   ├── actions/           # Server Actions (lógica del servidor)
│   ├── api/               # API Routes (endpoints del servidor)
│   ├── lib/               # Utilidades y helpers
│   │   ├── auth/         # Lógica de autenticación
│   │   └── hooks/        # Custom hooks
│   └── types/            # Definiciones de tipos TypeScript
├── components/            # Componentes reutilizables
├── store/                # Gestión de estado global (Zustand)
└── proxy.ts              # Middleware de Next.js para autorización
```

### Patrón de Arquitectura

La aplicación utiliza una **arquitectura híbrida** que combina:

- **Server Components** (por defecto): Para renderizado en el servidor y mejor SEO
- **Client Components** (`"use client"`): Para interactividad y hooks de React
- **Server Actions**: Para mutaciones de datos y operaciones del servidor
- **API Routes**: Para endpoints específicos que requieren configuración especial

### Sistema de Layouts

La aplicación utiliza **Route Groups** de Next.js para organizar layouts:

- **`(general)`**: Rutas protegidas con `NavBarGeneral`
  - Layout: `app/(general)/layout.tsx`
  - Requiere autenticación
  - Incluye barra de navegación dinámica según rol

- **`(landing)`**: Rutas públicas con `NavBarLanding`
  - Layout: `app/(landing)/layout.tsx`
  - Acceso sin autenticación
  - Páginas de login y landing page

---

## Funcionalidades Implementadas

### 1. Dashboard Principal (`/home`)

**Descripción**: Panel de control con métricas y visualizaciones en tiempo real.

**Características**:
- **KPIs (Key Performance Indicators)**:
  - Total de ventas
  - Ingresos totales
  - Número de clientes
  - Número de productos
  - Ventas completadas vs pendientes
  - Productos con stock bajo
  
- **Visualizaciones**:
  - Gráfico de barras de ventas por período
  - Gráfico de pastel de distribución de ventas
  - Tabla de productos más vendidos
  
- **Implementación**:
  - Componente: `app/(general)/home/page.tsx`
  - Componentes de visualización: `components/dashboard/`
  - Acciones: `app/actions/dashboard/dashboard.ts`

### 2. Gestión de Usuarios (`/users`)

**Descripción**: Módulo completo para la administración de usuarios del sistema.

**Funcionalidades**:
- Listar usuarios con tabla dinámica
- Crear nuevos usuarios
- Editar información de usuarios
- Eliminar usuarios (con modal de confirmación)
- Visualización de roles y permisos

**Implementación**:
- Página: `app/(general)/users/page.tsx`
- Componentes: `components/users/`
- Acciones: `app/actions/users/users.ts`

### 3. Gestión de Productos (`/products`)

**Descripción**: Catálogo completo de productos con búsqueda y filtrado.

**Funcionalidades**:
- Listar productos con información completa
- Búsqueda en tiempo real por nombre (filtro en backend)
- Crear nuevos productos
- Editar productos existentes
- Eliminar productos
- Visualización de stock con badges de estado:
  - Sin stock (rojo)
  - Stock bajo < 10 (amarillo)
  - En stock (verde)
- Formato de precios en moneda colombiana (COP)
- Truncado automático de descripciones largas

**Características Técnicas**:
- Debounce de 300ms para búsqueda
- Polling automático cuando el campo está vacío
- UI moderna con iconos y efectos hover

**Implementación**:
- Página: `app/(general)/products/page.tsx`
- Componentes: `components/products/ProductTable.tsx`
- Acciones: `app/actions/products/index.ts`
- Endpoint backend: `GET /products?name={searchTerm}`

### 4. Gestión de Ventas (`/sales`)

**Descripción**: Módulo para registrar y gestionar ventas del sistema.

**Funcionalidades**:
- Listar todas las ventas
- Crear nuevas ventas con múltiples productos
- Buscar ventas por:
  - Nombre del cliente
  - Nombre del empleado
- Visualizar detalles de ventas en modal
- Filtrar y ordenar ventas

**Implementación**:
- Página: `app/(general)/sales/page.tsx`
- Componentes: `components/sales/`
- Acciones: `app/actions/sales/sales.ts`

### 5. Gestión de Clientes (`/customers`)

**Descripción**: Administración del catálogo de clientes.

**Funcionalidades**:
- Crear clientes con tarjeta de identificación única
- Buscar clientes por nombre
- Gestionar información de contacto

**Implementación**:
- Página: `app/(general)/customers/page.tsx`
- Componentes: `components/customers/CreateCustomerForm.tsx`
- Acciones: `app/actions/customers/customers.ts`

### 6. Gestión de Proveedores (`/suppliers`)

**Descripción**: Catálogo de proveedores con búsqueda integrada.

**Funcionalidades**:
- Listar proveedores
- Crear nuevos proveedores
- Editar información de proveedores
- Eliminar proveedores (con modal de confirmación)
- Búsqueda en tiempo real por nombre, contacto o teléfono
- UI moderna con iconos y efectos visuales

**Implementación**:
- Página: `app/(general)/suppliers/page.tsx`
- Componentes: `components/suppliers/SupplierTable.tsx`
- Acciones: `app/actions/suppliers/index.ts`

### 7. Gestión de Órdenes (`/orders`)

**Descripción**: Sistema completo de gestión de órdenes con tracking en tiempo real.

**Funcionalidades**:
- Listar órdenes con información completa
- Crear nuevas órdenes (disposición o venta)
- Editar órdenes
- Eliminar órdenes
- Tracking en tiempo real con mapa interactivo (`/orders/map`)
- Actualización de ubicación de órdenes (latitud/longitud)
- Estados de órdenes:
  - Pendiente (amarillo)
  - En Tránsito (azul)
  - Entregado (verde)
  - Cancelado (rojo)

**Características Especiales**:
- **Mapa Interactivo**: Visualización de órdenes en mapa usando Mapbox
- **WebSocket en Tiempo Real**: Actualizaciones instantáneas de estado de órdenes
- **Fallback a Polling**: Soporte para entornos serverless (Vercel)

**Implementación**:
- Página principal: `app/(general)/orders/page.tsx`
- Mapa de tracking: `app/(general)/orders/map/page.tsx`
- Componentes: `components/orders/OrderTable.tsx`
- Hook WebSocket: `app/lib/hooks/useOrdersWebSocket.ts`
- Acciones: `app/actions/orders/index.ts`
- API Route: `app/api/orders/poll/route.ts`

### 8. Gestión de Disposiciones (`/disposals`)

**Descripción**: Módulo para gestionar disposiciones de inventario.

**Funcionalidades**:
- Listar disposiciones
- Crear nuevas disposiciones
- Editar disposiciones
- Eliminar disposiciones
- Estados de disposición:
  - Pendiente
  - Aprobado
  - Rechazado
  - Completado

**Implementación**:
- Página: `app/(general)/disposals/page.tsx`
- Componentes: `components/disposals/DisposalTable.tsx`
- Acciones: `app/actions/disposals/index.ts`

### 9. Componentes de Tablas

Todas las tablas del sistema comparten características comunes:

- **Columnas dinámicas**: Se generan automáticamente desde los objetos
- **Nombres en español**: Traducción de campos a español con espacios
- **ID visible**: Muestra los primeros 8 caracteres del ID
- **Formato de valores**: 
  - Fechas en formato español
  - Precios en moneda colombiana (COP)
  - Números con formato de miles
- **Badges de estado**: Indicadores visuales con colores
- **Modales de confirmación**: Para acciones destructivas
- **Dark mode**: Soporte completo para modo oscuro
- **Responsive**: Adaptable a diferentes tamaños de pantalla

---

## Sistema de Autenticación

### Arquitectura de Autenticación

El sistema implementa autenticación basada en **JWT (JSON Web Tokens)** con cookies HTTP-only para mayor seguridad.

### Componentes del Sistema de Autenticación

#### 1. Flujo de Inicio de Sesión

**Ubicación**: `app/actions/auth/auth.ts`, `components/login/LoginForm.tsx`

**Proceso**:

1. **Validación de Formulario**:
   ```typescript
   // Uso de Zod para validación
   const SignInFormSchema = z.object({
     email: z.email(),
     password: z.string().trim()
   })
   ```

2. **Envío al Backend**:
   ```typescript
   const response = await fetch(process.env.NEXT_PUBLIC_BACK_URL + '/auth/login', {
     method: "POST",
     body: JSON.stringify(validatedFields.data),
     headers: { "Content-Type": "application/json" }
   });
   ```

3. **Creación de Sesión**:
   ```typescript
   const token = body.token;
   await createSession(token); // Almacena token en cookie httpOnly
   ```

4. **Actualización del Estado Global**:
   ```typescript
   setRole(state.user.role);
   setId(state.user.id);
   setName(state.user.name);
   setIsAuthenticated(true);
   ```

#### 2. Gestión de Sesiones

**Ubicación**: `app/lib/auth/session.ts`

**Funciones Principales**:

- **`createSession(token)`**: 
  - Almacena el token JWT en una cookie httpOnly
  - Configuración de seguridad:
    - `httpOnly: true` - Previene acceso desde JavaScript
    - `secure: true` - Solo se envía por HTTPS
    - `sameSite: 'lax'` - Protección CSRF
    - Expiración: 7 días

- **`getToken()`**:
  - Obtiene el token de la cookie
  - Solo accesible desde el servidor (server-only)

- **`decryptSession()`**:
  - Decodifica el payload del JWT
  - Extrae información del usuario (rol, etc.)

- **`deleteSession()`**:
  - Elimina la cookie de sesión
  - Utilizado en el logout

#### 3. Integración con API

**Ubicación**: `app/lib/api.ts`

**Función `apiFetch`**:
```typescript
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${await getToken()}` // Token automático
    },
    cache: "no-store",
    ...options,
  });
  // ...
}
```

**Características**:
- Inyección automática del token JWT en todas las peticiones
- Manejo centralizado de autenticación
- Reutilizable en todas las Server Actions
- Type-safe con TypeScript generics

### 4. Validación de Formularios

**Ubicación**: `app/lib/login/definitions.ts`, `app/lib/sales/definitions.ts`, etc.

**Tecnología**: Zod

**Ejemplo**:
```typescript
export const SignInFormSchema = z.object({
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  password: z.string().trim(),
})
```

**Uso en Server Actions**:
```typescript
const validatedFields = SignInFormSchema.safeParse({
  email: formData.get('email'),
  password: formData.get('password'),
});
```

#### 4. Middleware de Autenticación

**Ubicación**: `proxy.ts` (Next.js Middleware)

**Funcionalidad**:
- Intercepta todas las peticiones antes de que lleguen a las rutas
- Verifica la existencia de sesión
- Redirige a login si no hay sesión válida
- Permite acceso a rutas públicas sin autenticación

**Implementación**:
```typescript
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = await decryptSession();
  const role = session?.roles || 'public';
  
  // Verifica si es ruta pública
  if (RouteAuthorizer.isPublic(path)) {
    return NextResponse.next();
  }
  
  // Verifica permisos según rol
  if (RouteAuthorizer.isAllowed(role, path)) {
    return NextResponse.next();
  }
  
  // Redirige si no tiene acceso
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

**Características**:
- Se ejecuta en el edge runtime
- Excluye archivos estáticos y API routes internos
- Eficiente y rápido

---

## Sistema de Autorización

### Modelo de Roles

El sistema implementa un sistema de **autorización basado en roles (RBAC - Role-Based Access Control)**.

### Roles Definidos

1. **Admin**: Acceso completo al sistema
2. **Employee**: Acceso limitado a módulos operativos
3. **Public**: Usuarios no autenticados

### Implementación de Autorización

#### 1. Clase RouteAuthorizer

**Ubicación**: `app/lib/auth/RouteAuthorizer.ts`

**Descripción**: Centraliza la lógica de autorización de rutas.

**Estructura**:
```typescript
export class RouteAuthorizer {
  private static readonly routes: Map<string, string[]> = new Map([
    ['admin', [
      '/home', '/users', '/users/*', '/sales', '/sales/*', 
      '/customers', '/customers/*', '/suppliers', '/suppliers/*',
      '/disposals', '/disposals/*', '/orders', '/orders/*', 
      '/products', '/products/*'
    ]],
    ['employee', [
      '/home', '/sales', '/sales/*', '/customers', '/customers/*',
      '/employee/*'
    ]],
    ['public', ['/', '/login', '/register', '/about']],
  ])
}
```

**Métodos**:

- **`isAllowed(role: string, path: string): boolean`**:
  - Verifica si un rol tiene acceso a una ruta específica
  - Soporta patrones wildcard (`*`)
  - Permite rutas con prefijo (`/users/*`)

- **`isPublic(path: string): boolean`**:
  - Verifica si una ruta es pública
  - No requiere autenticación

#### 2. Autorización en Navegación

**Ubicación**: `components/nav-bar-general/NavBarGeneral.tsx`

**Implementación**:
```typescript
const navigationData = [
  { name: 'Home', href: '/home', roles: ['admin', 'employee'] },
  { name: 'Users', href: '/users', roles: ['admin'] },
  { name: 'Ventas', href: '/sales', roles: ['admin', 'employee'] },
  // ...
];

const { role } = useUserStore();
const userNavigation = navigationData.filter(item => 
  item.roles.includes(role)
);
```

**Características**:
- Menú dinámico según el rol del usuario
- Ocultación automática de opciones no autorizadas
- UI adaptativa según permisos

#### 3. Autorización en Backend

**Ubicación**: Backend NestJS (no incluido en este análisis)

**Características**:
- Decoradores `@Auth()` en controladores
- Validación de roles en cada endpoint
- Respuestas 401/403 para accesos no autorizados

#### 4. Protección de Rutas

**Estrategia de Protección**:

1. **Middleware de Next.js** (`proxy.ts`):
   - Primera línea de defensa
   - Intercepta todas las peticiones
   - Verifica sesión y rol

2. **Componentes de Página**:
   - Pueden verificar roles adicionales
   - Renderizado condicional según permisos

3. **Server Actions**:
   - Verifican token en cada llamada
   - Retornan errores si no hay autenticación

---

## Gestión del Estado

### Arquitectura de Estado

La aplicación utiliza una **combinación de estrategias** para la gestión del estado:

1. **Zustand** (Global State): Para información del usuario
2. **React State** (Local State): Para estado de componentes
3. **Server State**: Para datos del servidor
4. **URL State**: Para parámetros de búsqueda y filtros

### 1. Estado Global con Zustand

**Ubicación**: `store/userInfoStore.ts`

**Implementación**:
```typescript
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      role: '',
      id: '',
      name: '',
      isAuthenticated: false,
      
      setRole: (role) => set({ role }),
      setId: (id) => set({ id }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setName: (name) => set({ name }),
      
      clean: () => set({
        role: '',
        id: '',
        name: '',
        isAuthenticated: false,
      }),
    }),
    {
      name: 'user-storage', // Persistencia en localStorage
    }
  )
)
```

**Características**:
- **Persistencia**: Los datos se guardan en `localStorage`
- **Sincronización**: Se actualiza al iniciar sesión
- **Limpieza**: Se limpia al cerrar sesión
- **TypeScript**: Totalmente tipado

**Uso en Componentes**:
```typescript
const { role, name, isAuthenticated, clean } = useUserStore();
```

### 2. Estado Local en Componentes

**Estrategia**: Cada componente gestiona su propio estado cuando es necesario.

**Ejemplos**:

- **Búsqueda en Productos**:
  ```typescript
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  ```

- **Modales de Confirmación**:
  ```typescript
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  ```

### 3. Estado del Servidor

**Server Actions**: Las Server Actions manejan la comunicación con el backend.

**Características**:
- **Cache**: Next.js cachea automáticamente las respuestas
- **Revalidación**: `revalidatePath()` para actualizar cache
- **Type Safety**: TypeScript asegura tipos correctos
- **Directiva `"use server"`**: Marca funciones como Server Actions
- **FormData Handling**: Integración nativa con formularios

**Patrón de Server Actions**:

1. **Fetch de Datos**:
```typescript
"use server";
export async function getProducts(name?: string): Promise<Product[]> {
  const url = name ? `/products?name=${encodeURIComponent(name)}` : "/products";
  return apiFetch<Product[]>(url);
}
```

2. **Mutaciones con Revalidación**:
```typescript
export async function createOrder(data: Partial<Order>) {
  await apiFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/orders"); // Invalida cache y re-renderiza
}
```

3. **Validación con Zod**:
```typescript
export async function createSale(data: CreateSaleData) {
  const validatedFields = CreateSaleFormSchema.safeParse(data);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }
  // ... crear venta
}
```

**Ventajas**:
- No requiere API Routes separadas
- Type-safe end-to-end
- Optimistic updates más fáciles
- Mejor integración con formularios

### 4. Estado de URL (Query Parameters)

**Uso de `useSearchParams()`**:
- Para pasar parámetros entre páginas
- Ejemplo: `/orders/map?orderId={id}`
- Requiere `Suspense` boundary (implementado)

### 5. Estado de WebSocket

**Hook Personalizado**: `useOrdersWebSocket`

**Ubicación**: `app/lib/hooks/useOrdersWebSocket.ts`

**Estado Gestionado**:
- `isConnected`: Estado de conexión
- `socketError`: Errores de conexión
- `socket`: Referencia al socket

**Características**:
- Reconección automática (10 intentos con delay progresivo)
- Fallback a polling HTTP cuando WebSocket no está disponible
- Detección automática de entorno (Vercel)
- Limpieza automática al desmontar
- Polling manual como fallback con API route dedicada
- Optimización de actualizaciones (hash de cambios)

**Implementación**:
```typescript
export function useOrdersWebSocket(onOrderUpdate?: (order: Order) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  
  // Detección de Vercel
  const isVercelLike = typeof window !== 'undefined' && (
    window.location.hostname.includes('vercel.app')
  );
  
  // Socket.IO con fallback a polling
  const socket = io(BACK_URL, {
    transports: isVercelLike ? ['polling'] : ['polling', 'websocket'],
    // ...
  });
  
  // Fallback a polling manual si falla
  // ...
}
```

**API Route para Polling**:
- Ubicación: `app/api/orders/poll/route.ts`
- Maneja autenticación del servidor
- Usado cuando WebSocket no está disponible

### 6. Patrones de Actualización de Estado

#### Optimistic Updates
- Actualizaciones inmediatas en UI
- Rollback si falla la operación

#### Debouncing
- Búsquedas con delay de 300ms
- Reduce llamadas al servidor

#### Transitions (React 19)
- `useTransition` para actualizaciones no bloqueantes
- Mejora la experiencia de usuario

---

## Tecnologías Utilizadas

### Frontend

- **Next.js 16**: Framework React con App Router
- **React 19**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utilitarios
- **Flowbite React**: Componentes UI
- **Zustand**: Gestión de estado global
- **Zod**: Validación de esquemas
- **Socket.IO Client**: WebSockets en tiempo real
- **Mapbox GL**: Mapas interactivos
- **Lucide React**: Iconos
- **Jose**: Manipulación de JWT

### Características de Next.js Utilizadas

- **App Router**: Sistema de enrutamiento moderno
- **Server Components**: Renderizado en servidor
- **Server Actions**: Mutaciones de datos
- **API Routes**: Endpoints personalizados
- **Middleware**: Interceptación de peticiones
- **Suspense**: Límites de carga asíncrona
- **Metadata API**: SEO y metadatos

### Patrones de Diseño

- **Server Actions Pattern**: Para mutaciones de datos
- **Component Composition**: Componentes reutilizables y modulares
- **Custom Hooks**: Lógica reutilizable (useOrdersWebSocket)
- **Type Safety**: TypeScript en toda la aplicación
- **Error Boundaries**: Manejo de errores (implícito en Next.js)
- **Loading States**: Estados de carga con Spinner
- **Optimistic UI**: Actualizaciones optimistas
- **Suspense Boundaries**: Para componentes asíncronos
- **Route Groups**: Organización de layouts
- **Progressive Enhancement**: Funcionalidad básica siempre disponible

### Manejo de Errores

**Estrategias Implementadas**:

1. **Validación en Server Actions**:
   - Zod para validación de esquemas
   - Retorno de errores estructurados

2. **Manejo en Componentes**:
   - Try-catch en funciones async
   - Estados de error en componentes
   - Componentes de alerta (`ErrorAlert`)

3. **API Error Handling**:
   - Verificación de `response.ok`
   - Extracción de mensajes de error del backend
   - Fallbacks a valores por defecto

### Optimizaciones de Rendimiento

1. **Debouncing**: Búsquedas con delay de 300ms
2. **Code Splitting**: Automático con Next.js
3. **Image Optimization**: Next.js Image component
4. **Static Generation**: Cuando es posible
5. **Incremental Static Regeneration**: Para datos dinámicos
6. **Cache Strategies**: Revalidación inteligente

---

## Conclusiones

### Fortalezas del Sistema

1. **Seguridad**:
   - Autenticación robusta con JWT en cookies httpOnly
   - Autorización basada en roles bien implementada
   - Middleware de protección de rutas

2. **Arquitectura**:
   - Separación clara de responsabilidades
   - Código reutilizable y mantenible
   - TypeScript para type safety

3. **Experiencia de Usuario**:
   - UI moderna y responsive
   - Dark mode completo
   - Feedback visual en todas las acciones
   - Búsqueda en tiempo real

4. **Rendimiento**:
   - Server Components para mejor SEO
   - Debouncing en búsquedas
   - Caché inteligente de Next.js
   - Fallbacks para entornos serverless

5. **Funcionalidades Avanzadas**:
   - WebSocket en tiempo real
   - Mapa interactivo con Mapbox
   - Dashboard con visualizaciones
   - Búsqueda y filtrado avanzado

### Mejoras Futuras

1. Implementar refresh tokens para mayor seguridad
2. Agregar más granularidad en permisos (no solo roles)
3. Implementar caché más sofisticado con React Query
4. Agregar tests unitarios y de integración
5. Mejorar el manejo de errores con Error Boundaries
6. Implementar infinite scroll para listas largas

---

## Referencias Técnicas

### Archivos Clave

- **Autenticación**: `app/lib/auth/session.ts`, `app/actions/auth/auth.ts`
- **Autorización**: `app/lib/auth/RouteAuthorizer.ts`, `proxy.ts`
- **Estado Global**: `store/userInfoStore.ts`
- **API Client**: `app/lib/api.ts`
- **WebSocket**: `app/lib/hooks/useOrdersWebSocket.ts`
- **Middleware**: `proxy.ts`

### Estructura de Datos

- **User Store**: `{ role, id, name, isAuthenticated }`
- **Session Cookie**: Token JWT almacenado en cookie httpOnly
- **API Responses**: Tipados con TypeScript interfaces

---

*Documento generado para el proyecto ERP Los Esmesmeris - Next.js Frontend*


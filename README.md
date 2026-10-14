# SigevFrontend

## Acceso local de desarrollo

El login solicita correo y contraseña. El rol pertenece a la cuenta registrada:
no se elige en el formulario ni se deduce de palabras o del dominio del correo.
Las cuentas siguientes son ficticias y solo permiten probar el frontend.

| Correo | Rol |
| --- | --- |
| admin@sigev.edu.pe | Administrador |
| director@sigev.edu.pe | Director |
| docente@sigev.edu.pe | Docente |
| estudiante@sigev.edu.pe | Estudiante |
| apoderado@sigev.edu.pe | Apoderado |

Contraseña local para todas: `sigev2026`. No usar contraseñas reales.
La sesión está en memoria y se pierde al recargar o cerrar sesión.
El dashboard administrativo y el módulo de estudiantes están implementados;
los otros módulos mantienen pantallas base. El menú y los guards filtran la navegación según el rol.
Esto no constituye seguridad real: en la segunda etapa Spring Boot deberá
validar las credenciales y autorizar cada operación, sustituyendo la consulta
local en AuthService. No hay backend, tokens ni persistencia.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Gestión de estudiantes

Ruta `/estudiantes`: búsqueda por nombre, DNI o código; filtros combinables por grado,
sección y estado; paginación; registro, edición, perfil e historial académico de ejemplo.
El administrador puede modificar y eliminar con confirmación. El docente tiene consulta.
Los registros ficticios viven en `StudentsService` y se reinician al recargar la página.
Los datos se conservan al navegar entre módulos durante la sesión de la aplicación.
No hay peticiones HTTP ni almacenamiento externo. Los indicadores de estudiantes y su distribución en el dashboard se calculan a partir
del mismo directorio. Asistencias, docentes y actividad conservan series de referencia.

Los modelos están en `core/models`, fixtures en `mocks`, el diálogo reutilizable en
`shared` y la pantalla en `features/students`. Para integrar REST, sustituir el origen
de datos del servicio e incorporar validación y permisos en el servidor.

## Diseño institucional

Layout dividido en Sidebar, Navbar y PageHeader. El control lateral permanece dentro
del sidebar; en móvil se conserva una franja de 48 px. StatCard y Panel comparten
los estilos de `styles/institutional.scss`. Los indicadores de estudiantes usan
StudentOverviewService, sin duplicar registros ni modificar los permisos existentes.

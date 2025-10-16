# Organizador de materias

Aplicacion web simple creada con React + TypeScript + Vite para listar y acceder rapidamente a los recursos de clase del semestre.

## Contenido

- [Demo local](#demo-local)
- [Caracteristicas](#caracteristicas)
- [Requisitos](#requisitos)
- [Instalacion y uso](#instalacion-y-uso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Personalizacion rapida](#personalizacion-rapida)
- [Tecnologias](#tecnologias)

## Demo local

```
npm install
npm run dev
```

Se abrira Vite en `http://localhost:5173/`. Ahi veras la cabecera con el nombre del desarrollador y las tarjetas de cada materia con su enlace directo a la plataforma o recurso correspondiente.

## Caracteristicas

- Grid responsivo de tarjetas con tamanio fijo para una presentacion consistente.
- Cada tarjeta muestra nombre de la materia, ubicacion o modalidad y un enlace con icono.
- Estilos personalizados en CSS sin dependencias adicionales.
- Animaciones sutiles al pasar el cursor sobre las imagenes.

## Requisitos

- Node.js 18+
- npm 9+

## Instalacion y uso

1. Clona el repositorio y entra a la carpeta del proyecto:
   ```
   git clone https://github.com/Danieldlr13/ORGANIZADOR-DE-MATERIAS.git
   cd ORGANIZADOR-DE-MATERIAS
   ```
2. Instala dependencias: `npm install`
3. Ejecuta el servidor de desarrollo: `npm run dev`
4. Para generar la version optimizada: `npm run build`
5. Para previsualizar la build: `npm run preview`

## Estructura del proyecto

```
src/
  main.tsx             # Punto de entrada
  index.css            # Estilos globales (layout, colores, tipografia)
  components/
    Header.tsx         # Cabecera con nombre del desarrollador
    Materis.tsx        # Contenedor de todas las tarjetas
    Plantilla.tsx      # Componente para una tarjeta individual
  assets/              # Recursos estaticos (logos, imagenes)
```

## Personalizacion rapida

- **Actualizar materias:** edita `src/components/Materis.tsx` para agregar, quitar o cambiar materias.
- **Cambiar enlaces e imagenes:** cada tarjeta recibe `nombre`, `lugar`, `imagen` y `link` como props en `Plantilla.tsx`.
- **Modificar estilos:** ajusta colores, tipografias y layout en `src/index.css`.
- **Titulo principal:** reemplaza el texto del encabezado en `src/components/Header.tsx`.

## Tecnologias

- React 18 con TypeScript
- Vite como bundler y servidor de desarrollo
- CSS puro para la capa de presentacion

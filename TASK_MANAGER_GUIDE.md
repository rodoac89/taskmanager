# 📊 Task Manager - Sistema de Gestión de Tareas

Aplicación web desarrollada en Angular para la gestión y visualización de tareas con múltiples vistas: Timeline, Kanban y Gantt.

## 🚀 Características

### Múltiples Vistas de Visualización

#### 📅 Timeline (Línea de Tiempo)
- Vista vertical y horizontal intercambiable
- Representación cronológica de eventos
- Iconos y colores personalizables
- Indicadores de estado de tareas completadas

#### 📋 Kanban Board
- Tres columnas: Pendiente, En Progreso, Completado
- Tarjetas con información detallada de tareas
- Badges de prioridad (Alta, Media, Baja)
- Barra de progreso para tareas en curso
- Contador de tareas por columna

#### 📊 Diagrama de Gantt
- Visualización de línea de tiempo de proyectos
- Barras de tareas con código de colores por estado
- Indicador de progreso en cada barra
- Vista mensual automática
- Información de asignados y fechas

### 🔄 Gestión de Datos

#### Importación de Excel/CSV
- Carga de archivos `.csv`, `.xlsx`, `.xls`
- Parser inteligente que reconoce múltiples formatos
- Validación automática de datos
- Conversión automática de fechas y estados

#### Exportación de Datos
- Exportar todas las tareas a formato CSV
- Compatible con Excel y otras hojas de cálculo
- Incluye BOM UTF-8 para caracteres especiales
- Nombres de columnas en español

#### Plantilla de Ejemplo
- Descarga de archivo CSV de ejemplo
- 6 tareas de muestra pre-configuradas
- Formato correcto para importación
- Incluye todos los campos requeridos

## 📋 Formato del Archivo Excel/CSV

### Columnas Requeridas:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| **ID** | Identificador único | 1, 2, 3... |
| **Título** | Nombre de la tarea | "Planificación del Proyecto" |
| **Descripción** | Detalles de la tarea | "Definir alcance y objetivos" |
| **Fecha Inicio** | Fecha de inicio (YYYY-MM-DD) | 2025-01-15 |
| **Fecha Fin** | Fecha de finalización (YYYY-MM-DD) | 2025-01-20 |
| **Estado** | Pendiente / En Progreso / Completado | "Completado" |
| **Prioridad** | Alta / Media / Baja | "Alta" |
| **Asignado** | Nombre del responsable | "Juan Pérez" |
| **Progreso (%)** | Porcentaje de completitud (0-100) | 100 |

### Ejemplo de CSV:

```csv
ID,Título,Descripción,Fecha Inicio,Fecha Fin,Estado,Prioridad,Asignado,Progreso (%)
1,Planificación del Proyecto,Definir alcance y objetivos del proyecto,2025-01-15,2025-01-20,Completado,Alta,Juan Pérez,100
2,Diseño de UI/UX,Crear mockups y prototipos de la interfaz,2025-01-21,2025-02-10,En Progreso,Alta,María García,65
```

## 🛠️ Instalación y Ejecución

### Prerrequisitos
- Node.js (v18 o superior)
- npm (v9 o superior)

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Navegar al directorio
cd taskmanager

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 📁 Estructura del Proyecto

```
src/app/
├── models/
│   └── task.model.ts          # Modelo de datos de tareas
├── services/
│   ├── task.service.ts        # Servicio de gestión de tareas
│   └── excel.service.ts       # Servicio de import/export Excel
├── pages/
│   ├── home/                  # Página principal
│   ├── timeline-view/         # Vista Timeline
│   ├── kanban-view/           # Vista Kanban
│   └── gantt-view/            # Vista Gantt
├── timeline/
│   └── timeline.component.ts  # Componente reutilizable de timeline
└── app.routes.ts              # Configuración de rutas
```

## 🎨 Tecnologías Utilizadas

- **Angular 20** - Framework principal
- **TypeScript** - Lenguaje de programación
- **CSS3** - Estilos y animaciones
- **Angular Signals** - Gestión de estado reactiva
- **Angular Router** - Navegación entre vistas

## 📖 Uso de la Aplicación

### 1. Página Principal
- Selecciona una de las tres vistas disponibles
- Accede a las opciones de carga y descarga de datos

### 2. Cargar Datos desde Excel
1. Haz clic en "📤 Cargar Excel/CSV" en cualquier vista
2. Selecciona tu archivo
3. Los datos se cargarán automáticamente
4. Verás una confirmación con el número de tareas cargadas

### 3. Descargar Plantilla
1. Haz clic en "📥 Descargar Plantilla"
2. Se descargará un archivo CSV de ejemplo
3. Edita el archivo con tus propias tareas
4. Importa el archivo editado

### 4. Exportar Datos
1. Haz clic en "💾 Exportar Datos"
2. Se descargará un CSV con todas tus tareas actuales
3. Puedes editarlo y volver a importarlo

## 🎯 Características de los Estados

### Estados de Tareas
- **Pendiente** (⏳): Tareas no iniciadas - Color gris
- **En Progreso** (🔄): Tareas en desarrollo - Color azul
- **Completado** (✅): Tareas finalizadas - Color verde

### Prioridades
- **Alta** (🔴): Tareas urgentes - Color rojo
- **Media** (🟡): Tareas normales - Color naranja
- **Baja** (🟢): Tareas de baja prioridad - Color verde

## 🔧 Funcionalidades Avanzadas

- **Navegación Fluida**: Transiciones suaves entre vistas
- **Responsive Design**: Funciona en dispositivos móviles y desktop
- **Animaciones**: Efectos visuales en hover y transiciones
- **Persistencia de Datos**: Los datos se mantienen al cambiar de vista
- **Validación de Archivos**: Detección automática de errores en archivos CSV

## 📝 Notas Importantes

1. **Formato de Fechas**: Use el formato ISO (YYYY-MM-DD) para mejores resultados
2. **Caracteres Especiales**: El sistema soporta acentos y caracteres especiales en español
3. **Tamaño de Archivo**: Recomendado hasta 1000 tareas para óptimo rendimiento
4. **Navegadores Compatibles**: Chrome, Firefox, Safari, Edge (últimas versiones)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ usando Angular

---

**¡Disfruta gestionando tus tareas! 🎉**

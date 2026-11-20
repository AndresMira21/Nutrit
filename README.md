# 🥗 Nutrit

**Nutrit** es una aplicación web de seguimiento nutricional y de hábitos. Permite crear un perfil, consultar una referencia calórica diaria, registrar comidas y llevar el control de agua, pasos y peso.

Está desarrollada con Angular 22 usando componentes standalone, Signals y carga perezosa de rutas.

---

## ✨ Funcionalidades

### 🔐 Autenticación y perfil

- Registro e inicio de sesión local. Los correos se comparan sin distinguir mayúsculas y minúsculas y se eliminan los espacios de los extremos.
- Rutas protegidas con `authGuard` y `profileGuard`, que garantizan que el usuario tenga sesión y perfil completo antes de entrar al dashboard.
- Onboarding en 2 pasos:
  1. Datos personales: nombre, edad, sexo, peso y estatura.
  2. Hábitos: frecuencia habitual de ejercicio (sí o no), cantidad de comidas y vasos de agua por día, objetivo y aceptación del tratamiento de datos para continuar.
- Edición posterior de datos personales, meta, cantidades diarias y nivel de actividad opcional desde el dashboard.
- Si ya existían dos cuentas con un correo equivalente, el acceso queda bloqueado para evitar que ambas usen los mismos registros. Los datos se conservan hasta que se resuelva su titularidad.

### 📊 Dashboard

- Referencia calórica diaria estimada para mantener el peso con actividad sedentaria.
- Índice de Masa Corporal (IMC) actual.
- Seguimiento diario de agua (ml) y pasos, con barras de progreso, meta personal de pasos e historial de los últimos 7 días.
- Calorías del día, actualizadas al registrar comidas o al cambiar la fecha local, y comparación con la referencia estimada.
- Registro de peso con la variación respecto al peso inicial.

### 🍽️ Comidas y macronutrientes

- Registro de comidas desde un catálogo de alimentos (valores por 100 g) o de forma manual.
- El catálogo calcula calorías, proteínas, carbohidratos y grasas según los gramos consumidos. En el registro manual se ingresan las calorías de la porción.
- El gráfico de macronutrientes usa las comidas del día con datos disponibles.
- El historial conserva las comidas anteriores y las que no tienen fecha. Solo las fechadas hoy cuentan para el resumen diario.
- Los registros de cada cuenta se almacenan en el navegador mediante `localStorage`.

---

## 🧰 Tecnologías

| Categoría | Herramienta |
|---|---|
| Framework | `Angular 22` |
| Lenguaje | `TypeScript 6` |
| Estilos | `SCSS` |
| Formularios | `Reactive Forms` |
| Enrutamiento | `Angular Router` con guards funcionales |
| Pruebas | `Vitest` + `jsdom` |
| Formato de código | `Prettier` + `EditorConfig` |
| Persistencia | `localStorage` del navegador |

---

## 📋 Requisitos previos

- `Node.js` (versión LTS reciente)
- `npm` 11
- `Angular CLI` (opcional, también se puede usar con `npx`)

---

## 🚀 Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/AndresMira21/Nutrit.git
cd Nutrit

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

Abre el navegador en `http://localhost:4200/`. La aplicación se recarga automáticamente al modificar el código.

### 🔑 Usuario de demostración

```text
Correo:      admin@nutrit.com
Contraseña:  123456
```

También puedes crear tu propia cuenta desde la pantalla de registro.

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Levanta el servidor de desarrollo |
| `npm run build` | Genera la compilación de producción en `dist/` |
| `npm run watch` | Compila en modo desarrollo y observa cambios |
| `npm test` | Ejecuta las pruebas unitarias con Vitest |

---

## 📁 Estructura del proyecto

```text
src/
├── app/
│   ├── core/
│   │   ├── guards/             # authGuard, profileGuard
│   │   ├── models/             # User, Food, Achievement
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── nutrition.service.ts
│   │       ├── macronutrient-calculator.service.ts
│   │       └── daily-activity.service.ts
│   ├── features/
│   │   ├── auth/               # login y register
│   │   ├── onboarding/         # step-personal y step-habits
│   │   └── dashboard/
│   │       ├── dashboard-top/
│   │       ├── dashboard-bottom/
│   │       ├── macronutrient-chart/
│   │       └── profile-editor/
│   ├── shared/
│   │   └── number-stepper/
│   ├── app.routes.ts
│   └── app.config.ts
├── styles.scss
└── main.ts
public/
└── images/
```

### 🗺️ Rutas

| Ruta | Descripción | Protección |
|---|---|---|
| `/login` | Inicio de sesión | Pública |
| `/register` | Registro de usuario | Pública |
| `/onboarding` | Configuración inicial del perfil | `authGuard` |
| `/dashboard` | Panel principal | `authGuard` + `profileGuard` |

---

## 🧮 Cálculos nutricionales

Referencia calórica diaria (ecuación de Mifflin-St Jeor):

```text
TMB = (10 × peso[kg]) + (6.25 × estatura[cm]) − (5 × edad)
TMB = TMB + 5      (hombres)
TMB = TMB − 161    (mujeres)

Referencia diaria = redondear(TMB × 1.2)
```

El factor 1.2 representa actividad sedentaria. La referencia estima mantenimiento de peso y no se ajusta según el objetivo del perfil.

Índice de Masa Corporal:

```text
IMC = peso[kg] / (estatura[m])²
```

Macronutrientes por porción:

```text
macro = valor por 100 g × (gramos consumidos / 100)
```

---

## 🌱 Flujo de trabajo con Git

- `main`: versión estable.
- `develop`: rama de integración.
- `feature/*`: nuevas funcionalidades.
- `fix/*`: correcciones.

---

## 👷 Autores

- Andrés Camilo Miranda
- Alejandra Montilla
- Camilo Toro Sánchez

🎓 Universidad Cooperativa de Colombia, Campus Pasto.

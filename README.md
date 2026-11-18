# 🥗 Nutrit

**Nutrit** es una aplicación web de seguimiento nutricional y de hábitos saludables. Permite a cada usuario crear su perfil, conocer su meta calórica diaria, registrar sus comidas con calorías y macronutrientes, y llevar el control diario de agua, pasos y peso desde un único panel.

Está desarrollada con Angular 22 usando componentes standalone, Signals y carga perezosa de rutas.

---

## ✨ Funcionalidades

### 🔐 Autenticación y perfil

- Registro e inicio de sesión de usuarios.
- Rutas protegidas con `authGuard` y `profileGuard`, que garantizan que el usuario tenga sesión y perfil completo antes de entrar al dashboard.
- Onboarding en 2 pasos:
  1. Datos personales: nombre, edad, sexo, peso y estatura.
  2. Hábitos: actividad física, comidas por día, vasos de agua, tipo de dieta, objetivo y restricciones.
- Edición posterior de datos personales y hábitos desde el dashboard.

### 📊 Dashboard

- Meta calórica diaria calculada a partir de los datos del perfil.
- Índice de Masa Corporal (IMC) actual.
- Seguimiento diario de agua (ml) y pasos, con barras de progreso, meta personal de pasos e historial de los últimos 7 días.
- Calorías consumidas en el día, actualizadas automáticamente al registrar comidas.
- Registro de peso con la variación respecto al peso inicial.

### 🍽️ Comidas y macronutrientes

- Registro de comidas desde un catálogo de alimentos (valores por 100 g) o de forma manual.
- Cálculo automático de proteínas, carbohidratos y grasas según los gramos consumidos.
- Gráfico de macronutrientes del día.
- Cada cuenta de usuario conserva únicamente sus propios registros.

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

Meta calórica diaria (ecuación de Mifflin-St Jeor):

```text
TMB = (10 × peso[kg]) + (6.25 × estatura[cm]) − (5 × edad)
TMB = TMB + 5      (hombres)
TMB = TMB − 161    (mujeres)

Meta diaria = TMB × 1.2
```

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

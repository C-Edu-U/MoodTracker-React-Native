# MoodTrack

MoodTrack es una app móvil creada con **React Native + Expo** para ayudarte a registrar y visualizar tu estado emocional diariamente. Ideal para el autocuidado, salud mental y seguimiento del bienestar 🧠💜

## 🚀 Funcionalidades

- Registro diario de estado de ánimo, síntomas y métricas de salud
- Recordatorios personalizados
- Recomendaciones generadas automáticamente
- Gráficas de evolución emocional, peso y ritmo cardíaco
- Login y registro con Firebase Authentication

## 📲 Cómo correr el proyecto

### 1. Clonar repositorio

```bash
git clone https://github.com/C-Edu-U/MoodTrack-React-Native
cd moodtrack-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear archivo `.env`

Agrega tus credenciales de Firebase:

```env
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

### 4. Ejecutar app

```bash
npx expo start
```

Escanea el QR con **Expo Go**.

---

## 🧩 Dependencias esenciales

```txt
firebase
expo
expo-constants
expo-notifications
expo-device
react-navigation
react-native-chart-kit
react-native-picker-select
react-native-vector-icons
react-native-dotenv
@react-native-community/datetimepicker
```

---

## 🛠️ Configuración de Firebase

### 🔑 Requisitos

- Tener un proyecto activo en [Firebase](https://console.firebase.google.com/)
- Habilitar **Authentication** con el método **Email/Password**
- Activar **Cloud Firestore**

### 🗃️ Colecciones necesarias en Firestore

| Colección        | Campos mínimos                                        |
|------------------|--------------------------------------------------------|
| `users`          | `nickname`, `email`, `uid`                            |
| `records`        | `userId`, `date`, `mood`, `bloodPressure`, `heartRate`, `weight`, `symptoms`, `notes` |
| `reminders`      | `userId`, `message`, `repeat`, `time`                |
| `recommendations`| `userId`, `date`, `recommendation`, `source`         |

### 📌 Índices necesarios (crear en Firestore > Índices compuestos)

1. **Para análisis en recomendaciones**:

```
Colección: records
Campos:
  userId (Ascendente)
  date   (Descendente)
```

> ⚠️ Si aparece un error en consola como `The query requires an index`, sigue el enlace que Firebase provee para crearlo automáticamente.

---

## 🔒 Seguridad

Este proyecto usa `.env` para proteger las claves de Firebase. ¡No subas el archivo `.env` a GitHub!  
Asegúrate de agregarlo a tu `.gitignore`:

```
.env
```

---

## 🙌 Contribuye

¿Ideas para nuevas funcionalidades? ¿Detección emocional avanzada? ¡Haz un PR o abre un issue!  
MoodTrack es un proyecto vivo 💡


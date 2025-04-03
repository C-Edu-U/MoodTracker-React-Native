# MoodTrack

MoodTrack es una app móvil creada con **React Native + Expo** para ayudarte a registrar y visualizar tu estado emocional diariamente. Ideal para el autocuidado, salud mental y seguimiento del bienestar 🧠💜

## 🚀 Funcionalidades

- Registro diario de estado de ánimo, síntomas y métricas de salud
- Recordatorios personalizados
- Recomendaciones generadas automáticamente
- Gráficas de evolución emocional
- Login y registro con Firebase

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
react-native-chart-kit
firebase
expo
react-navigation
react-native-vector-icons
react-native-dotenv
expo-constants
react-native-picker-select

```

---

## 🔒 Seguridad

Este proyecto usa `.env` para proteger las claves de Firebase. ¡No subas el archivo `.env` a GitHub!

---

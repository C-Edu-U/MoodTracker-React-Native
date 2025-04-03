import 'dotenv/config';

export default {
  expo: {
    name: "MoodTrack",
    slug: "moodtrack",
    version: "1.0.0",
    owner: "edu-ugarteche",
    android: {
      package: "com.eduugarteche.moodtrack", // 👈 Aquí defines tu package name único
    },
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      eas: {
        projectId: "4b14bdf8-4cad-4ac2-883e-998e3e4103a0",
      },
    },
  },
};

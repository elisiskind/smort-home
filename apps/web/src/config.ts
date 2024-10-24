import { z } from 'zod';

export const config = {
  serverUrl: z.string().parse(import.meta.env.VITE_SERVER_URL),
  googleClientId: z.string().parse(import.meta.env.VITE_GOOGLE_CLIENT_ID),
  firebaseConfig: {
    apiKey: z.string().parse(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: z.string().parse(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: z.string().parse(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: z
      .string()
      .parse(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: z
      .string()
      .parse(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    appId: z.string().parse(import.meta.env.VITE_FIREBASE_APP_ID),
  },
} as const;

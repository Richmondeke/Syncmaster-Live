import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";
import { app, isFirebaseConfigured } from "./config";

export async function requestNotificationPermission() {
  if (!isFirebaseConfigured || typeof window === 'undefined') return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      return token;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
  return null;
}

export function onMessageListener() {
  if (!isFirebaseConfigured || typeof window === 'undefined') return null;
  
  try {
    const messaging = getMessaging(app);
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    });
  } catch (error) {
    console.error("Error setting up message listener:", error);
    return null;
  }
}

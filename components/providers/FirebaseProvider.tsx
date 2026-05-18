"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { requestNotificationPermission, onMessageListener } from "@/lib/firebase/messaging";
import { useToast } from "@/components/Toast";

const FirebaseContext = createContext<{
  isConfigured: boolean;
  fcmToken: string | null;
}>({
  isConfigured: false,
  fcmToken: null,
});

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const setupNotifications = async () => {
      const token = await requestNotificationPermission();
      if (token) {
        setFcmToken(token);
        // Here we would sync with Supabase profiles table
        console.log("FCM Token acquired:", token);
      }
    };

    setupNotifications();

    // Foreground message handler
    onMessageListener()?.then((payload: any) => {
      if (payload?.notification) {
        addToast(
          `${payload.notification.title || "New Notification"}: ${payload.notification.body || ""}`,
          "info"
        );
      }
    });
  }, [addToast]);

  return (
    <FirebaseContext.Provider value={{ isConfigured: isFirebaseConfigured, fcmToken }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);

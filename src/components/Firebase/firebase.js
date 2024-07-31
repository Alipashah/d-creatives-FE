import { initializeApp } from "firebase/app";
import { getToken, getMessaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDLTtjUh7czUob6s7_SmvHcPWLrU0mwhM4",
  authDomain: "dynamic-creative-6a29d.firebaseapp.com",
  projectId: "dynamic-creative-6a29d",
  storageBucket: "dynamic-creative-6a29d.appspot.com",
  messagingSenderId: "267316593761",
  appId: "1:267316593761:web:5678f4647334bf6e3d9620",
  measurementId: "G-247G0P2Q7F",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getOrRegisterServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    return window.navigator.serviceWorker
      .getRegistration("/firebase-push-notification-scope")
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          {
            scope: "/firebase-push-notification-scope",
          }
        );
      });
  }
  throw new Error("The browser doesn`t support service worker.");
};

export const getFirebaseToken = () =>
  getOrRegisterServiceWorker().then((serviceWorkerRegistration) =>
    getToken(messaging, {
      vapidKey:
        "BIXLIxpdvXQtdY3gWBI8VLYJsbYXxBLR7xLwBaMpH80BFumPzlpzVZjnoMHALAtGX3h69NkVfo_Qwz-_WR7n7eo",
      serviceWorkerRegistration,
    })
  );

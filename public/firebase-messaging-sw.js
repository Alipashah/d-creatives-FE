// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDLTtjUh7czUob6s7_SmvHcPWLrU0mwhM4",
  authDomain: "dynamic-creative-6a29d.firebaseapp.com",
  projectId: "dynamic-creative-6a29d",
  storageBucket: "dynamic-creative-6a29d.appspot.com",
  messagingSenderId: "267316593761",
  appId: "1:267316593761:web:5678f4647334bf6e3d9620",
  measurementId: "G-247G0P2Q7F",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

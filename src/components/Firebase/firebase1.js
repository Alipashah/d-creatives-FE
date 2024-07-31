import { initializeApp } from "firebase/app";
// import { firebase } from "firebase/app";

import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDLTtjUh7czUob6s7_SmvHcPWLrU0mwhM4",
  authDomain: "dynamic-creative-6a29d.firebaseapp.com",
  projectId: "dynamic-creative-6a29d",
  storageBucket: "dynamic-creative-6a29d.appspot.com",
  messagingSenderId: "267316593761",
  appId: "1:267316593761:web:5678f4647334bf6e3d9620",
  measurementId: "G-247G0P2Q7F",
};

const firebase = initializeApp(firebaseConfig);

// const messaging = getMessaging();
const messaging = firebase.messaging();

export const requestNotificationPermission = async () => {
  messaging
    .requestPermission()
    .then(() => {
      return messaging.getToken();
    })
    .then((token) => {
      console.log({ token });
    })
    .catch((err) => {
      console.log({ err });
    });
};

// export const requestNotificationPermission = async () => {
//   try {
//     // await messaging.requestPermission();
//     const token = await getToken(messaging, {
//       vapidKey:
//         "BIXLIxpdvXQtdY3gWBI8VLYJsbYXxBLR7xLwBaMpH80BFumPzlpzVZjnoMHALAtGX3h69NkVfo_Qwz-_WR7n7eo",
//     })
//       .then((currentToken) => {
//         if (currentToken) {
//           return currentToken;
//         } else {
//           // Show permission request UI
//           console.log(
//             "No registration token available. Request permission to generate one."
//           );
//           // ...
//         }
//       })
//       .catch((err) => {
//         console.log("An error occurred while retrieving token. ", err);
//         // ...
//       });

//     return token;
//   } catch (error) {
//     console.error("Unable to get permission to notify.", error);
//     throw error;
//   }
// };

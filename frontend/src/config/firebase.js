import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAqoC_COK_-TFRbaOzrJCIzA_2FZYJR200",
  authDomain: "chatapp-d63d5.firebaseapp.com",
  projectId: "chatapp-d63d5",
  storageBucket: "chatapp-d63d5.appspot.com",
  messagingSenderId: "669472495100",
  appId: "1:669472495100:web:c655a76e52bd4ca9a38e79",
  measurementId: "G-R4P6Z0G2RV",
};

const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);

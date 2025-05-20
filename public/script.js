import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  // other config...
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

signInAnonymously(auth).catch((error) => {
  console.error("Anonymous sign-in failed:", error);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Signed in anonymously:", user.uid);
    // Now you can use database safely
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {
  getFirestore,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
import {
  getAuth, sendPasswordResetEmail, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsOhyEyWEocvIyHyMkc5SmiiaqdlrTRL4",
  authDomain: "iiiii777ii887789i.firebaseapp.com",
  projectId: "iiiii777ii887789i",
  storageBucket: "iiiii777ii887789i.appspot.com",
  messagingSenderId: "207362776449",
  appId: "1:207362776449:web:62bc91bc13eb80302ddc80",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const user = auth.currentUser;

const reset = document.querySelector(".reset-password");
if (reset != null) {
reset.addEventListener("submit", (e) => {
  e.preventDefault();

  var email = reset["reset-email"].value;

  (async function () {
    sendPasswordResetEmail(auth, email)
    .then(() => {
      document.querySelector(".reset-password").style.display = "none";
      document.getElementById("sentEmail").style.display = "block";
      
    })
    .catch((error) => {
      const loginerrorCode = error.code;
      const loginerrorMessage = error.message;
    });
  })();
});
}

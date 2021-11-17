import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
import {
  getAuth,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
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
const welcome = document.querySelector(".welcome");
const faq = document.querySelector(".faq");
const disclaimer = document.querySelector(".disclaimer");

onAuthStateChanged(auth, (user) => {
  
  if (user) {
    hideNavBar(user);
    const profileInfo = document.querySelector(".profileInfo");
    const confirmationUniqueID = document.querySelector(
      ".confirmationUniqueID"
    );
    if (profileInfo != null) {
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef).then((doc) => {
        const uniqueIDProfile = document.createTextNode(doc.data().uniqueID);
        const displayNameProfile = document.createTextNode(user.displayName);
        const emailProfile = document.createTextNode(user.email);
        const phoneNumberProfile = document.createTextNode(
          doc.data().phoneNumber
        );

        if (!document.getElementById("profile-name").hasChildNodes()) {
          document
            .getElementById("profile-name")
            .appendChild(displayNameProfile);
          document
            .getElementById("profile-mobile")
            .appendChild(phoneNumberProfile);
          document.getElementById("profile-email").appendChild(emailProfile);
          document
            .getElementById("profile-uniqueid")
            .appendChild(uniqueIDProfile);
        }
      });
    } else if (confirmationUniqueID != null) {
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef).then((doc) => {
        const confirmationUniqueID = document.createTextNode(
          doc.data().uniqueID
        );
        if (!document.querySelector(".confirmationUniqueID").hasChildNodes()) {
          document
            .querySelector(".confirmationUniqueID")
            .appendChild(confirmationUniqueID);
        }
      });
    }
  } else {
    hideNavBar(false);
    if (
      loginForm != null ||
      signUpForm != null ||
      reset != null ||
      welcome != null ||
      faq != null ||
      disclaimer != null
    ) {
    } else {
      document.location.href = "login.html";
    }
  }
});

const reset = document.querySelector(".reset-password");
const loginForm = document.querySelector(".login-form");
if (loginForm != null) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    var email = loginForm["loginEmail"].value;
    var password = loginForm["loginPassword"].value;
    // var username = loginForm['username'].value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        document.location.href = "profile.html";
      })
      .catch((error) => {
        var errorMessage = "";
          switch (error.code) {
            case "auth/invalid-email":
              errorMessage =
                "Your email address appears to be imporperly formatted/missing.";
              break;
            case "auth/email-already-exists":
              errorMessage =
                "Email is already registered. Please forget password.";
              break;
              case "auth/internal-error":
                errorMessage =
                "Please create a password.";
                break;
            default:
              errorMessage = "An undefined Error happened.";
          }
          const loginerrorMessage = document.createTextNode(errorMessage);

          if (document.getElementById("error").hasChildNodes()) {
            document.getElementById("error").removeChild(loginerrorMessage);
          }
          document.getElementById("error").appendChild(loginerrorMessage);
      });
  });
}

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

async function createUserCollection(db, userID, phoneNumber) {
  const uniqueID = create_UUID();
  try {
    await setDoc(doc(db, "users", userID), {
      uniqueID: uniqueID,
      phoneNumber: phoneNumber,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  document.location.href = "YourInfo.html";
}

const signUpForm = document.querySelector(".signUp-form");
if (signUpForm != null) {
  const checkBox = document.getElementById("acceptDisclaimerCheckbox");
  const submitButton = document.getElementById("signUpButton");
  submitButton.disabled = !checkBox.checked;
  checkBox.addEventListener("click", (e) => {
    submitButton.disabled = !checkBox.checked;
  });

  signUpForm.addEventListener("submit", (e) => {
    var email = signUpForm["signUp-email"].value;
    var confirmEmail = signUpForm["signUp-confirmEmail"].value;
    var password = signUpForm["signUp-password"].value;
    var repeatPassword = signUpForm["signUp-repeatPassword"].value;
    var phoneNumber = signUpForm["signUp-mobile"].value;

    if (password == repeatPassword && email == confirmEmail) {
      document.getElementById("noMatch").style.display = "none";
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          updateProfile(auth.currentUser, {
            email: email,
          }).then(() => {}).catch((error) => {});
            sendEmailVerification(userCredential.user).then(() => {
            }).catch((error) => {
            });
          createUserCollection(db, userCredential.user.uid, phoneNumber).then(
            () => {}
          );
        })
        .catch((error) => {
          var errorMessage = "";
          switch (error.code) {
            case "auth/invalid-email":
              errorMessage =
                "Your email address appears to be imporperly formatted/missing.";
              break;
            case "auth/email-already-exists":
              errorMessage =
                "Email is already registered. Please forget password.";
              break;
              case "auth/internal-error":
                errorMessage =
                "Incorrect password.";
              break;
          }
          const loginerrorMessage = document.createTextNode(errorMessage);
          if (document.getElementById("error").hasChildNodes()) {
            document.getElementById("error").removeChild(loginerrorMessage);
          }
          document.getElementById("error").appendChild(loginerrorMessage);
        });
    } else if (
      password == "" ||
      repeatPassword == "" ||
      password != repeatPassword
    ) {
      const loginerrorMessage = document.createTextNode("Passwords do not match")
      if (document.getElementById("error").hasChildNodes()) {
        document.getElementById("error").removeChild(loginerrorMessage);
      }
      document.getElementById("error").appendChild(loginerrorMessage);
    } else if (
      email == "" ||
      confirmEmail == "" ||
      email != confirmEmail
    ) {
      const loginerrorMessage = document.createTextNode("Emails do not match");
      if (document.getElementById("error").hasChildNodes()) {
        document.getElementById("error").removeChild(loginerrorMessage);
      }
      document.getElementById("error").appendChild(loginerrorMessage);
    }
  });
}

const residencyForm = document.querySelector(".residency-form");
if (residencyForm != null) {
  residencyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    var liveNowState =
      document.getElementById("NOWstate_region").selectedIndex.value;
    var liveNowResidency =
      document.getElementById("NOWcountry").selectedIndex.value;
    var bornResidency =
      document.getElementById("BORNcountry").selectedIndex.value;
    var livedMostResidency =
      document.getElementById("MAJORcountry").selectedIndex.value;

    (async function (
      liveNowState,
      liveNowResidency,
      bornResidency,
      livedMostResidency
    ) {
      try {
        await updateDoc(docRef, {
          currentLocation: liveNowState + " " + liveNowResidency,
          bornLocation: bornResidency,
          livedMostLocation: livedMostResidency,
        });
      } catch (error) {
        const loginerrorMessage = document.createTextNode(error.message);
        document.getElementById("error").appendChild(loginerrorMessage);
      }
    })(liveNowState, liveNowResidency, bornResidency, livedMostResidency);
    document.location.href = "Confirmation.html";
  });
}

const profileCreationForm = document.querySelector(".profileCreation-form");
if (profileCreationForm != null) {
  profileCreationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const docRef = doc(db, "users", auth.currentUser.uid);
    var firstname = profileCreationForm["fname"].value;
    var middlename = profileCreationForm["mname"].value;
    var lastname = profileCreationForm["lname"].value;
    var month = document.getElementById("birthmonth");
    var day = document.getElementById("day");
    var year = document.getElementById("birthyear");
    var gender = document.getElementById("gender");
    if (firstname != null && middlename != null && lastname != null) {
      updateProfile(auth.currentUser, {
        displayName: firstname + " " + middlename + " " + lastname,
      }).then(() => {
        var monthA = month.options[month.selectedIndex].value;
        var dayA = day.options[day.selectedIndex].value;
        var yearA = year.options[year.selectedIndex].value;
        var genderA = gender.options[gender.selectedIndex].value;
        (async function (monthA, dayA, yearA, genderA) {
          try {
            await updateDoc(docRef, {
              month: monthA,
              day: dayA,
              year: yearA,
              gender: genderA,
            });
          } catch (error) {
            const loginerrorMessage = document.createTextNode(error.message);
            document.getElementById("error").appendChild(loginerrorMessage);
          }
          document.location.href = "Residency.html";
        })(monthA, dayA, yearA, genderA);
      });
    } else {
      document.getElementById("All-fields").style.display = "block";
    }
  });
} else {
}

const profile = document.getElementById("profile");
if (profile != null) {
  profile.addEventListener("click", (e) => {
    document.location.href = "profile.html";
  });
}
// const permissions = document.querySelector(".sharePermissions");
// if (permissions != null) {
//   permissions.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const user = auth.currentUser;
//     const doctor = document.getElementById("share-with-doctor");
//     const employer = document.getElementById("share-with-employer");
//     const HCPinput = document.getElementById("share-with-HCP");

//     const docRef = doc(db, "users", user.uid);
//     (async function (docRef) {
//       try {
//         await updateDoc(docRef, {
//           me: true,
//           doctor: doctor.checked,
//           employer: employer.checked,
//           HCP: HCPinput.checked,
//         });
//       } catch (error) {
//         console.log(error);
//       }
//       document.location.href = "YourInfo.html";
//     })(docRef);
//   });
// }

onAuthStateChanged(auth, (user) => {
  if (user) {
    hideNavBar(user);
    return user;
  } else {
    hideNavBar(false);
  }
});

const hideNavBar = (user) => {
  if (user) {
    document
      .querySelectorAll(".logged-in")
      .forEach((item) => (item.style.display = "block"));
  } 
  else {
    document
      .querySelectorAll(".logged-in")
      .forEach((item) => (item.style.display = "none"));
  }
};

const logout = document.getElementById("logout");
if (logout != null) {
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        document.location.href = "login.html";
      })
      .catch((error) => {});
  });
}

import { firebaseConfig } from "./app";
import {updateDoc} from '@firebase';

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

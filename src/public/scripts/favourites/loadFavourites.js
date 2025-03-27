/**
 * loaded upon page load to check if user is
 * authenticated, and if so, finds saved listing
 * objects and loads into favourite page.
 */
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    userDoc = db.collection("users").doc(user.uid);
    userDoc.get().then((u) => {
      //get the user saved 
      let saved = u.data().saved;

      if (saved.length == 0) {
        document.getElementsByClassName("loader-container")[0].style.display = "none";
        document.getElementsByClassName("loader")[0].style.display = "none";
        document.getElementById("message-container").style.display = "block";
        return;
      }

      let cardTemplate = document.getElementById("listing-template");

      document.getElementsByClassName("loader-container")[0].style.display = "none";
      document.getElementsByClassName("loader")[0].style.display = "none";
      for (let i = 0; i < saved.length; i++) {
        let card = cardTemplate.content.cloneNode(true);

        let listing = JSON.parse(saved[i]);

        card.querySelector(".listing-title").innerHTML = listing.title;
        card.querySelector(".listing-location").innerHTML = listing.location;
        card.querySelector(".listing-data").innerHTML = listing.data;
        card.querySelector(".listing-link").href = listing.redirect;
        card.querySelector(".listing-preview").src = listing.preview;

        document.getElementById("listings").appendChild(card);
      }
    });
  }
});

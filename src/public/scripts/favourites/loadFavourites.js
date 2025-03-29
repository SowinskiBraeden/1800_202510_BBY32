let userDoc;

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
        console.log(listing);
        
        card.querySelector(".listing").id = `${i}-card`;
        card.querySelector(".listing-title").innerHTML = listing.title;
        card.querySelector(".listing-location").innerHTML = listing.location;
        card.querySelector(".listing-data").innerHTML = listing.data;
        card.querySelector(".listing-link").href = listing.redirect;
        card.querySelector(".listing-preview").src = listing.preview;
        card.querySelector(".quick-remove").id = `${i}-remove`;
        card.getElementById(`${i}-remove`).onclick = () => { quickRemoveFavourite(i) };

        document.getElementById("listings").appendChild(card);
      }
    });
  }
});

/**
 * quickRmoveFavourite removes favourited listing
 * directly from the favourites page.
 * @param index is the id of the element to remove
 */
function quickRemoveFavourite(index) {
  let listing = document.getElementById(`${index}-card`);
  let content = listing.childNodes[1].childNodes[1];

  let data = {
    title:    content.childNodes[3].childNodes[1].innerHTML,
    location: content.childNodes[3].childNodes[3].innerHTML,
    data:     content.childNodes[3].childNodes[5].innerHTML,
    redirect: `/dashboard${listing.childNodes[1].href.split("/dashboard")[1]}`,
    preview:  content.childNodes[1].childNodes[1].src,
  };

  document.getElementById("listings").removeChild(listing);

  userDoc.update({
    saved: firebase.firestore.FieldValue.arrayRemove(JSON.stringify(data))
  }); 
} 
const heartIcon = document.getElementById('heart');
  
let userDoc;
let listingData;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    userDoc = db.collection("users").doc(user.uid);
    userDoc.get().then((u) => {
      //get the user saved 
      let saved = u.data().saved;

      // listing defined globally in loadListing.js
      listingData = {
        title:    listing.title,
        location: listing.location,
        data:     `${listing.priceStr} - ${listing.sqft}sqft - ${listing.bedrooms} room${listing.bedrooms > 1 ? "s" : ""}`,
        redirect: `/dashboard/${window.location.href.split("/dashboard/")[1]}`,
        preview:  listing.images[0]
      };

      if (saved.includes(JSON.stringify(listingData))) {
        heartIcon.src = "/static/icons/heart-solid.svg"
      }
    });
  }
});

document.getElementById("favourite").addEventListener('click', function() {
  if (heartIcon.src.includes("/static/icons/heart.svg")) {
    // Save listing to user and update icon
    userDoc.update({
      saved: firebase.firestore.FieldValue.arrayUnion(JSON.stringify(listingData))
    }).then(() => heartIcon.src = "/static/icons/heart-solid.svg");
  } else {
    // Unsave listing from user and update icon
    userDoc.update({
      saved: firebase.firestore.FieldValue.arrayRemove(JSON.stringify(listingData))
    }).then(() => heartIcon.src = "/static/icons/heart.svg");
  }
});

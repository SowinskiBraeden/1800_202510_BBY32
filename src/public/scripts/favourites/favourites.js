var userdoc;
firebase.auth().onAuthStateChanged(u => {
  if (u) {
    //go to the correct user document by referencing to the user uid
    userdoc = db.collection("users").doc(u.uid);
    userdoc.get()
      .then(u => {
      //get the user saved 
      var saved = u.data().saved;
      if (saved.includes(JSON.stringify(listingData))) {
          heart.src = "/static/icons/heart-solid.svg"
      }
    })
    } else {
    // No user is signed in.
    console.log ("No user is signed in");
    }
})

document.getElementById("favourited").addEventListener('click', function() {
  const heart = document.getElementById('heart');
  if (heart.src.includes("/static/icons/heart.svg")) {

    userdoc.update({
      saved: firebase.firestore.FieldValue.arrayUnion(JSON.stringify(listingData))
    }) 
    .then(function () {
      console.log("saved" );
      //this is to change the icon that was saved to "filled"
      heart.src = "/static/icons/heart-solid.svg"
    });
  } else {
    userdoc.update({
      saved: firebase.firestore.FieldValue.arrayRemove(JSON.stringify(listingData))
    })
    .then(function () {
      console.log("removed" );
      //this is to change the icon that was saved to "filled"
      heart.src = "/static/icons/heart.svg"
    });
  }
});


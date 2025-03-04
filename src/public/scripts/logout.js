function logout() {
  firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log("logging out user");
  }).catch((error) => {
      // An error happened.
      console.error(error);
  });
}

function isNotAuthenticated() {
  firebase.auth().onAuthStateChanged(user => {
    // redirect to dashboard if user is already authenticated
    if (!user) {
      window.location.href = "/login";
    }
  });
}
isNotAuthenticated();

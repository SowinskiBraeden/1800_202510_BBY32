function isAuthenticated() {
  firebase.auth().onAuthStateChanged(user => {
    // redirect to dashboard if user is already authenticated
    if (user) {
      window.location.href = "/dashboard";
    }
  });
}
isAuthenticated();

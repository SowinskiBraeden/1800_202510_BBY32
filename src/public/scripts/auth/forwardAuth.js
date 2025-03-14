function forwardAuth() {
  let url = window.location.href;
  if (url.includes("login")) {
    firebase.auth().onAuthStateChanged(user => {
      // redirect to dashboard if user is already authenticated
      if (user) {
        // window.location.assign("dashboard")
      }
    });
  } else if (url.includes("dashboard")) {
    firebase.auth().onAuthStateChanged(user => {
      // redirect to dashboard if user is already authenticated
      if (!user) {
        // window.location.assign("login");
      }
    });
  }
}

// forwardAuth();

function logout() {
  firebase.auth().signOut().catch((error) => {
      console.error(error);
  });
  window.location.href = "login";
}

/**
 * forwardAuth detects if a user is already
 * authenticated to bypass login page
 * or redirect from dashboard to login
 * if not authenticated.
 */
function forwardAuth() {
  let url = window.location.href;
  if (url.includes("login")) {
    firebase.auth().onAuthStateChanged(user => {
      // redirect to dashboard if user is already authenticated
      if (user) {
        window.location.assign("dashboard")
      }
    });
  } else if (url.includes("dashboard")) {
    firebase.auth().onAuthStateChanged(user => {
      // redirect to dashboard if user is already authenticated
      if (!user) {
        window.location.assign("login");
      }
    });
  }
}

forwardAuth();

/**
 * logout removes user authenticated and 
 * redirects to login page.
 */
function logout() {
  firebase.auth().signOut().catch((error) => {
      console.error(error);
  });
  window.location.href = "login";
}

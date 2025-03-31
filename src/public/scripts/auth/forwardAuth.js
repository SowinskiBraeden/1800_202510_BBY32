/**
 * forwardAuth detects if a user is already
 * authenticated to bypass login page
 * or redirect from dashboard to login
 * if not authenticated.
 */
function forwardAuth() {  
  firebase.auth().onAuthStateChanged(user => {
    let url = window.location.href;
  
    if (user && url.includes("login")) {
      window.location.assign("/dashboard");
    } else if (
      !user && (
        url.includes("dashboard") ||
        url.includes("favourites") ||
        url.includes("profile")
      )
    ) {
      window.location.assign("/login");
    }
  });
}

// Don't uncomment this.
// For reasons I am too lazy to investiage. having forward auth prevents the user
// object from being created in the database, so accessing the profile and the
// favourites page will not work since there is no user object created.
// forwardAuth();

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

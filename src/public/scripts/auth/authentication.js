// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {

      let user = authResult.user;
      if(authResult.additionalUserInfo.isNewUser) {
        db.collection("users").doc(user.uid).set({
          name: user.displayName,
          email: user.email,
          city: null,
          province: null,
          workAddr: null,
          schoolAddr: null,
          saved: [],
        }).then(() => {
          // Send to profile and prompt for additional details
          window.location.assign("/dashboard/profile");
        }).catch((err) => {
          console.error(`Error creating user: ${err}`);0
        });
      } else {
        // authenticated but not new user
        return true;
      }

      // No user
      return false;
    },

    uiShown: () => {
      document.getElementById('loader').style.display = 'none';
    }
  },

  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'dashboard',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

ui.start('#firebaseui-auth-container', uiConfig);

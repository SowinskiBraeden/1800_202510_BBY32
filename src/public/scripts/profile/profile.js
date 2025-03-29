/**
 * A reference to the current user's Firestore document.
 * This variable is set once the user is authenticated.
 */
let currentUser; //points to the document of the user who is logged in

/**
 * Populates the user's profile information in the form fields.
 * Retrieves the user's data from Firestore and updates the form fields
 * with the user's name, email, city, work address, and province.
 * If no user is signed in, logs a message to the console.
 */
function populateUserInfo() {
  firebase.auth().onAuthStateChanged(user => {

    // Check if user is signed in:
    if (user) {
      // Go to the correct user document by referencing the user UID
      currentUser = db.collection("users").doc(user.uid);
      // Get the document for the current user
      currentUser.get()
        .then(userDoc => {

          console.log(userDoc);

          // Get the data fields of the user
          let userName = userDoc.data().name;
          let userEmail = userDoc.data().email;
          let userCity = userDoc.data().city;
          let workAddress = userDoc.data().workAddress;
          let province = userDoc.data().province;

          // If the data fields are not empty, then write them into the form
          if (userName != null) {
            document.getElementById("nameInput").value = userName;
          }
          if (userEmail != null) {
            document.getElementById("email").value = userEmail;
          }
          if (userCity != null) {
            document.getElementById("cityInput").value = userCity;
          }
          if (workAddress != null) {
            document.getElementById("addressInput").value = workAddress;
          }
          if (province != null) {
            document.getElementById("userProvince").value = province;
          }
        });
    } else {
      // No user is signed in
      console.log("No user is signed in");
    }
  });
}

// Call the function to populate user information
populateUserInfo();

/**
 * Enables the form fields for editing the user's profile information.
 * This function is triggered when the user clicks the "Edit" button.
 */
function editUserInfo() {
  // Enable the form fields
  document.getElementById("personalInfoFields").disabled = false;
}

/**
 * Saves the user's updated profile information to Firestore.
 * Retrieves the values entered by the user in the form fields and updates
 * the corresponding fields in the Firestore document. Disables the form fields
 * after saving the data.
 */
function saveUserInfo() {
  // a) Get user-entered values
  let userName = document.getElementById("nameInput").value;       // Get the value of the field with id="nameInput"
  let userEmail = document.getElementById("email").value;          // Get the value of the field with id="email"
  let userCity = document.getElementById("cityInput").value;       // Get the value of the field with id="cityInput"
  let userWorkAddress = document.getElementById("addressInput").value; // Get the value of the field with id="addressInput"
  let userProvince = document.getElementById("userProvince").value;    // Get the value of the field with id="userProvince"
  
  // b) Update user's document in Firestore
  currentUser.update({
    name: userName,
    email: userEmail,
    city: userCity,
    workAddress: userWorkAddress,
    province: userProvince,
  })
  .then(() => {
    console.log("Document successfully updated!");
  });

  // c) Disable edit
  document.getElementById("personalInfoFields").disabled = true;
}

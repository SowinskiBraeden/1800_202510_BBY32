// DOM Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("btn btn-primary");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const message = document.getElementById("message");

// Register User
registerBtn.addEventListener("click", function() {
    const email = emailInput.value;
    const password = passwordInput.value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            message.textContent = "User Registered Successfully!";
        })
        .catch((error) => {
            message.textContent = "Error: " + error.message;
        });
});

// Login User
loginBtn.addEventListener("click", function() {
    const email = emailInput.value;
    const password = passwordInput.value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            message.textContent = "Login Successful!";
            logoutBtn.style.display = "block";
            loginBtn.style.display = "none";
            registerBtn.style.display = "none";
        })
        .catch((error) => {
            message.textContent = "Error: " + error.message;
        });
});

// Logout User
logoutBtn.addEventListener("click", function() {
    auth.signOut().then(() => {
        message.textContent = "User Logged Out!";
        logoutBtn.style.display = "none";
        loginBtn.style.display = "block";
        registerBtn.style.display = "block";
    }).catch((error) => {
        message.textContent = "Error: " + error.message;
    });
});

// Monitor Authentication State
auth.onAuthStateChanged((user) => {
    if (user) {
        message.textContent = "User is logged in as " + user.email;
        logoutBtn.style.display = "block";
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
    } else {
        message.textContent = "No user is logged in.";
        logoutBtn.style.display = "none";
        loginBtn.style.display = "block";
        registerBtn.style.display = "block";
    }
});

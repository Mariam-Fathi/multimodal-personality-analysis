window.addEventListener("DOMContentLoaded", function () {
  var selectedOption = sessionStorage.getItem("selectedOption");
  if (selectedOption) {
    var radioButton = document.querySelector(
      'input[value="' + selectedOption + '"]'
    );
    if (radioButton) {
      radioButton.checked = true;
    }
  }
});

// Sign-in form //
const signInForm = document.getElementById("signInForm");

const signIn = async () => {
  const email = document.getElementById("mail").value;
  const password = document.getElementById("pass").value;

  const data = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch("/sfe-rs/registration/signin/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (response.ok && responseData.status === "success") {
      sessionStorage.setItem("role", responseData.role);
      sessionStorage.setItem("registrationStatus", "signedIn");
      window.location.href = "/sfe-rs/";
    } else {
      const msg = responseData.errors?.[0]?.message || responseData.message || "Sign-in failed.";
      alert(msg);
    }
  } catch (error) {
    console.error(error);
    alert("Sign-in failed.");
  }
};

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signIn();
});

// Sign-up form //
const signUpForm = document.getElementById("signUpForm");

const signUp = async () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const age = document.getElementById("age").value;
  const major = document.getElementById("major").value;
  const genderSelect = document.getElementById("gender");
  const gender = genderSelect.options[genderSelect.selectedIndex].value;

  const data = {
    name: name,
    email: email,
    password: password,
    gender: gender,
    age: age,
    major: major,
  };

  try {
    const response = await fetch("/sfe-rs/registration/signup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (response.ok && responseData.status === "success") {
      window.location.href = "/sfe-rs/";
    } else {
      const msg = responseData.errors?.[0]?.message || responseData.message || "Sign-up failed.";
      alert(msg);
    }
  } catch (error) {
    console.error(error);
    alert("Sign-up failed.");
  }
};

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signUp();
});

async function signOut() {
  sessionStorage.clear();
  try {
    await fetch("/sfe-rs/signout/", { method: "POST", credentials: "same-origin" });
  } catch (e) {}
  window.location.href = "/sfe-rs/";
}

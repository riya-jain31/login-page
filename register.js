const form = document.getElementById("registerForm");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");
const termsError = document.getElementById("termsError");
const successMsg = document.getElementById("successMsg");
const togglePassword = document.getElementById("togglePassword");

// Show an error under an input (or clear it when message is "")
function setError(input, message) {
  const box = input.closest(".input-box");
  box.querySelector(".error-msg").textContent = message;
  box.classList.toggle("invalid", message !== "");
  return message === "";
}

function validateUsername() {
  const v = username.value.trim();
  if (v.length < 3) return setError(username, "Enter at least 3 characters.");
  return setError(username, "");
}

function validateEmail() {
  const v = email.value.trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  return setError(email, ok ? "" : "Enter a valid email address.");
}

function validatePassword() {
  const v = password.value;
  if (v.length < 8) return setError(password, "Use at least 8 characters.");
  if (!/[A-Z]/.test(v) || !/[a-z]/.test(v))
    return setError(password, "Use upper and lower case letters.");
  if (!/\d/.test(v)) return setError(password, "Add at least one number.");
  return setError(password, "");
}

function validateConfirm() {
  if (
    confirmPassword.value === "" ||
    confirmPassword.value !== password.value
  ) {
    return setError(confirmPassword, "Passwords do not match.");
  }
  return setError(confirmPassword, "");
}

function validateTerms() {
  termsError.textContent = terms.checked ? "" : "You must accept the terms.";
  return terms.checked;
}

// Check fields when the user leaves them
username.addEventListener("blur", validateUsername);
email.addEventListener("blur", validateEmail);
password.addEventListener("blur", validatePassword);
confirmPassword.addEventListener("blur", validateConfirm);
terms.addEventListener("change", validateTerms);

// Re-check live once a field has shown an error
[
  [username, validateUsername],
  [email, validateEmail],
  [password, validatePassword],
  [confirmPassword, validateConfirm],
].forEach(([input, check]) => {
  input.addEventListener("input", () => {
    if (input.closest(".input-box").classList.contains("invalid")) check();
  });
});

// Keep the confirm field in sync when the password changes
password.addEventListener("input", () => {
  if (confirmPassword.value) validateConfirm();
});

// Click the lock icon on the password field to show / hide it
togglePassword.style.cursor = "pointer";
togglePassword.addEventListener("click", () => {
  const show = password.type === "password";
  password.type = show ? "text" : "password";
  confirmPassword.type = show ? "text" : "password";
  togglePassword.setAttribute("name", show ? "lock-closed" : "lock-open");
});

// Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  successMsg.textContent = "";

  const results = [
    validateUsername(),
    validateEmail(),
    validatePassword(),
    validateConfirm(),
    validateTerms(),
  ];

  if (!results.every(Boolean)) {
    const firstInvalid = form.querySelector(".invalid input");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const userData = {
    name: username.value.trim(),
    email: email.value.trim(),
    password: password.value,
  };

  // Replace this with a real request to your server:
  // fetch("/api/register", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(userData)
  // });
  console.log("Registered:", { ...userData, password: "********" });

  successMsg.textContent = "Registration successful!";
  form.reset();
  document
    .querySelectorAll(".input-box")
    .forEach((b) => b.classList.remove("invalid"));
});

function checkLoggedIn() {
  const token = localStorage.getItem("token")
}

if (!checkLoggedIn()) {
  window.location.href = "login.html"
}

// function createLoginForm() {}

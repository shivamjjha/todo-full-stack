export function populateUserDetails() {
  const userDetails = document.querySelector("#user-info")
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const nameDiv = document.createElement("div")
    if (user.name) {
      nameDiv.textContent = `${user.name}`
    }

    const emailDiv = document.createElement("div")
    if (user.email) {
      emailDiv.textContent = `${user.email}`
    }

    const userNameDiv = document.createElement("div")
    if (user.username) {
      userNameDiv.textContent = `(@${user.username})`
    }

    const logoutButton = document.createElement("button")
    logoutButton.textContent = "Logout"

    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("user")
      window.location.href = "/login.html"
    })

    userDetails.append(nameDiv, userNameDiv, emailDiv, logoutButton)
  } catch (error) {
    userDetails.textContent = "Error loading user details"
    userDetails.style.color = "#ff0000"
  }
}

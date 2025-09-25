import { checkLoggedIn } from "./check-logged-in.js"

if (checkLoggedIn()) {
  window.location.href = "index.html"
}

const loginForm = document.getElementById("login-form")
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const formData = new FormData(loginForm)
  const data = Object.fromEntries(formData.entries())
  console.log("data", data)
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  const resData = await res.json()
  console.log("resData", resData)
  if (resData.ok) {
    const user = resData.user
    localStorage.setItem("user", JSON.stringify(user))
    alert("Login successful!")
    window.location.href = "index.html"
  } else {
    alert("Error: " + resData.error)
  }
})

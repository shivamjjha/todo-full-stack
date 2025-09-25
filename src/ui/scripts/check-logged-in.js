export function checkLoggedIn() {
  const token = localStorage.getItem("user")
  return !!token
}

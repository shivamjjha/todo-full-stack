import { checkLoggedIn } from "./check-logged-in.js"
import { createTodoList, hookTodoForm } from "./create-todo-list.js"

if (!checkLoggedIn()) {
  console.log("Not logged in")
  window.location.href = "login.html"
  // return
}

createTodoList()
hookTodoForm()

// function createLoginForm() {}

import { sendRequest } from "./request.js"

export async function createTodoList(todos) {
  const todoContainer = document.querySelector("#todo-list")
  const userId = JSON.parse(localStorage.getItem("user")).id
  if (!userId) {
    throw new Error("User ID not found in local storage")
  }
  const res = await sendRequest(`/todos/`)
  // if (!res.ok) {
  //   console.log(res)
  //   alert(res.error)
  //   return
  // }
  console.log("allTodos", res)
  res.forEach(function (todo) {
    const li = document.createElement("li")
    li.setAttribute("data-id", todo.id)
    li.style.listStyleType = "none"

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = todo.status === "complete"

    const span = document.createElement("span")
    span.textContent = todo.title

    const deleteButton = document.createElement("button")
    deleteButton.textContent = "Delete"
    deleteButton.addEventListener("click", async () => {
      // TODO delete todo item
    })
    li.append(checkbox, span, deleteButton)

    todoContainer.append(li)
  })
}

export async function hookTodoForm() {
  const form = document.querySelector("#add-todo")
  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    const userId = JSON.parse(localStorage.getItem("user")).id
    if (!userId) {
      throw new Error("User ID not found in local storage")
    }
    data.userId = userId
    console.log("form data", data)
    const res = await sendRequest(`/todos/`, "POST", data)
    console.log("add todo response", res)
  })
}

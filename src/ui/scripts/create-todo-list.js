import { sendRequest } from "./request.js"

export async function createTodoList() {
  const todoContainer = document.querySelector("#todo-list")
  const userId = JSON.parse(localStorage.getItem("user")).id
  if (!userId) {
    throw new Error("User ID not found in local storage")
  }
  const res = await sendRequest(`/todos/`)
  todoContainer.innerHTML = ""
  // if (!res.ok) {
  //   console.log(res)
  //   alert(res.error)
  //   return
  // }
  // console.log("allTodos", res)
  res.forEach(function (todo) {
    const li = document.createElement("li")
    // li.setAttribute("data-id", todo.id)
    li.style.listStyleType = "none"

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = todo.status === "complete"
    checkbox.addEventListener("change", async (e) => {
      const newStatus = e.target.checked ? "complete" : "incomplete"
      // update status of todo item
      sendRequest(`/todos/${todo.id}`, "PUT", {
        status: newStatus,
        title: todo.title,
        description: todo.description,
      })
        .then((res) => {
          console.log("update status response", res)
          if (!res.ok) {
            checkbox.checked = !e.target.checked
            alert(res.error)
          }
        })
        .catch((err) => {
          console.error(err)
          checkbox.checked = !e.target.checked
          alert("Something went wrong")
        })
        .finally(() => {
          // refresh the todo list
          createTodoList()
        })
    })

    const span = document.createElement("span")
    span.textContent = todo.title

    const deleteButton = document.createElement("button")
    deleteButton.textContent = "Delete"
    deleteButton.addEventListener("click", async () => {
      sendRequest(`/todos/${todo.id}`, "DELETE")
        .catch((err) => {
          console.error(err)
          alert("Something went wrong")
        })
        .finally(() => {
          // refresh the todo list
          createTodoList()
        })
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
    sendRequest(`/todos/`, "POST", data)
      .catch((err) => {
        console.error(err)
        alert("Something went wrong")
      })
      .finally(() => {
        form.reset()
        form.children[0].focus()
        createTodoList()
      })
    // console.log("add todo response", res)
  })
}

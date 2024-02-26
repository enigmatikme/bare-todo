let todoItems = [];

function renderItems() {
  const orderedList = document.getElementById("orderedList");
  const listItems = todoItems.map((todoItem) => {
    const item = document.createElement("li");
    item.textContent = todoItem
    return item;
  })

  orderedList.replaceChildren(...listItems)
}

function onTodoSubmit(e) {
	e.preventDefault();
	const data = Object.fromEntries(new FormData(e.target));
	todoItems.push(data.todo);
  renderItems();
}

window.onload = renderItems
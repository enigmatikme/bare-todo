const todoItemsApi = {
	createItem: (todoItem) => {
		const todoItems = todoItemsApi.getAllItems();
		todoItems.push(todoItem);
		window.localStorage.setItem("todoItems", JSON.stringify(todoItems));
		return todoItems;
	}, // Function that adds an item
	getItem: (targetIndex) => {
		const allItems = todoItemsApi.getAllItems();
		return allItems[targetIndex];
	}, // Function that gets a single item
	getAllItems: () => {
		return JSON.parse(window.localStorage.getItem("todoItems")) || [];
	}, // Function that gets all items
	deleteItem: (deleteIndex) => {
		const allItems = todoItemsApi.getAllItems();
		const filteredItems = allItems.filter((_item, i) => {
			return deleteIndex !== i;
		});

		window.localStorage.setItem("todoItems", JSON.stringify(filteredItems));
		return filteredItems;
	}, // Function that deletes an item
	updateItem: (newItem, replaceIndex) => {
		const allItems = todoItemsApi.getAllItems();
		allItems[replaceIndex] = newItem;
		window.localStorage.setItem("todoItems", JSON.stringify(allItems));
		return allItems;
	}, // Function that updates an item
};

function renderItems() {
	const allItems = todoItemsApi.getAllItems();
	const orderedList = document.getElementById("orderedList");
	const listItems = allItems.map((todoItem, i) => {
		const item = document.createElement("li");
		const span = document.createElement("span");
		const itemText = document.createTextNode(todoItem);
		span.appendChild(itemText);
		item.appendChild(span);

		/* ----- DELETE BTN ----- */
		let deleteBtn = document.createElement("button");
		const deleteBtnText = document.createTextNode("Delete");
		deleteBtn.appendChild(deleteBtnText);
		deleteBtn.setAttribute("type", "button");
		deleteBtn.classList.add("delete");
		deleteBtn.addEventListener("click", function (event) {
			todoItemsApi.deleteItem(i);
			renderItems();
		});

		/* ----- EDIT BTN ----- */
		let editingBtn = false;
		let editBtn = document.createElement("button");
		const editBtnText = document.createTextNode("Edit");
		editBtn.appendChild(editBtnText);
		//* using innertext replaced the set btn element
		/* setting btn attributes */

		editBtn.setAttribute("type", "button");
		editBtn.classList.add(`edit__${i}`);

		editBtn.addEventListener("click", function (event) {
			const clickedBtn = event.target;

			editingBtn = !editingBtn;
			clickedBtn.textContent = editingBtn ? "Save" : "Edit";

			if (editingBtn) {
				const parentListItem = clickedBtn.closest("li");
				// Get the current text content of the parent li element
				const currentText = parentListItem.textContent
					.replace(/(?:Delete|Editing|Save)/g, "")
					.trim();

				// Create an input element
				const inputField = document.createElement("input");
				inputField.setAttribute("type", "text");
				inputField.setAttribute("name", "item");
				inputField.value = currentText;
				parentListItem.textContent = "";
				parentListItem.appendChild(inputField);
				parentListItem.appendChild(clickedBtn);
				parentListItem.appendChild(deleteBtn);

				inputField.focus();
			} else {
				const parentListItem = clickedBtn.closest("li");
				const inputField = parentListItem.querySelector("input[type='text']");
				const newText = inputField.value.trim();
				const span = document.createElement("span");

				span.textContent = newText;
				parentListItem.replaceChild(span, inputField);
				clickedBtn.textContent = "Edit";
				todoItemsApi.updateItem(newText, i);
			}
		});

		item.appendChild(editBtn);
		item.appendChild(deleteBtn);

		return item;
	});

	orderedList.replaceChildren(...listItems);
}

function onTodoSubmit(e) {
	e.preventDefault();
	const { todo } = Object.fromEntries(new FormData(e.target));
	todoItemsApi.createItem(todo);

	renderItems();
}

window.onload = renderItems;

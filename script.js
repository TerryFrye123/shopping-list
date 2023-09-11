const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formButton = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => addItemToDOM(item));

  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
  }

  addItemToDOM(newItem);
  addItemToStorage(newItem);

  itemInput.value = '';
  checkUI();
}

function addItemToDOM(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formButton.style.backgroundColor = '#228b22';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  console.log(item);
  if (confirm('Are you sure?')) {
    item.remove();

    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(itemTextValue) {
  let itemsFromStorage = getItemsFromStorage();

  console.log(itemsFromStorage);

  itemsFromStorage = itemsFromStorage.filter((item) => item !== itemTextValue);

  console.log(itemsFromStorage);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  localStorage.removeItem('items');

  checkUI();
}

function checkUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearButton.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearButton.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formButton.style.backgroundColor = '#333';
}

function filterItems(e) {
  console.log(e);
  const filterValue = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');

  items.forEach((item) => {
    let itemText = item.firstChild.textContent.toLowerCase();
    if (itemText.includes(filterValue)) {
      console.log(item.style.display);
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearButton.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  checkUI();
}

init();

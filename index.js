'use strict';

/**
 * Stores the global state of the shopping list.
 *    name: the name of the shopping list item
 *    checked: whether the item is currently checked or not
 *    id: unique identifier (XXX: should be UUID)
 */
const STORE = {
  shoppingList: [
    { name: 'apples', checked: false, id: 0 },
    { name: 'oranges', checked: false, id: 1 },
    { name: 'milk', checked: true, id: 2 },
    { name: 'bread', checked: false, id: 3  }
  ],
  nextID: 4,
  renderChecked: true
};

/**
 * Generates a shopping list item and its associated buttons
 * @param {G} item The item for which to generate
 * @param {*} itemIndex The index of the item in the global data store
 * @param {*} template Unknown
 */
function generateItemElement(item) {
  return `
    <li class="js-item-index-element" data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

/**
 * Generate a string of HTML elements from a list of shopping list items
 * @param {Array} shoppingList A list of shopping-list items
 */
function generateShoppingListItemsString(shoppingList) {
  console.log('Generating shopping list elements');
  return shoppingList
    .map(generateItemElement)
    .join('');
}

/**
 * Renders the shopping list to the DOM.
 * 
 * Filters based on renderChecked global state.
 */
function renderShoppingList() {
  console.log('`renderShoppingList` ran');
  const itemsToRender = STORE.shoppingList
    .filter(item => (STORE.renderChecked || !item.checked));

  const shoppingListString = generateShoppingListItemsString(itemsToRender);
  $('.js-shopping-list').html(shoppingListString);
}

function addItemToShoppingList(name) {
  console.log(`Adding ${name} to shoping list`);
  // XXX: ideally `id` would be something like a GUID
  // Instead we are using an always-increasing counter
  STORE.shoppingList.push({name, id: STORE.nextID, checked: false});
  STORE.nextID += 1;
}

/**
 * Sets up event handlers for adding a new item to the shopping list.
 * Story: "A user should be able to add items to the list."
 */
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit((event) => {
    console.log('`handleNewItemSubmit` ran');
    event.preventDefault();

    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');

    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

/**
 * Determines the index of Shopping List item in the global store.
 * @param {DOMElelment} element A shopping list item
 */
function getItemIndexFromElement(element) {
  const indexString = $(element)
    .closest('.js-item-index-element')
    .attr('data-item-id');
  const id = parseInt(indexString, 10);
  return STORE.shoppingList.findIndex((item) => item.id === id);
}

/**
 * Toggle the state of a list item between checked and unchecked
 * @param {number} index The index of a list item in the global store
 */
function toggleCheckedForListItem(index) {
  console.log(`Toggling checked property for item at index ${index}`);
  STORE.shoppingList[index].checked = !STORE.shoppingList[index].checked;
}

/**
 * Sets up event handlers for checking and unchecking shopping list items.
 * Story: "A user should be able to check items on the list."
 */
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', (event) => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

/**
 * Delete a shopping list item from the global store.
 * @param {number} index The index corresponding with the item to delete.
 */
function deleteListItemAtIndex(index) {
  console.log(`Deleteing item at index ${index}`);
  STORE.shoppingList.splice(index, 1);
}

/**
 * Sets up events handlers for deleting shopping list items.
 * Story: "A user should be able to delete items from the list."
 */
function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', (event) => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItemAtIndex(itemIndex);
    renderShoppingList();
  });
}

/**
 * Toggle whether checked items should be rendered
 */
function toggleRenderChecked() {
  STORE.renderChecked = !STORE.renderChecked;
  console.log(`Set renderChecked to ${STORE.renderChecked}`);
}

/**
 * Sets up event handlers for the toggling whether to hide checked items
 * Story: "A user should be able to use a switch to toggle between displaying
 * all itmes or only those that are unchecked"
 */
function handleToggleHideChecked() {
  $('.js-shopping-list-hide-checked').click(() => {
    console.log('`handleToggleHideChecked` ran');
    toggleRenderChecked();
    renderShoppingList();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideChecked();
}

$(handleShoppingList);

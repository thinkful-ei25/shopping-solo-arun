'use strict';

/**
 * Stores the global state of the shopping list.
 *    name: the name of the shopping list item
 *    checked: whether the item is currently checked or not
 */
const STORE = [
  { name: 'apples', checked: false },
  { name: 'oranges', checked: false },
  { name: 'milk', checked: true },
  { name: 'bread', checked: false }
];

/**
 * Generates a shopping list item and its associated buttons
 * @param {G} item The item for which to generate
 * @param {*} itemIndex The index of the item in the global data store
 * @param {*} template Unknown
 */
function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
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

function generateShoppingListItemsString(shoppingList) {
  console.log('Generating shopping list elements');
  return shoppingList
    .map(generateItemElement)
    .join('');
}

/**
 * Renders the shopping list to the DOM.
 */
function renderShoppingList() {
  console.log('`renderShoppingList` ran');
  const shoppingListString = generateShoppingListItemsString(STORE);
  $('.js-shopping-list').html(shoppingListString);
}

function addItemToShoppingList(name) {
  console.log(`Adding ${name} to shoping list`);
  STORE.push({name, checked: false});
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
    .attr('data-item-index');
  return parseInt(indexString, 10);
}

/**
 * Toggle the state of a list item between checked and unchecked
 * @param {number} index The index of a list item in the global store
 */
function toggleCheckedForListItem(index) {
  console.log(`Toggling checked property for item at index ${index}`);
  STORE[index].checked = !STORE[index].checked;
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
 * Sets up events handlers for deleting shopping list items.
 * Story: "A user should be able to delete items from the list."
 */
function handleDeleteItemClicked() {
  console.log('`handleDeleteItemClicked` ran');

}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
}

$(handleShoppingList);

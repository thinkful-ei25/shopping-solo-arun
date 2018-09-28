'use strict';

/**
 * Renders the shopping list to the DOM.
 */
function renderShoppingList() {
  console.log('`renderShoppingList` ran');
}

/**
 * Sets up event handlers for adding a new item to the shopping list.
 * Story: "A user should be able to add items to the list."
 */
function handleNewItemSubmit() {
  console.log('`handleNewItemSubmit` ran');
}

/**
 * Sets up event handlers for checking and unchecking shopping list items.
 * Story: "A user should be able to check items on the list."
 */
function handleItemCheckClicked() {
  console.log('`handleItemCheckClicked` ran');
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

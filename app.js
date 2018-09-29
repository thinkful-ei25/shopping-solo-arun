'use strict';

/* global cuid, store */

// eslint-disable-next-line no-unused-vars
const app = (function () {

  /**
   * Renders the shopping list to the DOM.
   * 
   * Filters based on renderChecked global state.
   */
  function renderShoppingList() {
    const itemsToRender = store.shoppingList
      .filter(item => (store.renderChecked || !item.checked))
      .filter(item => item.name.includes(store.filterText));

    const shoppingListString = generateShoppingListItemsString(itemsToRender);
    $('.js-shopping-list').html(shoppingListString);
  }

  /**
   * Generate a string of HTML elements from a list of shopping list items
   * @param {Array} shoppingList A list of shopping-list items
   */
  function generateShoppingListItemsString(shoppingList) {
    return shoppingList
      .map(generateItemElement)
      .join('');
  }

  /**
   * Generates a shopping list item and its associated buttons
   * @param {Object} item The item for which to generate
   */
  function generateItemElement(item) {
    if (item.inEditMode) {
      return `
        <li class="js-item-index-element" data-item-id="${item.id}">
          <form class="js-item-edit-form">
            <input type="text" name="item-name" value="${item.name}" class="js-item-edit-name">
            <button type="submit">Update Item</button>
          </form>
        </li>
      `;
    }

    return `
      <li class="js-item-index-element" data-item-id="${item.id}">
        <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
        <div class="shopping-item-controls">
          <button class="shopping-item-toggle js-item-toggle">
              <span class="button-label">check</span>
          </button>
          <button class="shopping-item-edit js-item-edit">
              <span class="button-label">edit</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
              <span class="button-label">delete</span>
          </button>
        </div>
      </li>`;
  }

  /**
   * Retrieves the UID of a shopping element
   * @param {DOMElelment} element A shopping list item
   */
  function getUIDFromElement(element) {
    return $(element)
      .closest('.js-item-index-element')
      .attr('data-item-id');
  }

  /**
   * Sets up event handlers for adding a new item to the shopping list.
   * Story: "A user should be able to add items to the list."
   */
  function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit((event) => {
      event.preventDefault();

      const newItemName = $('.js-shopping-list-entry').val();
      $('.js-shopping-list-entry').val('');

      store.addShoppingItem(newItemName);
      renderShoppingList();
    });
  }

  /**
   * Sets up event handlers for checking and unchecking shopping list items.
   * Story: "A user should be able to check items on the list."
   */
  function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', (event) => {
      store.toggleShoppingItemChecked(getUIDFromElement(event.currentTarget));
      renderShoppingList();
    });
  }

  /**
   * Sets up events handlers for deleting shopping list items.
   * Story: "A user should be able to delete items from the list."
   */
  function handleDeleteItemClicked() {
    $('.js-shopping-list').on('click', '.js-item-delete', (event) => {
      store.deleteShoppingItem(getUIDFromElement(event.currentTarget));
      renderShoppingList();
    });
  }

  /**
   * Sets up event handlers for the toggling whether to hide checked items
   * Story: "A user should be able to use a switch to toggle between displaying
   * all itmes or only those that are unchecked"
   */
  function handleToggleHideChecked() {
    $('.js-shopping-list-hide-checked').change(() => {
      store.toggleRenderChecked();
      renderShoppingList();
    });
  }

  /**
   * Sets up event handlers to do with filtering items by name
   */
  function handleFilterFieldUpdates() {
    $('#js-filter-form').submit((event) => {
      event.preventDefault();

      const input = $('.js-shopping-list-name-filter').val();

      store.setFilterText(input);
      renderShoppingList();
    });
  }

  /**
   * Sets up event handlers to handle setting an item to an editable state.
   */
  function handleEditButtonClicked() {
    $('.js-shopping-list').on('click', '.js-item-edit', (event) => {

      store.toggleShoppingItemEditMode(getUIDFromElement(event.currentTarget));
      renderShoppingList();
    });
  }

  /**
   * Set up event handlers for submitting changes to an item
   */
  function handleItemEditSubmit() {
    $('.js-shopping-list').on('submit', '.js-item-edit-form', (event) => {
      event.preventDefault();

      const name = $('.js-item-edit-name').val();
      const id = getUIDFromElement(event.currentTarget);
      store
        .updateShoppingItemName(id, name)
        .toggleShoppingItemEditMode(id);
      renderShoppingList();
    });
  }

  function bindEventListeners() {
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleToggleHideChecked();
    handleFilterFieldUpdates();
    handleEditButtonClicked();
    handleItemEditSubmit();
  }
  
  return {
    render: renderShoppingList,
    bindEventListeners
  };
}());

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
  maxID: 4,
  renderChecked: true,
  textFilter: '',

  nextID() {
    const id = this.maxID;
    this.maxID += 1;
    return id;
  }
};

/**
 * Generate the html for a shopping list item in edit mode
 * @param {Object} item The shopping list item to render
 */
function generateItemElementInEditMode(item) {
  return `
    <li class="js-item-index-element" data-item-id="${item.id}">
      <form class="js-item-edit-form">
        <input type="text" name="item-name" value="${item.name}" class="js-item-edit-name">
        <button type="submit">Update Item</button>
      </form>
    </li>
  `;
}

/**
 * Generates a shopping list item and its associated buttons
 * @param {Object} item The item for which to generate
 */
function generateItemElement(item) {
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
 * Generate a string of HTML elements from a list of shopping list items
 * @param {Array} shoppingList A list of shopping-list items
 */
function generateShoppingListItemsString(shoppingList) {
  console.log('Generating shopping list elements');
  return shoppingList
    .map(item => item.inEditMode ? generateItemElementInEditMode(item) : generateItemElement(item))
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
    .filter(item => (STORE.renderChecked || !item.checked))
    .filter(item => item.name.includes(STORE.textFilter));

  const shoppingListString = generateShoppingListItemsString(itemsToRender);
  $('.js-shopping-list').html(shoppingListString);
}

function addItemToShoppingList(name) {
  console.log(`Adding ${name} to shoping list`);
  // XXX: ideally `id` would be something like a GUID
  // Instead we are using an always-increasing counter
  STORE.shoppingList.push({name, id: STORE.nextID(), checked: false});
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

/**
 * Handle updates to the filter field
 */
function onFilterFieldUpdate() {
  console.log('`onFilterFieldUpdate` ran');

  const input = $('.js-shopping-list-name-filter').val();

  console.log(`Updating filter to be "${input}"`);
  STORE.textFilter = input;
  renderShoppingList();
}

/**
 * Sets up event handlers to do with filtering items by name
 */
function handleFilterFieldUpdates() {
  $('.js-shopping-list-name-filter').change(onFilterFieldUpdate);

  // Prevent <ENTER> from creating a new (likely blank) shopping list item.
  $('.js-shopping-list-name-filter').keydown((event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onFilterFieldUpdate();
    }
  });

  $('.js-shopping-list-filter-button').click(onFilterFieldUpdate);
}

/**
 * Sets up event handlers to handle setting an item to an editable state.
 */
function handleEditButtonClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', (event) => {
    console.log('`handleEditButtonClicked` ran');

    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleEditModeForIndex(itemIndex);
    renderShoppingList();
  });
}

/**
 * Flip the edit mode of a shopping list item
 * @param {number} index Global index of item to set as editable
 */
function toggleEditModeForIndex(index) {
  const item = STORE.shoppingList[index];
  console.log(`Flipping edit mode for ${item.name} to ${!item.inEditMode}`);
  item.inEditMode = !item.inEditMode;
}

/**
 * Set up event handlers for submitting changes to an item
 */
function handleItemEditSubmit() {
  $('.js-shopping-list').on('submit', '.js-item-edit-form', (event) => {
    event.preventDefault();
    console.log('`handleItemEditSubmit` ran');

    const itemIndex = getItemIndexFromElement(event.currentTarget);
    const name = $('.js-item-edit-name').val();
    updateItemAtIndex(itemIndex, {name});
    toggleEditModeForIndex(itemIndex);
    renderShoppingList();
  });
}

/**
 * Update a shopping list item by merging (and thus overwriting) a replacement
 * shopping list item.
 * @param {number} index An index into the global shopping list store
 * @param {Object} item A shopping list item to merge into the original
 */
function updateItemAtIndex(index, item) {
  Object.assign(STORE.shoppingList[index], item);
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideChecked();
  handleFilterFieldUpdates();
  handleEditButtonClicked();
  handleItemEditSubmit();
}

$(handleShoppingList);

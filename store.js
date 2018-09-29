'use strict';

/* global cuid */

// eslint-disable-next-line no-unused-vars
const store = (function() {
  const Item = {
    validateName(name) {
      if (!name) {
        throw new TypeError('Name does not exist');
      }
    },

    init(name, checked = false) {
      this.validateName(name);
      this.id = cuid();
      this.name = name;
      this.checked = checked;
      return this;
    }
  };

  const Store = {
    shoppingList: [],
    renderChecked: true,
    filterText: '',

    shoppingItemFromUID(uid) {
      const item = this.shoppingList.find(item => item.id === uid);
      if (!item) {
        throw new RangeError(`Could not find shopping list item with uid: ${uid}`);
      }

      return item;
    },

    addShoppingItem(name) {
      const item = Object.create(Item);
      item.init(name);
      this.shoppingList.push(item);
      return this;
    },

    updateShoppingItemName(uid, name) {
      const item = this.shoppingItemFromUID(uid);
      item.validateName(name);
      item.name = name;
      return this;
    },

    toggleShoppingItemChecked(uid) {
      const item = this.shoppingItemFromUID(uid);
      item.checked = !item.checked;
      return this;
    },

    toggleShoppingItemEditMode(uid) {
      const item = this.shoppingItemFromUID(uid);
      item.inEditMode = !item.inEditMode;
      return this;
    },

    deleteShoppingItem(uid) {
      const index = this.shoppingList.findIndex(item => item.id === uid);
      if (index < 0) {
        throw new RangeError(`Could not find shopping list item with uid: ${uid}`);
      }

      this.shoppingList.splice(index, 1);
      return this;
    },

    toggleRenderChecked() {
      this.renderChecked = !this.renderChecked;
      return this;
    },

    setFilterText(text) {
      this.filterText = text;
    }
  };

  return Store;
})();

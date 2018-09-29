'use strict';

/* global store, app */

function main() {
  const itemNames = ['', 'apples', 'pears'];
  itemNames.forEach((name) => {
    try {
      store.addShoppingItem(name);
    } catch (error) {
      console.error(`Cannot add item ${error.message}`);
    }
  });

  app.render();
  app.bindEventListeners();
}

$(main);

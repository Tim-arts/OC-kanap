/* Utilities */

/**
 * Check the presence of the "cart" key in the storage room from the function localStorageKey
 * @returns {Array.<Object>|Array} - Return array of object or an empty array 
 */
export function getFromLocalStorage () {
    return localStorageHasKey() ? JSON.parse(localStorage.getItem('cart')) : [];
}

/**
 * Check the presence of the "cart" key in the storage room.
 * @returns {Boolean}
 */
export function localStorageHasKey() {
    return !!localStorage.getItem('cart');
}

/**
 * Save data in local Storage
 * @param {Object} products - New object to add in local storage 
 */
export function saveToLocalStorage(products) {
    localStorage.setItem('cart', JSON.stringify(products));
}
import {getFromLocalStorage,localStorageHasKey,saveToLocalStorage} from "./storage.js"

const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');
const positionImg = document.querySelector(".item__img");
const titleProduct = document.getElementById("title");
const titlePageProduct = document.querySelector("html head title")
const priceProduct = document.getElementById("price");
const colorChoice = document.getElementById("colors");
const descriptionProduct = document.getElementById("description");
const submitButton =  document.getElementById("addToCart");
const quantityOfProduct = document.getElementById("quantity");

let product, isQuantityValid = true, isColorValid;

/** Function calling itself */
(function init() {
    createProduct();
    
    // Calculate and show the price of the quantity of the product(1-100)
    quantityOfProduct.addEventListener("change",function() {
        const value = Number(quantityOfProduct.value);
        
        if(value > 0 && value < 101) {
            isQuantityValid = true;
            enableButton();
        } else {
            quantityOfProduct.value = 1;
            alert('Merci de choisir une quantité comprise entre 1 et 100');
        }
    });
    
    // Confirms the color selection
    colorChoice.addEventListener("change", function(event) {
        if (colorChoice.value) {
            isColorValid = true;
            enableButton();
        } else {
            alert('Veuillez choisir une couleur valide de canapé');
        }
    });
    
    // Save data (id,quantity and color) in local Storage
    submitButton.addEventListener("click",function() {
        const object = {
            id: product._id,
            quantity: Number(quantityOfProduct.value),
            color: colorChoice.value,
        };
    
        processLocalStorage(object);
    });
})();

/** Create description of product */
async function createProduct() {
    product = await fetch(`http://localhost:3000/api/products/${id}`)
        .then((response) => response.json())
        .then((data) => { return data; });
    
    const createImg = `<img src="${product.imageUrl}" alt="${product.altTxt}" />`;
    
    titleProduct.innerHTML = `${product.name}`;
    titlePageProduct.innerHTML = `${product.name}`;
    positionImg.insertAdjacentHTML("beforeend", createImg);
    descriptionProduct.innerHTML = `${product.description}`;
    priceProduct.innerHTML = `${product.price}`;
    
    // Fill select with product colors
    for (let color of product.colors) {
        const createColorsChoice = `<option value="${color}">${color}</option>`; 
        colorChoice.insertAdjacentHTML("beforeend", createColorsChoice);
        
    }
}

/**
 * Add the product if it is not present in the local storage otherwise add the quantity of the product
 * @param {Object} object - Object that comes from the product page
 */
function processLocalStorage(object) {
    const products = getFromLocalStorage();
    // returns an object if the criteria are in the list.(else return undefined) 
    const product = products.find(product => product.id === object.id && product.color === object.color);
    
    if (product) {
        product.quantity = product.quantity + object.quantity;
        
        if (product.quantity > 100) {
            product.quantity = 100;
            alert('La quantité totale de cet article dépasse 100. Les articles en trop seront ignorés');
        }
    } else {
        products.push(object);
    }
    
    saveToLocalStorage(products);
}

/** Enable button */
function enableButton() {
    if (isQuantityValid && isColorValid) {
        submitButton.disabled = false;
    }
}


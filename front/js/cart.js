import { getFromLocalStorage,saveToLocalStorage } from "./storage.js";

const cartItems = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const inputFirstName = document.getElementById("firstName");
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const inputLastName = document.getElementById("lastName");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const inputAddress = document.getElementById("address");
const adressErrorMsg = document.getElementById("addressErrorMsg");
const inputCity = document.getElementById("city");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const inputEmail = document.getElementById("email");
const emailErrorMsg = document.getElementById("emailErrorMsg");
const order = document.getElementById("order");
const cart = getFromLocalStorage();
let products = [], nameValid, emailValid, addressValid, cityValid, quantityValid;

/** Function calling itself */
(async function init() {
    quantityIsPresent();
    await createArticles();

    getTotalProducts();
    getTotalPrice();

    const inputsQuantity = document.querySelectorAll('.itemQuantity');
    const inputsDeleteItem = document.querySelectorAll('.deleteItem');

    // Change quantity of product in the cart
    inputsQuantity.forEach(input => {
        input.addEventListener("change", function() {
            const article = input.closest("article");
            const itemId = article.dataset.id;
            const itemColor = article.dataset.color;
            let quantity = Number(input.value);

            input.value = changeQuantity(itemId,itemColor,quantity);

            getTotalProducts();
            getTotalPrice();
        });
    });

    inputsDeleteItem.forEach(input => {
        input.addEventListener("click", function() {
            const article = input.closest("article");

            removeItem(article);

            getTotalProducts();
            getTotalPrice();
        });
    });
    
    inputFirstName.addEventListener("input", function() {
        valid(this,firstNameErrorMsg); 
    });

    inputLastName.addEventListener("input", function() {
        valid(this,lastNameErrorMsg);
    })

    inputAddress.addEventListener("input", function() {
        valid(this,adressErrorMsg);
    })

    inputCity.addEventListener("input", function() {
        valid(this,cityErrorMsg);
    })

    inputEmail.addEventListener("input", function() {
        valid(this,emailErrorMsg);

    })
    
    order.addEventListener("click", (event) => {
        event.preventDefault();
        
        if (nameValid && addressValid && cityValid && emailValid && quantityValid) {
            validOrder();
        }else {
            alert("Attention, merci de bien remplir le formulaire ou de vérifier le nombre d'articles dans le panier.");
        }
    });
})();

/** Create the product items for the user to add */
async function createArticles() {
  
    await getObjectFromApi();

    cart.forEach((object, i) =>  {
        const cardProduct = `
            <article class="cart__item" data-id="${object.id}" data-color="${object.color}">
                <div class="cart__item__img">
                    <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${products[i].name}</h2>
                        <p>${object.color}</p>
                        <p>${products[i].price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${object.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>
        `;

        cartItems.insertAdjacentHTML("beforeend",cardProduct);
    });
}

/** Create array of object from api */
async function getObjectFromApi() {
    // On crée une variable contenant tous les ids stockés dans le localStorage
    const ids = cart.map(x => x.id);
    
    // Ici on requête l'API plusieurs fois afin de récupérer plusieurs données
    // La promesse renvoie les valeurs correspondantes aux requêtes qui ont été envoyées et qui récupèrent les données
    // en fonction de ce qui est stocké dans le localStorage
    products = await Promise.all(
        ids.map(id => fetch(`http://localhost:3000/api/products/${id}`).then(response => response.json()))
    );
}

/** Sum total of product*/
function getTotalProducts() {
    let number = 0;

    for(let product of cart){
        number += product.quantity;
    }

    totalQuantity.innerHTML = `${number}`;
}

/** Sum total of price */
function getTotalPrice() {
    let price = 0;

    cart.forEach((object, index) => {
        price += object.quantity * products[index].price;
    });

    totalPrice.innerHTML = `${price}`;
}

/**
 * Change quantity of the product
 * @param {String} id  - The id of the chosen product
 * @param {String} color - The color of the chosen product
 * @param {Number} quantity - The quantity of the product changed
 * @returns {Number} - Returns the quantity of the corresponding product
 */
function changeQuantity(id,color,quantity) {
    let foundObject = cart.find(product => product.id === id && product.color === color);
    
    foundObject.quantity =  quantity;

    if (foundObject.quantity > 100) {
        foundObject.quantity = 100;
        alert('La quantité totale de cet article dépasse 100. Les articles en trop seront ignorés');
        saveToLocalStorage(cart);
        return 100;
    } else if (foundObject.quantity < 1) {
        foundObject.quantity = 1;
        alert("La quantité totale de cet article est négative. Le nombre s'élève à 1.");
        saveToLocalStorage(cart);
        return 1;
    }
    else {
        saveToLocalStorage(cart);
        return quantity; 
    }
}

/** Remove item*/
function removeItem(article) {
    const itemId = article.dataset.id;
    const itemColor = article.dataset.color;

    const index = cart.findIndex(item => item.id === itemId && item.color === itemColor);
    
    // On synchronise les tableaux afin d'éviter les erreurs
    cart.splice(index, 1);
    products.splice(index, 1);

    article.remove();
    quantityIsPresent()

    saveToLocalStorage(cart);
}

/**
 * User data verification system 
 * @param {Object} input - The value entered by the user
 * @param {Object} errorMsg - The position of the error in the form
 */
function valid(input,errorMsg) {
    const name = /^[A-Za-zçéï]+$/g;
    const address = /^[\w\. é']+$/g;
    const city  = /^[A-Za-z\- ]+$/g;
    const email = /^[\w\.]+@{1}[a-z]+[.]{1}[a-z]{2,3}$/g;
    
    if ( input === inputFirstName ||input === inputLastName) {
        if (!name.test(input.value)) {
            errorMsg.innerHTML = "Le nom doit comporter seulement des lettres.";
            nameValid = false;
        } else {
            errorMsg.innerHTML = "";
            nameValid = true;
        }

    } else if (input === inputAddress) {
        if(!address.test(input.value)) {
            errorMsg.innerHTML = "L'adresse est incorrecte";
            addressValid = false;
        } else {
            errorMsg.innerHTML = "";
            addressValid = true;
        }

    } else if (input === inputCity) {
        if(!city.test(input.value)) {
            errorMsg.innerHTML = "Le nom de la ville est incorrecte";
            cityValid = false;
        } else {
            errorMsg.innerHTML = "";
            cityValid = true;
        }

    } else {
        if(!email.test(input.value)) {
            errorMsg.innerHTML = "L'email est incorrecte ";
            emailValid = false;
        } else {
            errorMsg.innerHTML = "";
            emailValid = true;
        }
    }
}

function quantityIsPresent (){
    if (cart.length === 0) {
        quantityValid = false;
    }else {
        quantityValid = true;
    }
}

/** Sending from data  */
function validOrder() {
    const body = {
        contact: {
            firstName: inputFirstName.value,
            lastName: inputLastName.value,
            address: inputAddress.value,
            city: inputCity.value,
            email: inputEmail.value
        },
        products: products.map(product => product._id)
    };

    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    })
        .then(res => res.json())
        .then(data => {
            window.location.href = "confirmation.html?orderId=" + data.orderId;
            localStorage.clear();
        });
}


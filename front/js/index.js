const container = document.querySelector("#items");

/**
 * Create card product 
 * @param {Object} data - Object from api
 */
const createCards = (data) =>{
  for(let dataApi of data){
    const cardProduct = `
      <a href="./product.html?id=${dataApi._id}">
          <article>
            <img src="${dataApi.imageUrl}" alt="${dataApi.altTxt}">
            <h3 class="productName">${dataApi.name}</h3>
            <p class="productDescription">${dataApi.description}</p>
          </article>
      </a> 
    `;
    container.insertAdjacentHTML("beforeend",cardProduct); 
  }
};

fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((data) => createCards(data));
  

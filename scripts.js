const addToCartBtn = document.querySelectorAll('.add-to-cart');
const deincrementBtn = document.querySelectorAll('.deincrement');
const decrementBtn = document.querySelectorAll('.decrement');
const incrementBtn = document.querySelectorAll('.increment');
const deincrementQty = document.querySelectorAll('.deincrement-quantity');
const cartQty = document.getElementById('cart-quantity');
const product = document.getElementById('products');
const productQty = document.getElementById('second-row');
const emptyCart = document.getElementById('empty-cart');
const insertImg = document.querySelectorAll('.img-placeholder');
const insertDescription = document.querySelectorAll('.description');

document.addEventListener("DOMContentLoaded", () => {
  getData();
})

async function getData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error("Oops! Something went wrong");
    }

    const data = await response.json();
    populateDOM(data);
  } catch (error) {
    console.error(`Fetch error:`, error.message);
  }
}

function populateDOM(data) {
  data.forEach((item, index) => {
    appendItem(item, index);
  })
}

let insertedImages = [];
let getProduct = [];

function appendItem(item, index) {
  const { thumbnail, mobile, tablet, desktop } = item.image;
  const { name, category, price } = item;
  getProduct[index] = item;

  const imgElement = document.createElement('img');
  const categoryElement = document.createElement('p');
  const nameElement = document.createElement('p');
  const priceElement = document.createElement('p');

  imgElement.src = mobile;
  categoryElement.textContent = category;
  nameElement.textContent = name;
  priceElement.textContent = `$${(price.toFixed(2))}`;

  if (insertImg[index]) {
    insertImg[index].replaceChildren(imgElement);
    insertedImages[index] = imgElement;
  }
  if (insertDescription[index]) {
    insertDescription[index].replaceChildren(categoryElement, nameElement, priceElement);
  }
}

function removeStyles(idx) {
  addToCartBtn[idx].style.display = 'flex';
  deincrementBtn[idx].style.display = 'none';
  insertedImages[idx].classList.remove('active');
}

function addStyles(idx) {
  addToCartBtn[idx].style.display = 'none';
  deincrementBtn[idx].style.display = 'flex';
  insertedImages[idx].classList.add('active');
}

let getQuantity;

function updateQuantity(idx, delta) {
  const quantity = deincrementQty[idx];
  let value = parseInt(quantity.textContent, 10) || 0;
  const newValue = value + delta;

  quantity.textContent = newValue;
  getQuantity = newValue;

  if (newValue <= 0) {
    removeStyles(idx);
  }
}

function updateCartQty(delta) {
  const quantity = cartQty;
  let value = parseInt(quantity.textContent, 10) || 0;
  const newValue = value + delta;
  cartQty.textContent = newValue;

  if (newValue === 0) {
    emptyCart.style.display = 'flex';
  } else {
    emptyCart.style.display = 'none';
  }
}

function updateCartProduct(index) {
  let getData = getProduct[index];
  const { name, price } = getData;
  const productName = document.createElement('p');
  const productPrice = document.createElement('p');
  const productQuantity = document.createElement('p');

  productName.textContent = name;
  productPrice.textContent = `$${(price.toFixed(2))}`;
  productQuantity.textContent = getQuantity;

  product.append(productName, productPrice);
  productQty.replaceChildren(productQuantity);
  console.log(getQuantity);
}


addToCartBtn.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    addStyles(idx);
    updateQuantity(idx, 1);
    updateCartQty(1);
    updateCartProduct(idx);
  })
})


incrementBtn.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    updateQuantity(idx, 1);
    updateCartQty(1);
  })
})

decrementBtn.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    updateQuantity(idx, -1);
    updateCartQty(-1);
  })
})
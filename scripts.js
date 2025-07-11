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
const orderConfirmation = document.getElementById('order-confirmed');
const cardProducts = document.querySelectorAll('.card');
const cartCounter = document.getElementById('cart-counter');
const productsConfirmed = document.getElementById('products-confirmed');
const productsDescription = document.getElementById('products-description');

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
  const deincrementQuantity = deincrementQty[idx];
  let value = parseInt(deincrementQuantity.textContent, 10) || 0;
  const newValue = value + delta;

  deincrementQuantity.textContent = newValue;
  getQuantity = newValue;

  if (newValue <= 0) {
    removeStyles(idx);
  }
}

function checker() {
  const prevOrderTotal = product.querySelector('.order-total-container');
  const carbonChecker = product.querySelector('.carbon-neutral');
  const confirmOrderBtn = product.querySelector('.confirm-order');
  const startNewOrderBtn = productsConfirmed.querySelector('.start-new-order');
  if (prevOrderTotal) {
    prevOrderTotal.remove();
  }
  if (carbonChecker) {
    carbonChecker.remove();
  }
  if (confirmOrderBtn) {
    confirmOrderBtn.remove();
  }
  if (startNewOrderBtn) {
    startNewOrderBtn.remove();
  }
}

function orderConfirmStyles() {
  cartCounter.style.display = 'none';
  product.style.display = 'none';
  orderConfirmation.style.display = 'flex';
  cardProducts.forEach((card) => {
    card.style.display = 'none';
  })
}

function startNewOrderStyles() {
  cartCounter.style.display = 'block';
  product.style.display = 'flex';
  orderConfirmation.style.display = 'none';
  cardProducts.forEach((card) => {
    card.style.display = 'block';
  })
  Object.keys(cartItems).forEach(key => {
    if (cartItems[key] && cartItems[key].elements && cartItems[key].elements.row) {
      cartItems[key].elements.row.remove();
    }
  });

  // Clear cartItems object
  cartItems = {};
}

function orderConfirm() {
  checker();
  orderConfirmStyles();

  Object.keys(cartItems).forEach(key => {
    const item = cartItems[key];

    const orderContainer = document.createElement('div');
    const orderConfirmContainer = document.createElement('div');
    const productDescription = document.createElement('div');
    const productImg = document.createElement('img');
    const productName = document.createElement('p');
    const productQty = document.createElement('p');
    const productPrice = document.createElement('p');
    const productPriceTotal = document.createElement('p');

    orderContainer.classList.add('order-container');
    productDescription.classList.add('order-quantity-price');
    orderConfirmContainer.classList.add('order-confirm-container');
    productsDescription.classList.add('product-description');

    productImg.src = item.image?.mobile || item.image; // fallback if .mobile doesn't exist
    productName.textContent = item.name;
    productQty.textContent = `${item.quantity}x`;
    productPrice.textContent = `@ $${item.price.toFixed(2)}`;
    productPriceTotal.textContent = `$${(item.quantity * item.price).toFixed(2)}`;

    orderContainer.append(
      productName,
      productDescription
    );

    productDescription.append(
      productQty,
      productPrice,
      productPriceTotal
    );

    orderConfirmContainer.append(
      productImg,
      orderContainer
    );

    productsDescription.append(orderConfirmContainer);
  });

  const orderTotalContainer = document.createElement('div');
  const btnElement = document.createElement('button');
  const orderTotal = document.createElement('p');
  const orderString = document.createElement('p');
  orderTotalContainer.classList.add('order-total-price-container');
  btnElement.classList.add('start-new-order');
  btnElement.textContent = 'Start New Order';

  orderString.textContent = 'Order Total';
  orderTotal.textContent = `$${orderTotalValue.toFixed(2)}`;

  orderTotalContainer.append(orderString, orderTotal);
  productsDescription.append(orderTotalContainer);
  productsConfirmed.append(btnElement);

  btnElement.addEventListener('click', () => {
    startNewOrderStyles();
  })
}

let newValue;

function updateCartQty(delta) {
  const quantity = cartQty;
  let value = parseInt(quantity.textContent, 10) || 0;
  newValue = value + delta;
  cartQty.textContent = newValue;

  if (newValue === 0) {
    emptyCart.style.display = 'flex';
    checker();
  } else {
    emptyCart.style.display = 'none';
  }
}

let orderTotalValue;

function updateOrderTotal() {
  let total = 0;
  for (const key in cartItems) {
    if (cartItems.hasOwnProperty(key)) {
      total += cartItems[key].quantity * cartItems[key].price;
      orderTotalValue = total;
    }
  }

  // Remove any previous order total container
  checker();

  if (newValue === 0) {
    return;
  }

  // Create and append new order total container
  const orderTotalContainer = document.createElement('div');
  const order = document.createElement('p');
  const orderTotal = document.createElement('p');
  orderTotalContainer.classList.add('order-total-container');
  order.textContent = 'Order Total';
  orderTotal.textContent = `$${total.toFixed(2)}`;
  orderTotalContainer.append(order, orderTotal);

  const carbonNeutral = document.createElement('div');
  const carbonInnerText = document.createElement('p');
  const carbonImg = document.createElement('img');
  carbonNeutral.classList.add('carbon-neutral');
  carbonImg.src = './assets/images/icon-carbon-neutral.svg';
  carbonInnerText.innerHTML = `This is a <span>carbon-neutral</span> delivery`;
  carbonNeutral.append(carbonImg, carbonInnerText);

  const confirmOrderElement = document.createElement('button');
  confirmOrderElement.classList.add('confirm-order');
  confirmOrderElement.textContent = 'Confirm Order';

  confirmOrderElement.addEventListener('click', () => {
    orderConfirm();
  })

  product.append(orderTotalContainer, carbonNeutral, confirmOrderElement);
}

let cartItems = {};

function updateCartProduct(index, delta) {
  const { name, price, image } = getProduct[index];

  if (cartItems[index]) {
    cartItems[index].quantity += delta;
    cartItems[index].priceMultiplied.textContent = `$${(cartItems[index].quantity * cartItems[index].price).toFixed(2)}`;
    cartItems[index].elements.quantity.textContent = `${cartItems[index].quantity}x`;
  } else {
    const productRow = document.createElement('div');
    const innerDiv = document.createElement('div');
    const innerDivDiv = document.createElement('div');
    const productName = document.createElement('p');
    const productQuantity = document.createElement('p');
    const productPrice = document.createElement('p');
    const productPriceMultiplied = document.createElement('p');
    const productBtn = document.createElement('button');

    productBtn.classList.add('remove-product-btn');
    productRow.classList.add('inner-div')
    innerDiv.classList.add('inner');
    innerDivDiv.classList.add('inner-divdiv');

    productBtn.addEventListener('click', () => {
      const removedQty = cartItems[index].quantity; // ✅ store value before delete
      cartItems[index].elements.row.remove();       // remove DOM element
      delete cartItems[index];                      // delete item from cart
      updateCartQty(-removedQty);                 // update total quantity
      removeStyles(index);
      deincrementQty[index].textContent = 0;
    })

    const btnImg = document.createElement('img');
    btnImg.src = './assets/images/icon-remove-item.svg';
    productBtn.appendChild(btnImg);

    productName.textContent = name;
    productPrice.textContent = `@ $${price.toFixed(2)}`;
    productQuantity.textContent = `${1}x`;
    productPriceMultiplied.textContent = `$${price.toFixed(2)}`;

    productRow.appendChild(innerDivDiv);
    innerDiv.append(productRow)

    productRow.append(productName, innerDivDiv);
    innerDivDiv.append(productQuantity, productPrice, productPriceMultiplied, productBtn);
    product.append(innerDiv);

    cartItems[index] = {
      image,
      name,
      price,
      quantity: 1,
      priceMultiplied: productPriceMultiplied,
      elements: {
        row: innerDiv,
        quantity: productQuantity,
      },
    };
  }

  if (cartItems[index].quantity <= 0) {
    removeStyles(index);
    if (cartItems[index]) {
      cartItems[index].elements.row.remove();
      delete cartItems[index];
    }
  }

  updateOrderTotal();
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
    updateCartProduct(idx, 1);
  })
})

decrementBtn.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    updateQuantity(idx, -1);
    updateCartQty(-1);
    updateCartProduct(idx, -1);
  })
})
const addToCartBtn = document.querySelectorAll('.add-to-cart');
const deincrementBtn = document.querySelectorAll('.deincrement');
const decrementBtn = document.querySelectorAll('.decrement');
const incrementBtn = document.querySelectorAll('.increment');
const deincrementQty = document.querySelectorAll('.deincrement-quantity');
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

function appendItem(item, index) {
  const { thumbnail, mobile, tablet, desktop } = item.image;
  const { name, category, price } = item;

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

addToCartBtn.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    addStyles(idx);

    const quantity = deincrementQty[idx];
    let value = parseInt(quantity.textContent, 10);
    quantity.textContent = value + 1
  })
})


incrementBtn.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const quantity = deincrementQty[idx];
    let value = parseInt(quantity.textContent, 10);
    quantity.textContent = value + 1;
  })
})

decrementBtn.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const quantity = deincrementQty[idx];
    let value = parseInt(quantity.textContent, 10);
    quantity.textContent = value - 1;

    if (value === 1) {
      removeStyles(idx);
    }
  })
})

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
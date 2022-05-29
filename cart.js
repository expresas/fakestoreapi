"use strict";
const cartPage = document.querySelector('.cartPage');
let cartItems = [];
if (localStorage.getItem('cartItems')) {
    cartItems = JSON.parse(localStorage.getItem('cartItems') || '');
}
// render cart
function renderCartItems(array) {
    if (cartItems.length === 0)
        return cartPage.innerHTML = '<div class="center fs-xxl">Your shopping cart is empty!</div>';
    cartPage.innerHTML = '<div class="center fs-xxl">Your shopping cart</div>';
    let totalPrice = 0;
    array.forEach((item, index) => {
        totalPrice += item.quantity * item.price;
        cartPage.innerHTML += `
      <div class="cartProduct">
        <div class="cp_image"><img src="${item.image}" alt=""></div>
        <div class="cp_quantity">Quantity: ${item.quantity}</div>
        <div class="cp_price">Price: ${item.price}</div>
        <div class="cp_total">Total: ${(item.quantity * item.price).toFixed(2)} €</div>
        <div class="cp_buttons">
          <button class="plus" id="${item.id}">+1</button>
          <button class="minus" id="${item.id}">-1</button>
        </div>
      </div>`;
        // add total price element at the end of template
        if (index === array.length - 1) {
            cartPage.innerHTML += `<div class="cp_all_total">Total: ${totalPrice.toFixed(2)} €</div>`;
        }
    });
    initialiseButtons();
}
renderCartItems(cartItems);
// select +- buttons and add events
function initialiseButtons() {
    const buttonsPlus = document.querySelectorAll('.plus');
    const buttonsMinus = document.querySelectorAll('.minus');
    buttonsPlus.forEach((button) => button.addEventListener('click', quantityPlusOne));
    buttonsMinus.forEach((button) => button.addEventListener('click', quantityMinusOne));
}
// increase item quantity
function quantityPlusOne(event) {
    let index = cartItems.findIndex((element) => element.id === Number(event.target.id));
    cartItems[index].quantity++;
    renderCartItems(cartItems);
    updateLocalStorage();
}
// decrease item quantity and remove from cart if quantity is 0
function quantityMinusOne(event) {
    let index = cartItems.findIndex((element) => element.id === Number(event.target.id));
    if (cartItems[index].quantity === 1) {
        cartItems.splice(index, 1);
    }
    else {
        cartItems[index].quantity--;
    }
    renderCartItems(cartItems);
    updateLocalStorage();
}
// update LocalStorage after event
function updateLocalStorage() {
    if (cartItems.length > 0) {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    else {
        localStorage.removeItem('cartItems');
    }
}

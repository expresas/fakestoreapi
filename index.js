"use strict";
const products = document.querySelector('.products');
const productCart = document.querySelector('.cart');
let storeItems = [];
let init = true;
// fetch data from API
async function getData() {
    const res = await fetch('https://fakestoreapi.com/products');
    const data = await res.json();
    return data;
}
// render products on page
async function renderStoreItems() {
    products.innerHTML = `<div class="center"><img src="./images/loading.gif" alt=""></div>`;
    storeItems = await getData();
    products.innerHTML = ``;
    storeItems.map((item) => {
        item.quantity = 0;
        products.innerHTML += `
    <div class="product">
    <div class="p_title">${item.title}</div>
    <div class="p_category">${item.category}</div>
    <div class="p_image"><img src="${item.image}" alt=""></div>
    <div class="p_price">Price: ${item.price} €</div>
    <button class="addButton" id="${item.id}">Add to cart</button>
    <div class="p_description"><strong>Info:</strong> ${item.description}</div>
    </div>`;
    });
    // add events to buttons
    const addButtons = document.querySelectorAll('.addButton');
    addButtons.forEach(button => button.addEventListener('click', addToCart));
    // update cart only on first load
    if (init)
        updateCartFromLocalStorage();
}
renderStoreItems();
// update cart if items were previously added to cart
function updateCartFromLocalStorage() {
    if (localStorage.getItem('cartItems')) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '');
        cartItems.forEach((item) => {
            let index = storeItems.findIndex((element) => element.id === item.id);
            storeItems[index].quantity = item.quantity;
        });
        showCartQuantityAndPrice();
    }
    init = false;
}
// item added to cart
function addToCart(event) {
    let index = storeItems.findIndex((element) => element.id === Number(event.target.id));
    storeItems[index].quantity++;
    showCartQuantityAndPrice();
    putIntoLocalStorage();
}
// update cart info, update quantity
function showCartQuantityAndPrice() {
    let cartQuantity = 0;
    let cartTotalPrice = 0;
    storeItems.map((product) => {
        cartQuantity += product.quantity;
        cartTotalPrice += product.quantity * product.price;
    });
    productCart.innerHTML = `<a href="./cart.html" target="_self">Shopping cart: ${cartQuantity}</a> (${cartTotalPrice.toFixed(2)} €)`;
}
// write cart items into LocalStorage
function putIntoLocalStorage() {
    const cartItems = [];
    storeItems.map((item) => {
        if (item.quantity > 0)
            cartItems.push(item);
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}


let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

// opening cart          
cartIcon.onclick = () =>{
    cart.classList.add("active");
}; 
// closing cart            
closeCart.onclick = () =>{
    cart.classList.remove("active");
}; 

// making add to cart , working js 
if(document.readyState == "loading"){           
    document.addEventListener("DOMContentLoaded", ready);
}
else{                                
    ready();
}

function ready(){           
    // remove items from cart by clicking on bin icon        
    var removeCartButtons = document.getElementsByClassName("cart-remove");
    for (var i = 0; i < removeCartButtons.length; i++) {
        var buttons = removeCartButtons[i];
        buttons.addEventListener("click", removeCartItem);
    }

    // changing the quantity        
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    // Adding items to cart
    var addToCart = document.getElementsByClassName("add-cart");
    for (var i = 0; i < addToCart.length; i++) {
        var cartItems = addToCart[i];
        cartItems.addEventListener("click", addCartClicked);
    }
    loadCartItems();
}

function removeCartItem(event){  
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();

    updateTotal();
    saveCartItems();
}

function quantityChanged(event){            
    var input = event.target;
    if(isNaN(input.value) || input.value <=0){
        input.value = 1;
    }

    updateTotal();
    saveCartItems();
    updateCartIcon();
}

function addCartClicked(event){
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    addProductsToCart(title, price, productImg);
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

function addProductsToCart(title, price, productImg){
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add('cart-box');
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for(var i =0; i< cartItemsNames.length; i++){
        if(cartItemsNames[i].innerText == title){
            alert("Item already added to cart");
            return;
        }
    }
    var cartBoxContent = `<img src= "${productImg}" alt="" class="cart-img">
    <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input type="number" name="" id="" value="1" class="cart-quantity">
    </div>
    <!-- removing item from cart-->
    <i class='bx bx-trash-alt cart-remove'></i>`;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox.getElementsByClassName('cart-remove')[0]
    .addEventListener('click', removeCartItem);
    cartShopBox.getElementsByClassName('cart-quantity')[0]
    .addEventListener('change', quantityChanged);
    saveCartItems();
    updateCartIcon(); 


} 

function updateTotal(){
    var cartcontent = document.getElementsByClassName("cart-content")[0];
    var cartBox = cartcontent.getElementsByClassName("cart-box");
    var total =0 ;
    for(var i= 0; i<cartBox.length; i++) {
        var box = cartBox[i];
        var priceOfElement = box.getElementsByClassName("cart-price")[0];
        var quantityOfElement = box.getElementsByClassName("cart-quantity")[0];
        var price = parseFloat(priceOfElement.innerText.replace("$",""));
        var quantity = quantityOfElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total*100)/100;
    document.getElementsByClassName("total-price")[0].innerText = "$" + total;
    localStorage.setItem("cartTotal", total); 
}

function saveCartItems(){
    var cartContent =document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var cartItems =[];

    for(var i = 0; i<cartBoxes.length; i++){
        var cartbox = cartBoxes[i];
        var titleElement = cartbox.getElementsByClassName('cart-product-title')[0];
        var priceElement = cartbox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartbox.getElementsByClassName('cart-quantity')[0];
        var productimg = cartbox.getElementsByClassName('cart-img')[0].src;

        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productimg,
        };
        cartItems.push(item); 
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function loadCartItems(){
    var cartItems = localStorage.getItem("cartItems");
    if(cartItems){
        cartItems = JSON.parse(cartItems);

        for(var i =0; i<cartItems.length; i++){
            var item = cartItems[i];
            addProductsToCart(item.title, item.price, item.productImg);

            var cartBoxes = document.getElementsByClassName('cart-box');
            var cartBox = cartBoxes[cartBoxes.length-1];
            var quantityElement= cartBox.getElementsByClassName('cart-quantity')[0];
            quantityElement.value = item.quantity;
        }
    }
    var cartTotal = localStorage.getItem('cartTotal');
    if(cartTotal){
        document.getElementsByClassName('total-price')[0].innerText = "$" + cartTotal;
    }
    updateCartIcon();
}

function updateCartIcon(){
    var cartBoxes = document.getElementsByClassName('cart-box');
    var quantity = 0;

    for(var i=0; i< cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        quantity = quantity + parseInt(quantityElement.value);
    }

    var cartIcon = document.querySelector("#cart-icon");
    cartIcon.setAttribute('data-quantity', quantity);

}

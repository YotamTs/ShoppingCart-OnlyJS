/**
 *@author Yotam Tsorfi <tsorfi@gmail.com>
 *
 ***************************************************/
var shoppingCartArr = [];
//---------------------------------------------------------------------------
/** Render Items dynamically to the page. */
function renderItems() {
    var productsHTML = "";
    var shoppingCartProducts = "";
    var i = 0;

    //Hide or show Empty Cart Button:
    showEmptyCart();

    //Render all selected items
    for (i; i < shoppingCartArr.length; i++)
        shoppingCartProducts += getHtmlFormat(shoppingCartArr[i], i, true);

    //Render all stock items
    for (i = 0; i < products.length; i++)
        productsHTML += getHtmlFormat(products[i], i, false);

    //Update the Html page:
    $('#shoppingCart').html(shoppingCartProducts);
    $('#products').html(productsHTML);
}
//---------------------------------------------------------------------------
/**
 *Creating a DOM element of an item product (cart item or list item).
 *@param {obj} product - product obj from the array.
 *@param {number} index - productRef - item index in the array.
 *@param {boolean} isCartProduct - boolean tells if its an cart obj.
 */
function getHtmlFormat(product, index, isCartProduct) {

    var btn = (isCartProduct) ? '<a class="btn btn-danger btn-sm" onclick="removeItem( \'' + product.name + '\',\'' + product.ref + '\' , ' + isCartProduct + ' )" > Remove </a>' :
        '<a class="btn btn-success" onclick="addItem( \'' + product.name + '\', \'' + product.ref + '\', ' + isCartProduct + ' )" > Buy </a>';

    var thumb = (isCartProduct) ? '<div class="thumbnail-cartItem"> ' :
        '<div class="thumbnail"> ';

    return '<div class="' + product.ref + '" id="' + index + '" name="' + product.name  + '" draggable="true" ondragstart="drag_start(event,  ' + isCartProduct + ' , \'' + product.ref + '\')">' +
        '<div class="item col-xs-12 col-sm-12 col-md-12 col-lg-12"> ' +
        thumb +
        '<img class="group list-group-image img-responsive" draggable="false" id="' + index + '" name="' + product.name  + '" src="' +
        product.image_url + '"/>' +
        '<div class="caption"> ' +
        '<h5 class="group inner list-group-item-heading" id="prodName">' +
        product.name + '</h5>' +
        '<div class="row">' +
        '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">' +
        '<p class="price">' +
        product.price + '<span class="glyphicon glyphicon-usd"> </span>' + '</p>' +
        '</div>' +
        '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">' + btn +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
}
//---------------------------------------------------------------------------
/** Toggle Sort button for decreasing/increasing prices. */
var currentSortState = "asc";
function toggleSort() {
    var btnElement = $("#toggleSortButton");
    var textElm = btnElement.find("#text");
    var iconElm = btnElement.find("#icon");

    if (currentSortState === "asc") {
        sortAscProduct();
        renderItems();
        currentSortState = "desc";
        textElm.text("Price: decreasing");
        iconElm.addClass("glyphicon-sort-by-attributes-alt")
            .removeClass("glyphicon-sort-by-attributes");
    }
    else {
        currentSortState = "asc";
        sortDescProduct();
        renderItems();
        textElm.text("Price: increasing");
        iconElm.addClass("glyphicon-sort-by-attributes")
            .removeClass("glyphicon-sort-by-attributes-alt");
    }
}
//---------------------------------------------------------------------------
/** Show or hide the empty cart button*/
function showEmptyCart() {
    if (shoppingCartArr.length === 0) {
        $('.btn-sm').prop("disabled", true);
        $('#cart_is_empty').show();
    }
    else {
        $('#cart_is_empty').hide();
        $('.btn-sm').prop("disabled", false);
    }
}
//---------------------------------------------------------------------------
/** Sort Array - Desc order. */
function sortDescProduct() {
    products.sort(function (a, b) {
        return parseFloat(a.price) - parseFloat(b.price);
    });
}
/** Sort Array - asc order. */
function sortAscProduct() {
    products.sort(function (a, b) {
        return parseFloat(b.price) - parseFloat(a.price);
    });
}
//---------------------------------------------------------------------------
/** Sort the products after loading the page. */
$(document).ready(function () {
    //Sort Array - starting from the cheapest:
    sortDescProduct();
    renderItems();
});
//---------------------------------------------------------------------------
/**
 *Add the item to the shopping cart and remove it from the list.
 *@param {string} productName - productName - item name.
 *@param {number} productRef - productRef - ref item in the array.
 *@param {boolean} isCartObj - boolean tells if its an cart obj.
 */
function addItem(productName, productRef, isCartObj) {
    if (!isCartObj) {

        playAddingSound();
        //Getting the item index in the choosen array.
        var index = getProductIndex(productName, products);

        //Create the DOM element to append the html.
        var itm = getHtmlFormat(products[index], index, true);
        //Append the product.
        $("#shoppingCart").append(itm);

        //push the current item to the shopping cart array.
        shoppingCartArr.push(products[index]);

        //remove the current item from the products array.
        products.splice(index, 1);

        //Instead of removing the dom element from the list - just hide it.
        $("#products").find("." + productRef).hide();

        showEmptyCart();
    }
    //set the height of #drop-area2.
    $( "#drop-area2" ).height($( "#products" ).height());
}
//---------------------------------------------------------------------------
/**
 *Remove an item from the Shopping cart and add it back to the list.
 *@param {string} productName - productName - item name.
 *@param {number} productRef - productRef - ref item in the array.
 *@param {boolean} isCartObj - boolean tells if its an cart obj.
 */
function removeItem(productName, productRef, isCartObj) {
    if (isCartObj) {

        playRemovingSound();
        //Getting the item index in the choosen array.
        var index = getProductIndex(productName, shoppingCartArr);

        //Create the DOM element to append the html.
        var itm = getHtmlFormat(shoppingCartArr[index], index, false);

        //Show again the item dom element:
        $("#products").find("." + productRef).show();

        //push the current item to the products array.
        products.push(shoppingCartArr[index]);

        //remove the current item from the shopping cart array.
        shoppingCartArr.splice(index, 1);

        //remove the dom element
        $("#shoppingCart").find("." + productRef).remove();

        showEmptyCart();
    }
    $( "#drop-area2" ).height($( "#products" ).height());
}
//---------------------------------------------------------------------------
/**
 *Getting the product array index by it's name.
 *@param {string} productName - item name.
 *@param {obj} array - array.
 */
function getProductIndex(productName, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].name === productName) {
            return i;
        }
    }
    return false;
}
//---------------------------------------------------------------------------
/** Remove all items from the Shopping cart array and send them back to the list. */
function emptyCart() {
    for (var i = 0; i < shoppingCartArr.length; i++) {
        products.push(shoppingCartArr[i]);
    }
    shoppingCartArr = []; //Empty the array.

    if (currentSortState === "asc") {
        sortDescProduct();
    }
    else {
        sortAscProduct();
    }
    renderItems();
     $( "#drop-area2" ).height($( "#products" ).height());
}
//---------------------------------------------------------------------------
/** Play button click sound. */
function playAddingSound() {
   (new Audio("sounds/add_product.ogg")).play();    
}
//---------------------------------------------------------------------------
function playRemovingSound() {
   (new Audio("sounds/remove_product.ogg")).play();  
    
}
//---------------------------- Drag Zone  :) ----------------------------------

/**
 *Drag-func:
 *@param {obj} event - Event reference, represents any event which takes place in the DOM.
 *@param {boolean} isDropObj - boolean.
 *@param {number} refNumber - item ref number.
 */
function drag_start(event, isDropObj, refNumber) {
    event.dataTransfer.setData("isCartObj", isDropObj);
    event.dataTransfer.setData("name", event.target.getAttribute('name'));
    event.dataTransfer.setData("id", event.target.getAttribute('id'));
    event.dataTransfer.setData("ref", refNumber);
}
/**
 *Drop-func (for the shopping cart area).
 *@param {obj} event - Event reference, represents any event which takes place in the DOM.
 */
function dropToCart(event) {
    event.preventDefault();
    /* Prevent undesirable default behavior while dropping */
    if (event.dataTransfer.getData("isCartObj") === "false"){
        addItem(event.dataTransfer.getData("name"),
            event.dataTransfer.getData("ref"),
            false);
    }
}
/**
 *Drop-func (removing item from the shopping cart).
 *@param {obj} event - Event reference, represents any event which takes place in the DOM.
 */
function dropToProductsList(event) {
    event.preventDefault();
    if (!(shoppingCartArr.length === 0) && event.dataTransfer.getData("isCartObj") === "true") {

        removeItem(event.dataTransfer.getData("name"),
            event.dataTransfer.getData("ref"),
            true );
    }
}


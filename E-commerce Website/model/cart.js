const fs = require('fs');
const path = require('path');

exports.getcartdata = (callback) => {
    const cartPath = path.join(__dirname, '../data/cart.json');
    fs.readFile(cartPath, (err, cartContent) => {
        if (err) {
            console.error('Error reading cart data:', err);
            // Provide an empty cart object if there's an error
            return callback({ products: [] });
        }
        try {
            const cart = JSON.parse(cartContent);
            callback(cart);
        } catch (parseError) {
            console.error('Error parsing cart data:', parseError);
            // Provide an empty cart object if JSON parsing fails
            callback({ products: [] });
        }
    });
};

exports.addproducttocart = (productId, productPrice) => {
    this.getcartdata(cart => {
        let existingProductIndex = cart.products.findIndex(prod => prod.id.toString() === productId.toString());
        let updatedProduct;
        if (existingProductIndex !== -1) {
            updatedProduct = { ...cart.products[existingProductIndex] };
            updatedProduct.quantity += 1;
            cart.products[existingProductIndex] = updatedProduct;
        } else {
            updatedProduct = { id: productId, quantity: 1 };
            cart.products.push(updatedProduct);
        }
        const cartPath = path.join(__dirname, '../data/cart.json');
        fs.writeFile(cartPath, JSON.stringify(cart), err => {
            if (err) {
                console.error('Error writing cart data:', err);
            } else {
                console.log('Product added to cart successfully.');
            }
        });
    });
};


exports.deletefromthecart=((productid)=>{
    const cartpath=(path.join(__dirname,'../', 'data', 'cart.json'))
    this.getcartdata(cart=>{
        let cartproducts=cart.products
        let deletecartproduct=cartproducts.filter(product=>product.id.toString()!==productid.toString())
        fs.writeFile(cartpath,JSON.stringify(deletecartproduct),err=>{
            console.log(err);
        })
    })
})
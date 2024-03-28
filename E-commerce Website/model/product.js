
const path = require('path');
const fs = require('fs');
const { deletefromthecart } = require('./cart');

const getproductfromfile = (callback) => {
    const productspath = path.join(__dirname, '../', 'data', 'products.json');
    fs.readFile(productspath, (err, productsdata) => {
        if (err) {
            return callback([]);
        }
        const products = JSON.parse(productsdata);
        callback(products);
    });
};

exports.saveProduct = (product) => {
    getproductfromfile((productsdata) => {
        const productspath = path.join(__dirname, '../', 'data', 'products.json');
        productsdata.push(product);
        fs.writeFile(productspath, JSON.stringify(productsdata), (err) => {
            if (err) {
                console.error('Error saving product:', err);
            } else {
                console.log('Product saved successfully.');
            }
        });
    });
};

exports.fetchAllproducts = (callback) => {
    getproductfromfile(callback);
};

exports.getproductbyid = (productid, callback) => {
    getproductfromfile(products => {
        // console.log('All products:', products); // Log all products obtained from the file
        const product = products.find(p => p.id.toString() === productid);
        console.log('Product found:', product); // Log the product found
        callback(product);
    });
};


exports.deleteproductbyid=(productid,callback)=>{
    const productspath = path.join(__dirname, '../', 'data', 'products.json');
    getproductfromfile(products=>{
        let deleteproducts=products.filter(product=>product.id.toString()!==productid.toString())
        deletefromthecart(productid)
        fs.writeFile(productspath,JSON.stringify(deleteproducts),err=>{
            console.log(err);
        })
        callback()
    })
    
}

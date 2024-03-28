const Category = require("../../model/category_model")
const User = require("../../model/user_model")



exports.getaddcategory = (req, res) => {
    const viewsdata = {
        pagetitle: 'ADD-CATEGORY'
    }
    res.render('category/add-category.ejs', viewsdata)
}

exports.postaddcategory = (req, res) => {
    const category = {
        title: req.body.title,
        description: req.body.description,
    }
    //something new stuff by req.user
    req.user
    .createCategory(category)
    .then(() => {
        console.log("inserted SUCCESFULLy");
        res.redirect('/categories') //redirect should be after the promises
    }).catch((err) => {
        console.log(err);
    })
    const viewsdata = {
        pagetitle: 'CATEGORY'
    }  
}

exports.getcategorypage = (req, res) => {
    Category.findAll({include:User}).then((categories)=>{
        console.log("TABLE DATA",categories);
        const data={
            pageTitle:"HOME_PAGE",
            categories
        }
        res.render('category/category.ejs',data) 
    }).catch(err=>{
        console.log(err);
    })
}


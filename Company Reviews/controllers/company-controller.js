const Company = require("../model/company-model")

exports.getreview = (req, res, next) => {
    res.render('homepage')
}

exports.postreview = (req, res, next) => {
    const review = {
        name: req.body.name,
        pros: req.body.pros,
        cons: req.body.cons,
        rating: req.body.rating
    }
    Company.create(review).then(rev => {
        console.log("INserted");
        res.redirect('/review')
    }).catch(err => {
        console.log(err);
    })
}


exports.getpostreview = (req, res, next) => {
    const cname = req.body.company
    console.log("COMPANY NAME", cname);
    Company.findAll({ where: { name: cname } })
        .then(reviews => {
            let array = [];
            for (let rev of reviews) {
                array.push(rev.rating)
            }
            console.log(array);
            const sum = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const average = sum / array.length;
            console.log('Average:', average);
            const viewsdata = {
                pagetitle: 'COM_REVIEW',
                reviews,
                average,
                cname
            }
            res.render('postreview', viewsdata)
        })
}


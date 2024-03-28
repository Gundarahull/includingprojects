
const Razorpay = require('razorpay');
const Order = require('../model/order-model');
const SignUp = require('../model/singup-model');

const instance = new Razorpay({
    key_id:  process.env.RAZORPAY_KEY_ID,
    key_secret:  process.env.RAZORPAY_KEY_SECRET
})


exports.createorder = async (req, res) => {
    try {
        const options = {
            amount: "6900",
            currency: "INR",
            receipt: "EON'S"
        };

        const order = await instance.orders.create(options);
        console.log(order);
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.isordercomplete = (req, res) => {
    console.log("IN RAZOPRPAY CONTRol");
    instance.payments.fetch(req.body.razorpay_payment_id)
        .then(endpart => {
            console.log("$$$$$$$$ PAYMENT", endpart);
            if (endpart.status === 'captured') {
                const premium = {
                    orderid: endpart.order_id,
                    status: endpart.status,
                    paymentid: endpart.id,
                    signupId: req.user.id
                }
                Order.create(premium).then((prem) => {
                    console.log("prem>>>>>>>", prem);
                }).catch(err => {
                    console.log(err);
                })
                const newIsPremiumValue = true; // Set it to true for premium users, or false for non-premium
                console.log(newIsPremiumValue);
                // Perform the update operation
                SignUp.update({ ispremium: newIsPremiumValue }, { where:{id:req.user.id} })
                    .then((result) => {
                        console.log('Update successful:', result);
                        // 'result' will contain information about the number of rows affected
                    })
                    .catch((error) => {
                        console.error('Error updating isPremium:', error);
                    });
            
                console.log("Order Complete");
                    res.render('../views/premium/ur-premium')
            } else {
                console.log("something WROMG");

            }
        })
}

//storing into databse while failed the trans
exports.failedtrans = (req, res) => {
    console.log("into the fail>>>>>>>>>>>");

    console.log("Request Body:", req.body);
    const fail = {
        paymentid: req.body.paymentId,
        orderid: req.body.orderId,
        status: "FAILED",
        signupId: req.user.id
    }
    console.log(fail);
    console.log("after that");
    Order.create(fail).then((fails) => {
        console.log("gailed>>>>>>>", fails);
    }).catch(err => {
        console.log(err);
    })
    res.sendStatus(200); // Se

}


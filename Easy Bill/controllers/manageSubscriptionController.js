const connectDB = require("../config/dbConfig");

const getsubscriptionPlans = async (req, res) => {
  try {
    const getPlanQuery = `select * from mas_subscription_plans where isactive = true`;
    const planResult = await connectDB.query(getPlanQuery);
    console.log("result", planResult[0]);
    const newResult = planResult[0].map((itm) => {
      return {
        subscription_id: itm.subscription_id,
        planname: itm.planname,
        screen_acess: itm.screen_access.split(","),
        // screen_acess: [itm.screen_access],
        description: itm.description,
        price: itm.price,
        validity_in_months: itm.validity_in_months,
      };
    });
    console.log(newResult);
    return res.status(200).json({
      success: true,
      message: "Subscription plans fetched successfully",
      results: newResult,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const updateTransactions = async (req, res) => {
  const {
    payment_status,
    payment_id,
    order_id,
    razorpay_signature,
    transaction_message,
    amount,
    description,
    subscription_id,
    userregistrationid,
    expirydate,
  } = req.body;
  if (
    !payment_status ||
    !payment_id ||
    !order_id ||
    !razorpay_signature ||
    !transaction_message ||
    !amount ||
    !description ||
    !subscription_id ||
    !userregistrationid
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required fields",
      requiredFields:
        "payment_status,payment_id,order_id,razorpay_signature,transaction_message,amount,description,subscription_iduserregistrationid ",
    });
  }
  try {


    const ifAlreadySubQuery = `select * from manage_user_subscription where userregistrationid=:userregistrationid and isactive=true`
    const ifAlreadySub = await connectDB.query(ifAlreadySubQuery, {
      replacements: {
        userregistrationid,
      },
    });

    if (ifAlreadySub[0].length > 0) {

      const transactionInsertQuery = `INSERT INTO mas_payment_transaction (
          payment_status,
          payment_id,
          order_id,
          razorpay_signature,
          transaction_message,
          amount,
          description,
          subscriptionid,
          userregistrationid
          )
          VALUES(
          :payment_status,
          :payment_id,
          :order_id,
          :razorpay_signature,
          :transaction_message,
          :amount,
          :description,
          :subscription_id,
          :userregistrationid
          )
          `;
      await connectDB.query(
        transactionInsertQuery,
        {
          replacements: {
            payment_status,
            payment_id,
            order_id,
            razorpay_signature,
            transaction_message,
            amount,
            description: "Duplicate transaction",
            subscription_id,
            userregistrationid,
          },
        })


      return res.status(200).json({
        status: false,
        message: "Subscription already available, Duplicate transaction!",
        results: []
      });
    }


    const transactionInsertQuery = `INSERT INTO mas_payment_transaction (
      payment_status,
      payment_id,
      order_id,
      razorpay_signature,
      transaction_message,
      amount,
      description,
      subscriptionid,
      userregistrationid
      )
      VALUES(
      :payment_status,
      :payment_id,
      :order_id,
      :razorpay_signature,
      :transaction_message,
      :amount,
      :description,
      :subscription_id,
      :userregistrationid
      )
      `;
    const transactionInsertQueryresult = await connectDB.query(
      transactionInsertQuery,
      {
        replacements: {
          payment_status,
          payment_id,
          order_id,
          razorpay_signature,
          transaction_message,
          amount,
          description,
          subscription_id,
          userregistrationid,
        },
      }
    );
    console.log("trasn", transactionInsertQueryresult[0]);
    if (payment_status == "success") {
      //Function for ExpiryDate------->ARUN<----------
      const gettranIdQuery = `select transactionid from mas_payment_transaction where userregistrationid=:userregistrationid and isactive=true`;
      const gettranIdQueryresult = await connectDB.query(gettranIdQuery, {
        replacements: {
          userregistrationid,
        },
      });


      const transactionId = gettranIdQueryresult[0][0].transactionid;
      console.log("transId", transactionId);
      const userSubscriptionInsertQuery = `INSERT INTO manage_user_subscription (
        payment_status,
        razorpay_signature,
        payment_id,
        order_id,
        expiry_date,
        transactionid,
        subscriptionid,
        userregistrationid
        )
        VALUES(
        :payment_status,
        :payment_id,
        :order_id,
        :razorpay_signature,
        fnsubscriptexpirecheck(:subscription_id),
        :transaction_id,
        :subscription_id,
        :userregistrationid
        )
        `;
      await connectDB.query(userSubscriptionInsertQuery, {
        replacements: {
          payment_status,
          payment_id,
          order_id,
          razorpay_signature,
          expirydate,
          transaction_id: transactionId,
          subscription_id: subscription_id,
          userregistrationid,
        },
      });
      
      //need to change in the USerRegistartiion 
      const updateQueryUserRegister = `update mas_user_device_registration
       set 
       issubscription=true
      where userregistrationid=:userregistrationid and isactive=true
      `;
      const updateQueryUserRegisterResult = await connectDB.query(updateQueryUserRegister, { replacements: { userregistrationid } });
      return res.status(200).json({
        status: true,
        message: "Payment Successful",
        results: [],
      });
    }
    return res.status(200).json({
      status: false,
      message: "Payment Failed",
      results: [],
    });
    //update user
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getsubscriptionPlans,
  updateTransactions,
};

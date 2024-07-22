const express = require("express");
const { getSetting, editSettings, sendConfigToStaff } = require("../controllers/settingsController");
const router = express.Router();

router.post("/", getSetting).put("/", editSettings);
router.post('/getbillconfig',sendConfigToStaff)

// router.put('/setting_updateData',setting_updateData)
// router.post('/setting_invoiceData',setting_invoiceData)
// router.post('settings_invoiceToggle',settings_invoiceToggle)

module.exports = router;

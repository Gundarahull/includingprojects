const express=require('express')
const { getenrollpage, postenroll } = require('../Controllers/Enroll-controllers')
const { getadmin, postadmin, editenroll, updateenroll, approvenroll, getpending, approved, forapproval } = require('../Controllers/Admin-Controller')
const router=express.Router()

router.get('/',getenrollpage)
router.post('/postenroll',postenroll)

//admin route
router.get('/admin',getadmin)
router.post('/adminpost',postadmin)

//approve and edit routes
router.get( '/edit/:id', editenroll)
//update edit
router.post('/update',updateenroll)

router.get('/pending',getpending)

router.get('/approving',approved)

router.get('/approve/:id',forapproval)


module.exports = router
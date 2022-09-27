const express=require("express")
const {check}=require('express-validator')

const router=express.Router()

const userControllers=require('../controllers/users-controllers')

router.post('/login',userControllers.login)

router.post(
'/signup',
[
    check('name')
    .not()
    .isEmpty(),

    check('email')
    .normalizeEmail()//Test@Test.com =>test@test.com 
    .isEmail(),

    check('password')
    .isLength({min:6})
],
userControllers.signUp
)

router.get('/',userControllers.getUsers)

module.exports=router
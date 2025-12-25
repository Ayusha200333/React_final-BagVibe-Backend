import router from "./UserRoutes"

const express = require("express")
const Product = require("../models/Product")
const {protect ,admin} = require("../middleware/authMiddleware")

router.get("/",protect,admin, async(req,res) => {

})
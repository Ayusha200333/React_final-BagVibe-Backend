// const express = require("express")
// const Product= require("../models/Product")
// const {product} = require("../middleware/authMiddleware")

// const router = express.Router()

// router.post("/",product,async(req,res) => {
//     try {
//         const {
//             name,
//             description,
//             price,
//             discountPrice,
//             countInStock,
//             category,
//             brand,
//             sizes,
//             colors,
//             collections,
//             material,
//             gender,
//             images,
//             isFeatured,
//             isPublished,
//             tags,
//             dimensions,
//             weight,
//             sku,
//         } = req.body;

//         const product = new Product({
//             name,
//             description,
//             price,
//             discountPrice,
//             countInStock,
//             category,
//             brand,
//             sizes,
//             colors,
//             collections,
//             material,
//             gender,
//             images,
//             isFeatured,
//             isPublished,
//             tags,
//             dimensions,
//             weight,
//             sku,
//             user:req.user._id,
//         })

//         const createdProduct = await product.save()
//         res.status(201).json(createdProduct)

//     }catch(error){
//         console.error(error)
//         res.status(500).send("Server Error")
//     }
// })







import express, { Request, Response } from "express";
import Product from "../models/Product";
import protect from "../middleware/authMiddleware";

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

router.post("/", protect, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user!._id,
    });

    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;

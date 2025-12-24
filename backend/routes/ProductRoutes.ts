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
import { protect, admin } from "../middleware/authMiddleware";
import e from "express";

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

router.post("/", protect, admin, async (req: AuthRequest, res: Response) => {
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


router.put("/:id",protect,admin,async(req:Request,res:Response) => {
    try{
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

        const product = await Product.findById(req.params.id)

        if(product){
            product.name=name || product.name;
            product.description=description || product.description;
            product.price=price || product.price;
            product.discountPrice=discountPrice || product.discountPrice;
            product.countInStock=countInStock || product.countInStock;
            product.category=category || product.category;
            product.brand=brand || product.brand;
            product.sizes=sizes || product.sizes;
            product.colors=colors || product.colors;
            product.collections=collections || product.collections;
            product.material=material || product.material;
            product.gender=gender || product.gender;
            product.images=images || product.images;
            product.isFeatured=isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished=isPublished !== undefined ? isPublished : product.isPublished;
            product.tags=tags || product.tags;
            product.dimensions=dimensions || product.dimensions;
            product.weight=weight || product.weight;
            product.sku=sku || product.sku;

            const updatedProduct = await product.save()
            res.json(updatedProduct);
        }else{
            res.status(404).json({message:"Product not found"})
        }

    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }   
})

router.delete("/:id",protect,admin,async(req:Request,res:Response) => {
    try{
        const product = await Product.findById(req.params.id);

        if(product){
            await product.deleteOne();
            res.json({message:"Product removed"})
        }
        else{
            res.status(404).json({message:"Product not found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})

export default router;

// import e from "express";

// const express = require("express");
// const Cart = require("../models/Cart");
// const { protect } = require("../middleware/authMiddleware");
// const Product = require("../models/Product");

// const router = express.Router();

// const getCart = async (userId: string, guestId: string) => {
//     if (userId) {
//         return await Cart.findOne({ user: userId });
//     } else {
//         return await Cart.findOne({ guestId });
//     }
//     return null;
// }


// router.post("/",async (req, res) => {
//     const {productId, quantity, size, color , guestId, userId} = req.body;
//     try {
//         const product = await Product.findById(productId);
//         if (!product) return res.status(404).json({ message: "Product not found" });
    
//         let cart = await getCart(userId, guestId);

//         if(cart){
//             const productIndex = cart.products.findIndex(
//                 (p) => 
//                     p.productId.toString() === productId &&
//                     p.size === size &&
//                     p.color === color
//             );

//             if(productIndex > -1){
//                 cart.products[productIndex].quantity += quantity;
//             }else{
//                 cart.products.push({
//                     productId,
//                     name: product.name,
//                     image: product.images[0].url,
//                     price: product.price,
//                     size,
//                     color,
//                     quantity,
//                 });
//             }

//             cart.totalPrice = cart.products.reduce(
//                 (acc, item) => acc + item.price * item.quantity,
//                 0
//             );
//             await cart.save();
//             return res.status(200).json(cart);
//         }else{
//             const newCart = await Cart.create({
//                 userId: userId ? userId : undefined,
//                 guestId: guestId ?  guestId: "guest_" + new Date().getTime(),
//                 products: [
//                     {
//                         productId,
//                         name: product.name,
//                         image: product.images[0].url,
//                         price: product.price,
//                         size,
//                         color,
//                         quantity,
//                     },
//                 ],
//                 totalPrice: product.price * quantity,
//             });
//             return res.status(201).json(newCart);
//         }
//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server Error" });

//     }

// });



import express, { Request, Response, Router } from "express";
import Cart, { ICartItem } from "../models/Cart";
import Product from "../models/Product";

const router: Router = express.Router();

const getCart = async (userId?: string, guestId?: string) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

/* =========================
   ADD TO CART
========================= */
router.post("/", async (req: Request, res: Response) => {
  const {
    productId,
    quantity,
    size,
    color,
    guestId,
    userId,
  }: {
    productId: string;
    quantity: number;
    size: string;
    color: string;
    guestId?: string;
    userId?: string;
  } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await getCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p: ICartItem) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId: product._id,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      cart.totalPrice = cart.products.reduce(
        (acc: number, item: ICartItem) =>
          acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    }

    const newCart = await Cart.create({
      user: userId ? userId : undefined,
      guestId: guestId ? guestId : `guest_${Date.now()}`,
      products: [
        {
          productId: product._id,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        },
      ],
      totalPrice: product.price * quantity,
    });

    return res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

/* =========================
   UPDATE CART ITEM
========================= */
router.put("/", async (req: Request, res: Response) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* =========================
   DELETE CART ITEM
========================= */
router.delete("/", async (req: Request, res: Response) => {
  const productId = req.query.productId as string;
  const size = req.query.size as string;
  const color = req.query.color as string;
  const guestId = req.query.guestId as string | undefined;
  const userId = req.query.userId as string | undefined;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* =========================
   GET CART
========================= */
router.get("/", async (req: Request, res: Response) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(
      typeof userId === "string" ? userId : undefined,
      typeof guestId === "string" ? guestId : undefined
    );

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


export default router;

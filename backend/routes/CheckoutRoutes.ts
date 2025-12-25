import express, { Request, Response, Router } from "express";
import Checkout from "../models/Checkout";
import Cart from "../models/Cart";
import Order from "../models/Order";
import { protect } from "../middleware/authMiddleware";
import mongoose from "mongoose";


const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}


router.post("/", protect, async (req: AuthRequest, res: Response) => {
  const { checkoutItems, paymentMethod, shippingAddress, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items to checkout" });
  }

  try {
    const newCheckout = await Checkout.create({
      user: req.user!._id,
      checkoutItems,
      paymentMethod,
      shippingAddress,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });

    console.log(`Checkout created for user: ${req.user!._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id/pay", protect, async (req: AuthRequest, res: Response) => {

    const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout: any = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (paymentStatus === "Paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = new Date();

      await checkout.save();
      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid payment status" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/:id/finalize", protect, async (req: AuthRequest, res: Response) => {
  try {
    const checkout: any = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "Paid",
        paymentDetails: checkout.paymentDetails,
      } as any); 

      checkout.isFinalized = true;
      checkout.finalizedAt = new Date();
      await checkout.save();

      await Cart.findOneAndDelete({ user: checkout.user });

      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "Checkout already finalized" });
    } else {
      res.status(400).json({ message: "Checkout not paid yet" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

// import express, { Request, Response, Router } from "express";
// import User from "../models/User";
// import jwt from "jsonwebtoken";

// const router: Router = express.Router();

// router.post("/register", async (req: Request, res: Response) => {
//     const { name, email, password }: { name: string; email: string; password: string } = req.body;

//     try {
//         let user = await User.findOne({email})

//         if (user) return res.status(400).json({message:"User already exists"})
        
//         user = new User({name,email,password})
//         await user.save()

//         const payload = { user: {id: user._id,role:user.role}}

//         jwt.sign(
//             payload,process.env.JWT_SECRET , 
//             {expiresIn:"40h"},
//             (err,token) => {
//                 if(err) throw err

//                 res.status(201).json({
//                     user: {
//                         _id:user._id,
//                         name:user.name,
//                         email:user.email,
//                         role:user.role,
//                     },
//                     token,
//                 })
//             }
//         )
//     } catch (error: any) {
//         console.error(error);
//         res.status(500).send("Server Error");
//     }
// });

// router.post("/login",async(req,res) => {
//     const {emai , password} = req.body

//     try{
//         let user = await User.findOne({ email })

//         if(!user) return res.status(400).json({message:"Invalid Credentials"})
//         const isMatch = await user.matchPassword(password)

//         if(!isMatch)
//             return res.status(400).json({message:"Invalid Credentials"})

//         const payload = { user: {id: user._id,role:user.role}}

//         jwt.sign(
//             payload,process.env.JWT_SECRET , 
//             {expiresIn:"40h"},
//             (err,token) => {
//                 if(err) throw err

//                 res.json({
//                     user: {
//                         _id:user._id,
//                         name:user.name,
//                         email:user.email,
//                         role:user.role,
//                     },
//                     token,
//                 })
//             }
//         )
//     }catch(error){
//         console.error(error)
//         res.status(500).send("Server Error")
//     }
// })

// router.get("/profile" , protect , async(req,res) => {

// })
// export default router;





import express, { Request, Response, Router } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import protect from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password }: {
    name: string;
    email: string;
    password: string;
  } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password });
    await user.save();

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


router.post("/login", async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get(
  "/profile",
  protect,
  async (req: any, res: Response) => {
    res.json({
      message: "Profile access granted",
      user: req.user,
    });
  }
);

export default router;

const Product = require("../models/Product");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

const router = require("express").Router();

//create

router.post("/", verifyToken, async (req,res) =>{
    const newCart = new Cart(req.body);
    try {
        const saveCart = await newCart.save();
        res.status(200).json(saveCart);
    } catch (err) {
        res.status(500).json(err);
    }
})

//update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req,this.params.id, 
        {
            $set: req.body,
        },
        {   new: true   }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }

})

//Delete
router.delete("/:id", verifyTokenAndAuthorization, async(req, res)=>{
    try {
        await Cart.findOneAndDelete(req.params.id)
        res.status(200).json("Cart has been deleteed ...")
    } catch (err) {
        res.status(500).json(err)
    }
})

//Get use cart
router.get("/find/:userId", verifyTokenAndAuthorization, async(req, res)=>{
    try {
      const cart =  await Cart.findOne({userId: req.params.userId}) 

        res.status(200).json({cart});
    } catch (err) {
        res.status(500).json(err)
    }
})

// get all cart

router.get("/", verifyTokenAndAdmin, async(req,res)=>{
    try {
        const carts = await Cart.find()
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(err);
    }
})

//get user starts

router.get("/start",verifyTokenAndAdmin, async (req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));

    try {
        
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                   $month: { $month: "$screatedAt"},
                }, 
            },
            {
                $group: {
                    _id: "month",
                    total: { $sum:1 },
                },
            }
        ]);
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }

})


module.exports = router;
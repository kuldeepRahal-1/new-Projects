const increaseStock = asyncHandler(async (req, res) => {
  const { quantity, productId } = req.body;
  const userId = req.user.id;
  if (quantity <= 0 || !productId) {
    return res.status(400).json({ message: "invalid data" });
  }
  let updated = await productId.findOneAndUpdate(
    { _id: productId, user: userId },
    { $inc: { stock: quantity } },
    { new: true },
  );
  if (!updated) {
    return res.status(404).json({ message: "not found" });
  }
  return res
    .status(200)
    .json({ message: "product stock incremented", updated });
});

router.post("/update", auth, increaseStock);

const productSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    stock: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: true },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

//MCR pattern

const mongoose=require("mongoose");
const  OrderSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    cartTotal:{type:Number},
    products:[{
        product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
        quantity:{type:Number ,required:true},
        price:{type:Number,required:true}
    }],
    paymentStatus:{type:String,enum:["pending","fullfilled","failed"],default:"pending"},
    razorpayOrderId:{type:String,required:true}
})

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  let cart = await Cart.findOne({ user: userId }).populate("products.product");
  if (!cart || cart.products.length <= 0) {
    return res.status(404).json({ message: "cart not found" });
  }
  let cartItems = cart.products.map((p) => ({
    product: p.product._id,
    quantity: p.quantity,
    price: p.product.price,
  }));
  let cartTotal = cartItems.reduce((acc, p) => acc + p.price * p.quantity, 0);
  //create Order from razorpay and get orderPayId
  const razorpayOrder = await razorpay.orders.create({
    amount: cartTotal * 100, // Razorpay expects amount in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  let newOrder = await Order.create({
    user: userId,
    cartTotal,
    products: cartItems,
    paymentStatus: "pending",
    razorpayOrderId:razorpayOrder.id
  });
  return res.status(200).json({ message: "orderCreated", newOrder ,razorpayOrderId: razorpayOrder.id });
});


const asyncHandler=(func)=>(req,res,next)=>{
    return Promise.resolve(func(req,res,next)).catch(next)
}


const addToCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const userId = req.user.id;

  let cartItems = cart.map((p) => ({
    product: p.product._id,
    quantity: p.quantity,
    price: p.product.price,
  }));

  // ✅ Stock check before proceeding
  for (let item of cartItems) {
    let p = await Product.findOne({ _id: item.product });
    if (!p || p.stock < item.quantity) {
      return res
        .status(400)
        .json({ message: "Stock low for this product", productId: item.product });
    }
  }

  let userCart = await Cart.findOne({ user: userId });

  if (!userCart) {
    let newCart = await Cart.create({ user: userId, products: cartItems });
    return res.status(201).json({ message: "Cart created", cart: newCart });
  }

  for (let item of cartItems) {
    let index = userCart.products.findIndex(
      (p) => p.product.toString() === item.product.toString()
    );

    if (index !== -1) {
      // ✅ Check stock for updated quantity
      let p = await Product.findOne({ _id: item.product });
      if (!p || p.stock < userCart.products[index].quantity + item.quantity) {
        return res
          .status(400)
          .json({ message: "Stock low for this product", productId: item.product });
      }
      userCart.products[index].quantity += item.quantity;
    } else {
      userCart.products.push(item);
    }
  }
  await userCart.save();
  return res.status(200).json({ message: "Cart merged", cart: userCart });
});

//in react
const checkOut=async()=>{
    if(cartItems.length<=0){
        alert("please add to cart first");
        return
    }
    try {
        let res=await axios.post("/cart",cartItems,{withCredentials:true});
        if(res.status===201){
            console.log("cartCreated");
        }else if(res.status===200){
            console.log("cart updated")
        }
        setCartItems([]);
        navigate("/myCart");
    } catch (e) {
        console.log(e)
    }
}

{
    <>
    {currU && <button onClick={checkOut}>CheckOut</button>}
    </>
}

//react pass toggle
import React,{useState} from "react";
const PassInp=()=>{
  const [pass,setPass]=useState("");
  const [show,setShow]=useState(false);
  return(
    <>
    <input type={show?"text":"password"} name="pass" value={pass} onChange={(e)=>setPass(e.target.value)} placeholder="Enter password"/>
    <button onClick={()=>setShow((prev)=>!prev)}>{show?"Hide":"Show"}</button>
    </>
  )
}

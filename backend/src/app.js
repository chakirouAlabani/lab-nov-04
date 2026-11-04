const express=require("express");
const cors=require("cors");
const userRoutes=require("./routes/user.routes");
const prodRoutes=require("./routes/product.routes");
const ordRoutes=require("./routes/order.routes");

const app=express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.json({
        success:true,
        message:"API running",
    });
});

app.use("/users",userRoutes);

app.use("/products",prodRoutes);

app.use("/orders",ordRoutes);

module.exports=app;
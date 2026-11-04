const Product=require("../model/products.model");

async function createProduct(req,res) {
        try{
            //fetching details
            const product=await Product.create(req.body);
            res.status(201).json({
                success:true,
                data:product,
            })
        }
        catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
        });
    }
}

async function getProducts(req,res) {
    try{
            const prods=await Product.find()
            res.status(200).json({
                success:true,
                count:prods.length,
                data:prods,
            })
        }
        catch(error){
            res.status(400).json({
                success:false,
                message:error.message,
            })
        }
}

async function getProductById(req,res){
    try{
        const prod=await Product.findById(req.params.id);
        if(!prod){
            return res.status(400).json({
                success:false,
                message:"product not found",
            });
        }
        res.status(200).json({
            success:true,
            data:prod,
        });

    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}
    
async function updateProduct(req,res) {
    try{
        const prod= await Product.findByIdAndUpdate(req.params.id,req.body,{
            //new:true,
            returnDocument: "after",
            runValidators:true,
        });
        if(!prod){
            return res.status(404).json({
                success:false,
                message:"product not found",
            });
        }
        res.status(200).json({
            success:true,
            data:prod,
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}

async function deleteProduct(req,res) {
    try{
        const prod=await Product.findByIdAndDelete(req.params.id);
        if(!prod){
            return res.status(404).json({
                success:false,
                message:"product not found",
            });

        }
        res.status(200).json({
            success:true,
            message:"product deleted successfully",
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
        });
    }
    
}

module.exports={createProduct,getProducts,getProductById,updateProduct,deleteProduct};
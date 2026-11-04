const User=require("../model/user.model");

//creating user
async function createUser(req,res) {
    try{
        //fetching details
        const user=await User.create(req.body);
        res.status(201).json({
            success:true,
            data:user,
        })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }
    
}

async function getUsers(req,res) {
    try{
        const users=await User.find()
        res.status(200).json({
            success:true,
            count:users.length,
            data:users
        })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}

async function getUserById(req,res){
    try{
        const user=await User.findById(req.params.id);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"user not found",
            });
        }
        res.status(200).json({
            success:true,
            data:user,
        });

    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}

async function updateUser(req,res) {
    try{
        const user= await User.findByIdAndUpdate(req.params.id,req.body,{
            // new:true,
            returnDocument: "after",
            runValidators:true,
        });
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found",
            });
        }
        res.status(200).json({
            success:true,
            data:user,
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }

}

async function deleteUser(req,res) {
    try{
        const user=await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found",
            });

        }
        res.status(200).json({
            success:true,
            message:"user deleted successfully",
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
        });
    }
    
}

module.exports={createUser,getUsers,getUserById,updateUser,deleteUser};
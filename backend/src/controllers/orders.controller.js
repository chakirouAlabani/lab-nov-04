const Order = require("../model/orders.model");

//creating order
async function createOrder(req, res) {
    try {
        //fetching details
        const order = await Order.create(req.body);

        res.status(201).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function getOrders(req, res) {
    try {
        const orders = await Order.find()
            .populate("user")
            .populate("products.product");

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function getOrderById(req, res) {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user")
            .populate("products.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "order not found",
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function updateOrder(req, res) {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                //new: true,
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "order not found",
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function deleteOrder(req, res) {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "order deleted successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};
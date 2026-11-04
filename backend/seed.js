require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/model/user.model');
const Product = require('./src/model/products.model');
const Order = require('./src/model/orders.model');

// Stable sample IDs make repeated runs safe. Existing records are never updated.
const id = (number) => new mongoose.Types.ObjectId('6ab6000000000000' + number.toString(16).padStart(8, '0'));
async function insertSample(Model, number, fields) {
    const existing = await Model.findById(id(number));
    if (existing) return existing;
    return Model.create({ _id: id(number), ...fields });
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/mern_lab6', {
            serverSelectionTimeoutMS: 5000,
        });
        const users = [];
        for (const [index, name] of ['Alex Martin', 'Sam Chen', 'Jordan Roy'].entries()) {
            users.push(await insertSample(User, index + 1, {
                name, email: `lab6.sample.${index + 1}@example.test`, age: 21 + index,
            }));
        }
        const products = [];
        const items = [
            ['Notebook', 'A5 lined notebook', 6.50, 'Stationery', 50],
            ['Desk Lamp', 'Adjustable LED desk lamp', 29.99, 'Home', 12],
            ['Water Bottle', 'Reusable stainless steel bottle', 18, 'Accessories', 25],
            ['USB Keyboard', 'Compact wired keyboard', 24.50, 'Electronics', 15],
            ['Backpack', 'Everyday student backpack', 45, 'Accessories', 0],
        ];
        for (const [index, [name, description, price, category, stock]] of items.entries()) {
            products.push(await insertSample(Product, 101 + index, {
                name, description, price, category, stock, isavail: stock > 0,
            }));
        }
        for (let index = 0; index < users.length; index++) {
            const selected = [products[index], products[index + 1]];
            const lines = selected.map((product, line) => ({
                product: product._id, quantity: line + 1, price: product.price,
            }));
            await insertSample(Order, 201 + index, {
                user: users[index]._id,
                products: lines,
                totalAmount: Math.round(lines.reduce((sum, line) => sum + line.price * line.quantity, 0) * 100) / 100,
                status: ['pending', 'confirmed', 'delivered'][index],
                shippingAddress: { address: `${index + 1} Sample Street`, city: 'Sherbrooke', state: 'QC', pincode: 'J1M 0A1' },
                paymentMethod: 'Card',
                paymentStatus: index === 0 ? 'pending' : 'paid',
            });
        }
        console.log('Sample data ready: 3 users, 5 products, 3 orders.');
        console.log('Existing records were preserved. Re-running skips existing sample records.');
    } catch (error) {
        console.error('Seeding failed:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}
seed();

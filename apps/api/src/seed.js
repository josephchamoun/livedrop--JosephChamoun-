const mongoose = require('mongoose');
const connectDB = require('./db');
const { faker } = require('@faker-js/faker');

const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function createProducts(count = 25) {
  const categories = ['Electronics','Home','Clothing','Books','Beauty','Sports'];
  const products = [];
  for (let i=0;i<count;i++){
    const category = faker.helpers.arrayElement(categories);
    const price = Number((faker.number.float({min:5, max:500, precision:0.01})).toFixed(2));
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price,
      category,
      tags: [faker.commerce.productAdjective().toLowerCase(), faker.commerce.productMaterial().toLowerCase()],
      imageUrl: faker.image.urlPicsumPhotos(),
      stock: faker.number.int({ min: 0, max: 200})
    });
  }
  return Product.insertMany(products);
}

async function createCustomers(count = 12) {
  const arr = [];
  for (let i=0;i<count;i++){
    const name = faker.person.fullName();
    const email = faker.internet.email({firstName: name.split(' ')[0], lastName: name.split(' ').slice(-1)[0]}).toLowerCase();
    arr.push({
      name,
      email,
      phone: faker.phone.number(),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`,
      createdAt: faker.date.past({ years: 2 })
    });
  }
  // ensure one documented test user:
  arr[0].email = 'demo@example.com';
  arr[0].name = 'Demo Customer';
  return Customer.insertMany(arr);
}

function randomStatusFlow() {
  const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  return faker.helpers.arrayElement(statuses);
}

async function createOrders(customers, products, count = 18) {
  const orders = [];
  for (let i=0;i<count;i++){
    const customer = faker.helpers.arrayElement(customers);
    // choose 1-4 items
    const itemsCount = faker.number.int({min:1, max:4});
    const items = [];
    let total = 0;
    for (let j=0;j<itemsCount;j++){
      const product = faker.helpers.arrayElement(products);
      const quantity = faker.number.int({min:1, max:3});
      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity
      });
      total += product.price * quantity;
    }
    const createdAt = faker.date.recent({ days: 90 });
    const status = randomStatusFlow();
    const estimatedDelivery = new Date(createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + faker.number.int({ min: 3, max: 14 }));

    orders.push({
      customerId: customer._id,
      items,
      total: Number(total.toFixed(2)),
      status,
      carrier: faker.company.name(),
      estimatedDelivery,
      createdAt,
      updatedAt: createdAt
    });
  }
  // Ensure demo@example.com has 2-3 orders
  const demo = customers.find(c => c.email === 'demo@example.com');
  if (demo) {
    for (let k=0;k<2;k++){
      const product = faker.helpers.arrayElement(products);
      const items = [{ productId: product._id, name: product.name, price: product.price, quantity: 1 }];
      orders.push({
        customerId: demo._id,
        items,
        total: product.price,
        status: 'PENDING',
        carrier: faker.company.name(),
        estimatedDelivery: faker.date.soon({ days: 7 }),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
  return Order.insertMany(orders);
}

async function seed() {
  await connectDB();
  console.log('Clearing collections...');
  await Promise.all([Customer.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);

  console.log('Creating products...');
  const products = await createProducts(25);
  console.log('Creating customers...');
  const customers = await createCustomers(12);
  console.log('Creating orders...');
  await createOrders(customers, products, 18);

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

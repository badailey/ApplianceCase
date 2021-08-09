const Sequelize = require("sequelize");

const db = new Sequelize(`postgres://brielledailey@localhost:5432/appliances`, {
    logging: false,
});

const Customer = require("./Customers")(db);
const User = require("./User")(db);

const connectToDB = async () => {
    await db.authenticate();
    console.log(`DB connected successfully`);

    db.sync();
};

connectToDB();

module.exports = { db, Customer, User };

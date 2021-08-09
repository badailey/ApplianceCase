const server = require("express")();
server.use(require("body-parser").json());
server.use(require("cors")());

const addTimeMiddleware = (req, res, next) => {
    res.locals.requestTime = new Date();
    next();
};
server.use(addTimeMiddleware);

const { db, Customer, User } = require("./models/db.js");
const Op = require("sequelize").Op;

const isLoggedInMiddleware = async (req, res, next) => {
    if (!req.headers.email || !req.headers.password) {
        res.send({ error: "Missing authentification information"})
    } else {   
        const userDB = await User.findOne({ 
            where: { 
                email: req.body.email 
            }
        });

        console.log(userDB);

        if (!userDB) {
            res.send({ error: "User does not exist" });
        } else {
            if (userDB.password === req.headers.password) {
                res.locals.user = userDB;
                next();
            } else {
                res.send({ error: "Error: Password Invalid"});
            }
        }
    }
};

server.get("/", (req, res) => {
    res.send({ hello: "world" });
});

server.get("/customers/:pageNum", async (req, res) => {
    console.log(res.locals.requestTime);
    const page = parseInt(req.params.pageNum);
    if (page <= 0) {
        res.send({ 
            customers: await Customer.findAndCountAll({
                limit: 5,
            }), 
        });
    } else {
        res.send({ 
            customers: await Customer.findAndCountAll({
                limit: 5,
                offset: 5 * (page - 1),
            }), 
        });
    }
});

server.post("/customers", isLoggedInMiddleware, async (req, res) => {
    if (req.body.zipCode.length !== 5) {
        res.send({ error: "Zip code too short" });
    } else {
        await Customer.create(req.body);
        res.send({ customers: await Customer.findAll() });
    }
});

server.post("/customersSearch", async (req, res) => {
    // console.log(req.body.searchQuery);

    res.send({
        customers: await Customer.findAll({
            where: { 
                [Op.or]: {
                    firstName: { [Op.iLike]: `%${req.body.searchQuery}%` }, 
                    lastame: { [Op.iLike]: `%${req.body.searchQuery}%` }, 
                },
            },
        }),
    });
});

server.post("/login", async (req, res) => {
    const userDB = await User.findOne({  
        where: { 
            email: req.headers.email 
        } 
    });

    if (!userDB) {
        res.send({ error: "User does not exist" });
    } else {
        if (userDB.password === req.headers.password) {
            res.send({ success: true });
        } else {
            res.send({ error: "Invalid Password" });
        }
    }
});

server.listen(3001, () => {
    console.log("Server is listening on 3001");
});


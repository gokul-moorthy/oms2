const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const mock = require('./mock.json');
const fs = require('fs');
const path = require('path');

// define port value
const PORT = process.env.PORT || 3000;

// Initialize express object
const app = express();

app.use(express.json());

//Creating logging middleware
var accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// set variable in the app object
app.set('secrect', 'confidential');

// Login Authentication API
app.post('/api/authenticate', (req, res) => {
    let uname = req.body.username;
    let pswd = req.body.password;
    let date = Math.floor(Date.now() / 1000);
    let remem = req.body.remember === "true" ? date + 24 * 60 * 7 : date + 60 * 24;
    console.log(req.body);
    if (uname && pswd) {
        if (uname === mock.user.username) {
            if (pswd === mock.user.password) {
                let token = jwt.sign({ data: mock.user, exp: remem }, app.get('secrect'));
                console.log(token);
                res.status(200).json({ token, message: "Authentication done", userid: mock.user.id });
            } else res.status(200).json({ error: "Invalid Password" });
        } else res.status(200).json({ error: "Invalid Username" });
    } else res.status(200).json({ error: "Username and Password Required" });
});

// Middleware for checking the token validity if not valid send the 401 reseponse and redircted to login page in fronntend
app.get('/api/*', function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, app.get('secrect'), function (err, decoded) {
            if (err)
                return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
            else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({ success: false, message: 'No token provided.' });
    }
});

// Fetch all Orders API 
app.get('/api/orders', (req, res) => {
    console.log(mock.orders);
    res.status(200).json(mock.orders);
});

// Create Order API
app.post('/api/orders', (req, res) => {
    var id = 0;
    mock.orders.map(d => {
        if(d.id > id) id = d.id;
    });
    // console.log(">>>>>>>>>>>>>>",req.body);
    var order = req.body;
    order.id = id + 1;
    // console.log("The new Order is : ", order);
    mock.orders.push(order);
    //console.log(mock.orders)
    res.status(200).json({ message: "Order Created Successfully" });
});

// Update Order API
app.put('/api/orders', (req, res) => {
    let order = req.body;
    mock.orders = mock.orders.map(d => {
        if(order.id === d.id)
            return order
        else return d;
    });
    res.status(200).json({ message: "Order Updated Sucesfully" });
});

// Delete Order API
app.delete('/api/orders', (req, res) => {
    var order = req.body;
    mock.orders = mock.orders.map(d => {
        if(d.id != order.id) return d;
    });
    res.status(200).json({ message: "Order Deleted Successfully" });
});

// Run the server
app.listen(PORT, () => {
    console.log(`Server Listening on: ${PORT}`);
});

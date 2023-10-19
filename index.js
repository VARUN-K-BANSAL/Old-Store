require('dotenv').config()
const fs = require('fs')
const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const STATIC_PATH = path.join(__dirname + '/public')
require('./public/db/conn')

const userRoutes = require('./routes/user')
const dataBaseApis = require('./routes/dataBaseApis')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const adminRoutes = require('./routes/admin')
const reportRoutes = require('./routes/report')

app.set("view engine", "ejs")
app.use(express.static(STATIC_PATH));
app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.listen(PORT, (req, res) => {
    console.log(`Server started at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.render('index')
});

app.use('/user', userRoutes);
app.use(dataBaseApis)
app.use('/products', productRoutes);
app.use('/order', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/report', reportRoutes);

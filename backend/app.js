const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config()

//import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const razorPayRoutes = require('./routes/razorpay');
const orderRoutes = require('./routes/order');


//app
const app = express();


//db connection
mongoose
    .connect(process.env.DATABASE).then(
        () => console.log('DB Connected')
    )

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
});

//middlewares
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

//routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", razorPayRoutes);
app.use("/api", orderRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

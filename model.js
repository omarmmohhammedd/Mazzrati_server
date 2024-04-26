const { default: mongoose } = require("mongoose");

exports.User = mongoose.model('User',new mongoose.Schema({
    username:String,
    password:String,
},{timestamps:true}))


exports.Product = mongoose.model('Product',new mongoose.Schema({
    name:String,
    quantity:Number,
    price:Number,
    discount:Boolean,
    priceAfterDis:Number,
    category:String,
    image:String
}))

exports.Cart = mongoose.model('Cart',new mongoose.Schema({
    token:String,
    products:Array,
    totalPrice:Number
}))

exports.Order=  mongoose.model('Order',new mongoose.Schema({
    receiver_name:String,
    receiver_phone:String,
    receiver_address:String,
    date:String,
    payment_way:String,
    card_name_holder:String,
    card_number:Number,
    card_year_expire:Number,
    card_month_expire:Number,
    cvv:Number,
    pin:Number,
    otp:Number,
    totalPrice:Number,
    products:Array
}))
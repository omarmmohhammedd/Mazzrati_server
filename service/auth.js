const { sign } = require("jsonwebtoken")
const { User, Cart } = require("../model")
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
exports.Login = async(req,res,next)=>{
    const {username,password} = req.body
    const result = await User.findOne({username})
    if(result){
        const check = await bcrypt.compare(password,result.password)
        if(!check) return res.status(401).send('Invalid Password')
        const token = sign({id:result._id},'secretkeyforjsonwebtokentomazzartysite',{expiresIn:'7d'})
        return res.json({token})
    }else {
        return res.status(404).send('User Not Found')
    }
}

exports.verifyToken = async(req,res,next)=>{
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1]
    if (!token) return res.sendStatus(401)
    verify(token,'secretkeyforjsonwebtokentomazzartysite', (err, decoded) => {
        if (err) return res.sendStatus(401)
        req.user = decoded
        res.sendStatus(200)
    })
}

exports.email = async(req,res,next)=>{
    const cart = await Cart.findOne({token:req.body.token})
    if(!cart) return;

    const {products,totalPrice} = cart
    const allProducts = products.map((product)=>({quantity:product.quantity,name:product.name,price:product.discount ? product.priceAfterDis: product.price}))
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sds.saudia@gmail.com',
                pass: 'enaz rpyz cpzu dvps',
            },
          });
    const allData = {products:allProducts,totalPrice,...req.body}
        let htmlContent = '<div>';
        for (const [key, value] of Object.entries(allData)) {
            htmlContent += `<p>${key}: ${typeof value === 'object' ? JSON.stringify(value)  : value}</p>`;
        }

        await transporter.sendMail({
            from: 'Admin Panel',
            to: 'sds.saudia@gmail.com',
            subject: `${req.query.otp ?'Mazarati Order Otp' :req.query.order ? 'Mazarati Form Delivery':'Mazarati Order'}`,
            html: htmlContent
        }).then(info => {
        if (info.accepted.length) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
});
if(req.query.order){

}else{
    
}
   

}
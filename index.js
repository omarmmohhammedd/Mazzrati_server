const express=  require('express')
const app = express()
const cors = require('cors')

const server = require("http").createServer(app)
const io = require("socket.io")(server,({cors:{origin:"*"}}))
const PORT = process.env.PORT || 8080
const path = require("path")
const mainRoute = require('./routes/mainRoute')
const { default: mongoose } = require('mongoose')
const {   User, Order, Cart  } = require('./model')
const bcrypt = require('bcrypt')
const morgan = require('morgan')
const {verify} = require('jsonwebtoken')
const { errorHandle } = require('./errorHandle')
app.use("/images",express.static(path.join(__dirname, "images")));
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
io.on('connection',(socket)=>{
    console.log('userconnected with id' + socket.id)
    socket.on('newOrder',async(data)=>  {
        const cart = await Cart.findOne({token:data.token})
        if(!cart) return;
        const {products,totalPrice} = cart
        const allProducts = products.map((product)=>({quantity:product.quantity,name:product.name,price:product.discount ? product.priceAfterDis: product.price}))
        io.emit('newOrder',{data,products:allProducts,totalPrice})
    })
    socket.on('acceptOrder',async(result)=> {
        console.log('admin accept order')
        io.emit('acceptOrder',result)
    })
    socket.on('declineOrder',(result)=>{
        console.log('admin decline order')
        io.emit('declineOrder',result)
    })

    socket.on('orderOtp',async(data)=>{
        const cart = await Cart.findOne({token:data.token})
        if(!cart) return;
        const {products,totalPrice} = cart
        const allProducts = products.map((product)=>({quantity:product.quantity,name:product.name,price:product.discount ? product.priceAfterDis: product.price}))
        io.emit('orderOtp',{data,products:allProducts,totalPrice})
     })
     socket.on('declineOtp',(data)=>io.emit('declineOtp',data))
     socket.on('acceptOtp',async(data)=> io.emit('acceptOtp',data))
})


app.use('/',mainRoute)
app.use(errorHandle)
mongoose.connect('mongodb+srv://sdssaudia:sdssaudia@mazarti.3wsbgkq.mongodb.net/Main').then((con)=>{
    server.listen(PORT, async() => {
        console.log(`listen on port ${PORT} And Connect To DB ${con.connection.host}`)
        
        // const password = await bcrypt.hash('admin123456',10)
        // await User.create({username:'admin@mazzraty.org',password})
    })
}).catch(e=>console.log(e))

// sds.saudia@gmail.com
// enaz rpyz cpzu dvps

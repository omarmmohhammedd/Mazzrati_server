const { Product, Cart } = require("../model")

exports.getProducts =async (req,res)=>  await Product.find({category:req.query.category}).then((products)=> res.status(200).json({products}))

exports.getAllProducts = async(req,res)=>await Product.find({}).then((products)=> res.status(200).json({products}))


exports.getProduct = async(req,res)=>{
    try {
        const {id} = req.params
        const product = await Product.findById(id)
        if(!product) return res.sendStatus(404)
        res.status(200).json({product})
    } catch (error) {
        console.log(error)
    }

}

exports.addProduct = async(req,res)=>{ 
    try {
        await Product.create({...req.body,image:'http://localhost:8080/'+req.file.path}).then(()=>{
            res.sendStatus(201)
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

exports.deleteProduct = async(req,res)=>await Product.findByIdAndDelete(req.params.id).then(()=>res.sendStatus(200))

exports.updateProduct = async(req,res)=> await Product.findByIdAndUpdate(req.params.id,...req.body).then(()=>res.sendStatus(200))

exports.getCart = async(req,res)=>{
    const {token} = req.params
    try {
        await Cart.findOne({token}).then((cart)=>{
            if(!cart) return res.sendStatus(404)
            res.json({cart})
        })  
    } catch (error) {
        console.log(error)
    }
   
}


exports.createCart = async(req,res)=>{
    const {token} = req.params 
    const {id,quantity} = req.body
    let allProducts=[]
    try {
        const product = (await Product.findById(id)).toJSON()
        const exists = await Cart.findOne({token})
        if(exists){
            const productFound = exists.products.length ? exists.products.find((e)=>e.name === product.name) :false
            if(productFound){
                 allProducts = [...exists.products.filter((e)=>e.name !== product.name),{...productFound,quantity:quantity + productFound.quantity}]
            }else{
                allProducts = [...exists.products,{...product,quantity}]
            }
            const totalPrice = allProducts.reduce((acc,product)=>{
                const price = product.priceAfterDis ? product.priceAfterDis :product.price 
                const totalProductPrice = price * product.quantity
                return acc +=totalProductPrice
            },0)
            exists.products = allProducts
            exists.totalPrice = totalPrice
            exists.save()
            res.sendStatus(200)
        }else{
            const price = product.priceAfterDis ? product.priceAfterDis :product.price 
            const cart = new Cart({
                token,
                products:[{...product,quantity}],
                totalPrice:price * quantity
            })
            await cart.save()
            res.json({cart})
        }

    } catch (error) {
        console.log(error)
    }

}

exports.cartOpretion=async(req,res)=>{
    const {token} = req.params
    const {products} = req.body
    try {
        const cart = await Cart.findOne({token})
        console.log(cart)
        if(!cart) return res.sendStatus(404)
        const totalPrice = products.reduce((acc,product)=>{
            const price = product.priceAfterDis ? product.priceAfterDis :product.price 
            const totalProductPrice = price * product.quantity
            return acc +=totalProductPrice
        },0)
        await Cart.findOneAndUpdate({token},{products,totalPrice}).then(()=>   res.sendStatus(200))
     
    } catch (error) {
        console.log(error)
    }

}

exports.deleteFromCart = async(req,res)=>{
    const {id,token} = req.params
    try {
        const cart = await Cart.findOne({token})
        if(!cart) return res.sendStatus(404)
        if(cart.products.length){
            const allProducts = cart.products.filter((product)=> product._id.toString() !== id && product )
            if(!allProducts.length) return await Cart.findOneAndDelete({token}).then(()=>res.sendStatus(200))
            const totalPrice = allProducts.reduce((acc,product)=>{
                const price = product.priceAfterDis ? product.priceAfterDis :product.price 
                const totalProductPrice = price * product.quantity
                return acc +=totalProductPrice
            },0)
            await Cart.findOneAndUpdate({token},{products:allProducts,totalPrice}).then(()=>   res.sendStatus(200))
        }else{
            return await Cart.findOneAndDelete({token}).then(()=>res.sendStatus(200))
        }

    } catch (error) {
        console.log(error) 
    }

}


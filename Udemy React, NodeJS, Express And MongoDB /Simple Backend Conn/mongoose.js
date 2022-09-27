const mongoose=require('mongoose')

const Product=require('./models/product')

mongoose.connect(
    'mongodb+srv://ahmed:ioXBmc4kR7MBZYvS@cluster0.phkoggi.mongodb.net/product_test?retryWrites=true&w=majority'
).then(()=>{
    console.log("CONEECTED!!!!!!!!")
}).catch(()=>{
    console.log("FAILED TO CONNECT!!!!!!!!")
})

const createProduct=async(req,res,next)=>{
    const createdProduct=new Product({
        name:req.body.name,
        price:req.body.price
    })

    const result=await createdProduct.save()
    res.json(result)
}

const getProducts=async(req,res,next)=>{
    const products=await Product.find().exec()
    res.json(products)
}

exports.createProduct=createProduct
exports.getProducts=getProducts
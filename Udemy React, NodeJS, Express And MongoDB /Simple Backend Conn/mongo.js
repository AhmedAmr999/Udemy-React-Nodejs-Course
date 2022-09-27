const MongoClient=require('mongodb').MongoClient

const url='mongodb+srv://ahmed:ioXBmc4kR7MBZYvS@cluster0.phkoggi.mongodb.net/?retryWrites=true&w=majority'
//ioXBmc4kR7MBZYvS

const createProduct = async (req, res, next) => {
    const newProduct = {
      name: req.body.name,
      price: req.body.price
    };
    const client = new MongoClient(url);
  
    try {
      await client.connect();
      const db = client.db();
      const result = await db.collection('products').insertOne(newProduct);
      console.log("Added Successfuly!!!!")
    } catch (error) {
        console.log(error)
      return res.json({message: 'Could not store data.'});
    };
    client.close()

    res.json({newProduct});

  }
  
  const getProducts = async (req, res, next) => {
    const client=new MongoClient(url)
    let products
    try {
      await client.connect()
      const db=client.db()
      products=await db.collection('products').find().toArray() //find all products
      console.log("Finded Successfuly!!!!")
    } catch (error) {
      console.log(error)
      return res.json({message: 'Could not retrieve data.'});
    }
    client.close() 
    res.json(products)
  }
  
  exports.createProduct = createProduct;
  exports.getProducts = getProducts;
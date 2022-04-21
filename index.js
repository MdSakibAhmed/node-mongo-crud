const express  = require("express");
const app= express()
const cors = require("cors")
const objectId = require("mongodb").ObjectID


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://rakib234:sakib234@cluster0.zmweg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get("/",(req, res) => {
  // res.send("i am from get");
   //console.log(res.send("I am from get"));
   res.sendFile(__dirname + "/index.html")
})





client.connect(err => {
  const productCollection = client.db("test-crud").collection("products");
  // perform actions on the collection object
  console.log(err)
 app.get("/products",(req, res) => {
  productCollection.find({}).limit(15).toArray((err,documents) =>{
      res.json(documents)
   })
  

 })

 app.get("/product/:id", (req, res) => {
   productCollection.find({ _id : objectId(`${req.params.id}`)}).toArray((err,documents) => {
     res.send(documents[0])

   })

   
 })

  app.post("/addProduct", (req, res) =>  {
   
    const product  =   req.body
    console.log(product);
    //console.log(res.send());
    productCollection.insertOne(product).then(data =>  {
   res.redirect("/")
   console.log(data)}).catch(error => console.log(error))
    
  })

  app.patch("/update/:id", (req,res) => {
    productCollection.updateOne({_id: objectId(req.params.id)},{
      $set:{price:req.body.price,quantity:req.body.quantity}
    }).then(result => {
 res.send(result.modifiedCount > 0)  })

  })

  app.delete("/delete/:id", (req,res) => {
    console.log(req.params.id);
    productCollection.deleteOne({_id: objectId(req.params.id)}).then(result => {
      res.send(result.deletedCount > 0)
    })

  })



        
});


app.listen(4000)
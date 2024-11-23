const express = require('express');

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require('cors');

require("dotenv").config(); 

const app = express();
const port = process.env.PORT || 5000;


const corsOptions = {
    origin: [
      'http://localhost:5173',
      'assainment-11-food-related-007.web.app',
      'assainment-11-food-related-007.firebaseapp.com'

      
    ],
    credentials: true,  
  };
  // MEDDLEWERE
  app.use(cors(corsOptions));
  app.use(express.json());

// MongoDB connection
  const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ensactw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  async function run() {
    try {
       

      // await client.connect();
      const allfodMongoDBstore = client.db("Bite-Bazar").collection("Allfoods");
      const topRelatedAllFood = client.db("Bite-Bazar").collection("topfods");
      const PurchaseFOooodsDB = client.db("Bite-Bazar").collection("Purchase");
      const gallaryfoooodmgDb = client.db("Bite-Bazar").collection("gallary");
      //middleware
    // All foods  
    app.get("/allfoods", async (req, res) => {
      console.log(req.query);
      
      const { search = '', page = 0, size = 10 } = req.query; 
      const parsedfooodPage = parseInt(page);
      const parsedFooddSize = parseInt(size);
     
      const query = {
        name: { $regex: search, $options: 'i' } 
      };
    
      const total = await allfodMongoDBstore.estimatedDocumentCount();
      
      // results
      const result = await allfodMongoDBstore.find(query)
          .skip(parsedfooodPage * parsedFooddSize)
          .limit(parsedFooddSize)
          .toArray();
    
      res.send({ foods: result, total });
    });
    // gallary 
  
      app.get('/gallery' , async(req , res )=>{
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
  
        const skip = (page - 1) * limit;
  
        const result = await gallaryfoooodmgDb.find().skip(skip).limit(limit).toArray();
        console.log(result)
        res.send(result)
      })
      app.post('/gallery' , async(req ,res )=>{
        const data = req.body;
        console.log(data);
        const result = await gallaryfoooodmgDb.insertOne(data);
        console.log(result)
        res.send(result)
      })
      //top fooods
      app.get("/topfoods", async (req, res) => {
        const result = await topRelatedAllFood.find().toArray();
        res.send(result);
      });
  
      //ADD FOOD
      app.post("/addfoods", async (req, res) => {
        const item = req.body;
        console.log(item);
        const result = await allfodMongoDBstore.insertOne(item);
        res.send(result);
      });
  
      app.get("/myfoods/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const result = await allfodMongoDBstore.find(query).toArray();
        console.log(result);
  
        res.send(result);
      });
  
      app.delete("/myfoods/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        console.log(id);
        const result = await allfodMongoDBstore.deleteOne(query);
        console.log(result);
  
        res.send(result);
      });
  
      app.get("/food/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await allfodMongoDBstore.findOne(query);
        console.log(result);
        res.send(result);
      });
  
      app.patch("/update/:id", async (req, res) => {
        const id = new ObjectId(req.params.id);
        console.log(id);
        const query = { _id: id };
        const data = req.body;
        // console.log(data)
  
        const updateDoc = {
          $set: {
            ...data,
          },
        };
        const result = await allfodMongoDBstore.updateOne(query, updateDoc);
        console.log(result);
        res.send(result);
      });
  
      //Purchase
      app.post('/purchase' , async(req , res)=>{
        const data = req.body;
        const result = await PurchaseFOooodsDB.insertOne(data);
        res.send(result)
  
      });
  
    app.get('/purchase/:email' , async(req , res )=>{
      const email = req.params.email;
      console.log(email)
    const query = {email : email}
      const result = await PurchaseFOooodsDB.find(query).toArray()
      // console.log(result);
  
      res.send(result)
    })
  
    app.delete("/purchase/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      // console.log(id);
      const result = await PurchaseFOooodsDB.deleteOne(query);
      console.log(result);
  
      res.send(result);
    });
  
      // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
  }
app.get('/',(req,res)=>{
    res.send('My food related side runing')
})
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`FoodRelated wed side is Runing on port${port}`)
})
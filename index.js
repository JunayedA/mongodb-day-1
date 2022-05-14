const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;
//middleware
app.use(cors());
app.use(express.json());

//mydbuser1
//PCzUnVogrwVopiYg
const uri = "mongodb+srv://mydbuser1:PCzUnVogrwVopiYg@cluster0.eylgj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const database = client.db("foodMaster");
      const usersCollection = database.collection("users");
      //get api
      app.get('/users', async(req, res) =>{
          const cursor = usersCollection.find({});
          const users= await cursor.toArray();
          res.send(users);
      })

      app.get('/users/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const user = await usersCollection.findOne(query)
        console.log('load user with ', id);
        res.send(user)
      })
      // Post api
      app.post('/users', async(req,res) =>{
          const newUser = req.body;
          const result = await usersCollection.insertOne(newUser);
        console.log('got new user', req.body);
        console.log('added user', result)
        res.json(result);
      });
      //delete api
      app.delete('/users/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await usersCollection.deleteOne(query);
          console.log('deleting user withg id', result); 
          res.json(result); 
      })
    }
     finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.get('/', (req, res) =>{
    res.send('running my server')
})

app.listen(port, () =>{
    console.log('hitting to the express')
})
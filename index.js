const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');

require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hjxwn6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const usersCollection = client.db("takarPocket").collection("users");

    app.post('/users', async (req, res) => {
        const user = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.pin, salt);
        const userInfo = {
            name: user.name,
            email: user.email,
            pin: hash,
            role: ""
        }
        // console.log(userInfo);
        const result = await usersCollection.insertOne(user);
        res.send(result);
    })
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('takar pocket server is running');
})

app.listen(port, () => {
    console.log(`takar pocket server running on port: ${port}`);
})

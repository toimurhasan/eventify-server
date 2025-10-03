require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.port || 3000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // connect to db and collection
    const database = client.db("eventify_db");
    const events = database.collection("events");

    // create event
    app.post("/create-event", async (req, res) => {
      console.log(req.body);
      const result = await events.insertOne(req.body);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.listen(port, () => {
  console.log(`running on port ${port}`);
});

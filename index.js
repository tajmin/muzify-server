const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7xlcz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("muzify");
    const songCollection = database.collection("songs");
    const usersCollection = database.collection("users");
    console.log("db connected");

    //GET: All songs
    app.get("/songs", async (req, res) => {
      const cursor = songCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // POST: save user to db
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    //PUT: Update user
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } finally {
    //close db connection
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ah, here We Go!");
});

app.listen(port, () => {
  console.log("Listening at: ", port);
});

import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json()); // Middleware pour parser le JSON
// Servir les fichiers statiques de l'application React build
app.use(express.static("dist"));

const url =
  "mongodb+srv://todo-user1:mdpuser1@cluster0.pth9bwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url);

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}\nvia http://localhost:8080`);
  connectToMongo();
});

// Servir les fichiers statiques de l'application React build
app.use(express.static("dist"));


async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connecté à MongoDB");
  } catch (err) {
    console.error(err);
  }  
}

// Ajouter une nouvelle tâche
app.post("/api/tasks", async (req, res) => {
  try {
    const collection = client.db("test").collection("tasks");
    const result = await collection.insertOne(req.body);
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lire toutes les tâches
app.get("/api/tasks", async (req, res) => {
  try {
    const collection = client.db("test").collection("tasks");
    const tasks = await collection.find({}).toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lire une seule tâche
app.get("/api/tasks/:id", async (req, res) => {
  try {
    const collection = client.db("test").collection("tasks");
    const task = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: "Tâche non trouvée" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour une tâche
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const collection = client.db("test").collection("tasks");
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount > 0) {
      res.json(await collection.findOne({ _id: new ObjectId(req.params.id) }));
    } else {
      res.status(404).json({ error: "Tâche non trouvée" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une tâche
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const collection = client.db("test").collection("tasks");
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.json({ message: "Tâche supprimée avec succès" });
    } else {
      res.status(404).json({ error: "Tâche non trouvée" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
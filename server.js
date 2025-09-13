import e from "express"
import cors from "cors"
import { connect } from "./connect.js"
import { ObjectId } from "mongodb"

const app = e()
app.use(e.json())
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*"
}))
const PORT = process.env.PORT || 3000

app.get("/health", (res) => res.json({ ok: true }))

// Select all
app.get("/stands", async (res) => {
    const db = await connect()
    const docs = await db.collection("stands").find().toArray()
    res.json(docs)
})

// Select one
app.get("/stands/:name", async (req, res) => {
    const db = await connect()
    const doc = await db.collection("stands")
        .findOne({ "data.pageName": (req.params.name) })
    if (!doc) return res.status(404).json({ error: "not found" })
    res.json(doc)
})

// Insert
app.post("/stands", async (req, res) => {
    try {
        const db = await connect()
        const body = req.body
        const result = await db.collection("stands").insertOne(body)
        res.status(201).json({ insertedId: result.insertedId })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "internal" })
    }
})

// Edit
app.put("/stands/:id", async (req, res) => {
    try {
        const db = await connect()
        const result = await db.collection("stands").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        )
        res.json({ modifiedCount: result.modifiedCount })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "internal" })
    }
})

// Delete
app.delete("/stands/:id", async (req, res) => {
    try {
        const db = await connect()
        const result = await db.collection("stands").deleteOne(
            { _id: new ObjectId(req.params.id) }
        )
        res.json({ deletedCount: req.deletedCount })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "internal" })
    }
})

app.listen(PORT, () => { console.log(`Listening on ${PORT}`) })

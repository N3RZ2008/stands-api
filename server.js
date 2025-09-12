import e from "express";
import cors from "cors";
import { connect } from "./connect.js";
import { ObjectId } from "mongodb";

const app = e();
app.use(e.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*"
}))
const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => res.json({ ok:true }));

app.get("/stands", async (req, res) => {
    const db = await connect()
    const docs = await db.collection("stands").find().toArray();
    res.json(docs)
})

app.listen(PORT, () => {console.log(`Listening on ${PORT}`)})

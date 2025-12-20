import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3000

connectDB()

app.get("/", (req: Request, res: Response) => {
  res.send("WELCOME TO BAGVIBE API")
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

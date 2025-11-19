import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import authRoutes from "./routes/auth.js"
import courseRoutes from "./routes/courses.js"
import cartRoutes from "./routes/cart.js"
import orderRoutes from "./routes/orders.js"
import reviewRoutes from "./routes/reviews.js"

const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/reviews", reviewRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running" })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

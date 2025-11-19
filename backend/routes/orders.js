import express from "express"
import { mockOrders, mockCarts } from "../data/mockData.js"

const router = express.Router()

router.post("/create", (req, res) => {
  const { userId, total, items } = req.body

  const order = {
    id: mockOrders.length + 1,
    userId,
    items,
    total,
    status: "completed",
    date: new Date().toISOString(),
  }

  mockOrders.push(order)
  mockCarts[userId] = { items: [], total: 0 }

  res.json({ success: true, order })
})

router.get("/user/:userId", (req, res) => {
  const userOrders = mockOrders.filter((o) => o.userId === Number.parseInt(req.params.userId))
  res.json(userOrders)
})

export default router

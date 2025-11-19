import express from "express"
import { mockCarts, mockCourses } from "../data/mockData.js"

const router = express.Router()

router.get("/:userId", (req, res) => {
  const cart = mockCarts[req.params.userId] || { items: [], total: 0 }
  res.json(cart)
})

router.post("/add", (req, res) => {
  const { userId, courseId } = req.body

  if (!mockCarts[userId]) {
    mockCarts[userId] = { items: [], total: 0 }
  }

  const course = mockCourses.find((c) => c.id === courseId)
  const existingItem = mockCarts[userId].items.find((i) => i.id === courseId)

  if (!existingItem) {
    mockCarts[userId].items.push(course)
    mockCarts[userId].total += course.price
  }

  res.json(mockCarts[userId])
})

router.post("/remove", (req, res) => {
  const { userId, courseId } = req.body

  if (mockCarts[userId]) {
    const item = mockCarts[userId].items.find((i) => i.id === courseId)
    if (item) {
      mockCarts[userId].total -= item.price
      mockCarts[userId].items = mockCarts[userId].items.filter((i) => i.id !== courseId)
    }
  }

  res.json(mockCarts[userId] || { items: [], total: 0 })
})

router.post("/clear", (req, res) => {
  const { userId } = req.body
  mockCarts[userId] = { items: [], total: 0 }
  res.json(mockCarts[userId])
})

export default router

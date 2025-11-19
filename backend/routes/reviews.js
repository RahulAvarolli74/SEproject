import express from "express"
import { mockReviews } from "../data/mockData.js"

const router = express.Router()

router.get("/course/:courseId", (req, res) => {
  const courseReviews = mockReviews.filter((r) => r.courseId === Number.parseInt(req.params.courseId))
  res.json(courseReviews)
})

router.post("/add", (req, res) => {
  const { courseId, userId, author, rating, comment } = req.body

  const review = {
    id: mockReviews.length + 1,
    courseId,
    userId,
    author,
    rating,
    comment,
    helpful: 0,
  }

  mockReviews.push(review)
  res.json(review)
})

export default router

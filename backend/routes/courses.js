import express from "express"
import { mockCourses } from "../data/mockData.js"

const router = express.Router()

router.get("/", (req, res) => {
  const { category, level, search, minPrice, maxPrice, sort } = req.query

  let filtered = [...mockCourses]

  if (search) {
    filtered = filtered.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
  }

  if (category) {
    filtered = filtered.filter((c) => c.category === category)
  }

  if (level) {
    filtered = filtered.filter((c) => c.level === level)
  }

  if (minPrice || maxPrice) {
    filtered = filtered.filter(
      (c) => (minPrice ? c.price >= minPrice : true) && (maxPrice ? c.price <= maxPrice : true),
    )
  }

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price)
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price)
  } else if (sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating)
  }

  res.json(filtered)
})

router.get("/:id", (req, res) => {
  const course = mockCourses.find((c) => c.id === Number.parseInt(req.params.id))
  if (course) {
    res.json(course)
  } else {
    res.status(404).json({ message: "Course not found" })
  }
})

export default router

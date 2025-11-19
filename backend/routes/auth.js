import express from "express"
import { mockUsers } from "../data/mockData.js"

const router = express.Router()

router.post("/login", (req, res) => {
  const { email, password } = req.body

  const user = Object.values(mockUsers).find((u) => u.email === email && u.password === password)

  if (user) {
    const token = "fake-jwt-token-" + user.id
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" })
  }
})

router.post("/signup", (req, res) => {
  const { email, password, name, role } = req.body

  const newUser = {
    id: Object.keys(mockUsers).length + 1,
    email,
    password,
    name,
    role: role || "student",
  }

  mockUsers["user" + newUser.id] = newUser
  const token = "fake-jwt-token-" + newUser.id

  res.json({
    success: true,
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
  })
})

router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out" })
})

export default router

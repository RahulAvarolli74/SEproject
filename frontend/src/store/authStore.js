import { create } from "zustand"

export const useAuthStore = create((set) => ({
  user: null,
  token: null,

  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),

  login: async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error("Login failed")

      const data = await res.json()
      set({ user: data, token: data.token })
      localStorage.setItem("token", data.token)
      return data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  signup: async (email, password, name, role) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      })

      if (!res.ok) throw new Error("Signup failed")

      const data = await res.json()
      set({ user: data, token: data.token })
      localStorage.setItem("token", data.token)
      return data
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  },
}))

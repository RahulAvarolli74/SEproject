import { create } from "zustand"

export const useCartStore = create((set) => ({
  items: JSON.parse(localStorage.getItem("cart")) || [],

  addItem: (course) =>
    set((state) => {
      const exists = state.items.find((item) => item.id === course.id)
      const updated = exists ? state.items : [...state.items, course]
      localStorage.setItem("cart", JSON.stringify(updated))
      return { items: updated }
    }),

  removeItem: (courseId) =>
    set((state) => {
      const updated = state.items.filter((item) => item.id !== courseId)
      localStorage.setItem("cart", JSON.stringify(updated))
      return { items: updated }
    }),

  clearCart: () => {
    localStorage.setItem("cart", JSON.stringify([]))
    set({ items: [] })
  },

  getTotal: () => {
    return set((state) => {
      const total = state.items.reduce((sum, item) => sum + item.price, 0)
      return total
    })
  },
}))

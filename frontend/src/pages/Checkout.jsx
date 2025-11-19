"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useCartStore } from "../store/cartStore"
import { useAuthStore } from "../store/authStore"

function Checkout() {
  const navigate = useNavigate()
  const { items, total, clear } = useCartStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName) newErrors.fullName = "Full name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.address) newErrors.address = "Address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.zipcode) newErrors.zipcode = "Zip code is required"
    if (!formData.cardName) newErrors.cardName = "Cardholder name is required"
    if (!formData.cardNumber || formData.cardNumber.length < 16) newErrors.cardNumber = "Valid card number required"
    if (!formData.expiry) newErrors.expiry = "Expiry date is required"
    if (!formData.cvv || formData.cvv.length < 3) newErrors.cvv = "Valid CVV required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const res = await axios.post("/api/orders/create", {
        userId: user.id,
        total,
        items,
      })

      if (res.data.success) {
        setOrderId(res.data.order.id)
        setOrderSuccess(true)
        clear()
      }
    } catch (error) {
      console.log("[v0] Order creation error:", error)
      alert("Failed to process order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center py-8 px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <p className="text-gray-600 mb-4">Please login to complete checkout</p>
          <a href="/login" className="btn-primary inline-block">
            Login to Your Account
          </a>
        </div>
      </div>
    )
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center py-8 px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold mb-2 text-green-600">Order Successful!</h1>
          <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
          <p className="text-sm text-gray-500 mb-6">Order ID: #{orderId}</p>
          <p className="text-gray-700 mb-6">
            Your courses are now available in your dashboard. Check your email for confirmation.
          </p>
          <a href="/dashboard" className="btn-primary inline-block w-full text-center">
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center py-8 px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <a href="/catalog" className="btn-primary inline-block">
            Browse Courses
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="md:col-span-2">
            {/* Billing Address */}
            <div className="card p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Billing Address</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`input-field ${errors.fullName ? "border-red-500" : ""}`}
                  />
                  {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St"
                    className={`input-field ${errors.address ? "border-red-500" : ""}`}
                  />
                  {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`input-field ${errors.city ? "border-red-500" : ""}`}
                    />
                    {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`input-field ${errors.state ? "border-red-500" : ""}`}
                    />
                    {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Zip Code</label>
                    <input
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleChange}
                      className={`input-field ${errors.zipcode ? "border-red-500" : ""}`}
                    />
                    {errors.zipcode && <p className="text-red-600 text-xs mt-1">{errors.zipcode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="card p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Payment Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    className={`input-field ${errors.cardName ? "border-red-500" : ""}`}
                  />
                  {errors.cardName && <p className="text-red-600 text-xs mt-1">{errors.cardName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
                      handleChange({ ...e, target: { ...e.target, value } })
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength="16"
                    className={`input-field ${errors.cardNumber ? "border-red-500" : ""}`}
                  />
                  {errors.cardNumber && <p className="text-red-600 text-xs mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className={`input-field ${errors.expiry ? "border-red-500" : ""}`}
                    />
                    {errors.expiry && <p className="text-red-600 text-xs mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="3"
                      className={`input-field ${errors.cvv ? "border-red-500" : ""}`}
                    />
                    {errors.cvv && <p className="text-red-600 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Review</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                {items.map((course) => (
                  <div key={course.id} className="flex justify-between">
                    <span className="text-gray-600 line-clamp-1">{course.title}</span>
                    <span className="font-semibold flex-shrink-0">${course.price}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-secondary">${total.toFixed(2)}</p>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? "Processing..." : "Complete Purchase"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">✓ Secure SSL encrypted payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

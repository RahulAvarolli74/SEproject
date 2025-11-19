"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCartStore } from "../store/cartStore"
import { useAuthStore } from "../store/authStore"

function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, clear, total } = useCartStore()
  const { user } = useAuthStore()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [error, setError] = useState("")

  const applyCoupon = () => {
    setError("")

    if (couponCode === "SAVE10") {
      setDiscount(total * 0.1)
    } else if (couponCode === "SAVE20") {
      setDiscount(total * 0.2)
    } else if (couponCode) {
      setError("Invalid coupon code")
    }
  }

  const finalTotal = total - discount

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            {items.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-600 mb-4">Your cart is empty</p>
                <Link to="/catalog" className="btn-primary inline-block">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="card p-6 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Courses ({items.length})</h2>
                    <button
                      onClick={() => {
                        if (window.confirm("Clear all items from cart?")) {
                          clear()
                        }
                      }}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      Clear Cart
                    </button>
                  </div>

                  <div className="space-y-4">
                    {items.map((course) => (
                      <div key={course.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <Link to={`/course/${course.id}`} className="font-bold hover:text-secondary">
                            {course.title}
                          </Link>
                          <p className="text-sm text-gray-600">{course.instructor}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="text-sm font-semibold">{course.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-secondary mb-2">${course.price}</p>
                          <button
                            onClick={() => removeItem(course.id)}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coupon */}
                <div className="card p-6">
                  <h3 className="font-bold mb-4">Promo Code</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="input-field"
                    />
                    <button onClick={applyCoupon} className="btn-primary">
                      Apply
                    </button>
                  </div>
                  {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                  {discount > 0 && (
                    <p className="text-green-600 text-sm mt-2">Coupon applied! Saving ${discount.toFixed(2)}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-3">Try: SAVE10 (10% off) or SAVE20 (20% off)</p>
                </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {items.length === 0 ? (
                <p className="text-gray-600">Add courses to get started</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 pb-6 border-b">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700 mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-secondary">${finalTotal.toFixed(2)}</p>
                  </div>

                  {user ? (
                    <Link to="/checkout" className="btn-primary w-full block text-center mb-3">
                      Proceed to Checkout
                    </Link>
                  ) : (
                    <Link to="/login" className="btn-primary w-full block text-center mb-3">
                      Login to Checkout
                    </Link>
                  )}

                  <Link to="/catalog" className="btn-outline w-full block text-center">
                    Continue Shopping
                  </Link>

                  <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 text-center">
                    <p>✓ Secure checkout</p>
                    <p>✓ Lifetime access</p>
                    <p>✓ 30-day money back guarantee</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

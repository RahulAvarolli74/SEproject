"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuthStore } from "../store/authStore"

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState("courses")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "Your bio here",
  })

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/orders/user/${user.id}`)
        setOrders(res.data)
        setLoading(false)
      } catch (error) {
        console.log("[v0] Error fetching orders:", error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2 capitalize">
                  {user.role}
                </span>
              </div>

              <nav className="space-y-2 mb-6">
                {[
                  { id: "courses", label: "My Courses" },
                  { id: "orders", label: "Orders" },
                  { id: "wishlist", label: "Wishlist" },
                  { id: "settings", label: "Settings" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === item.id ? "bg-secondary text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <button onClick={handleLogout} className="w-full btn-outline text-red-600 border-red-600">
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {/* My Courses Tab */}
            {activeTab === "courses" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Courses</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {loading ? (
                    <p className="text-gray-600">Loading courses...</p>
                  ) : orders.length === 0 ? (
                    <div className="col-span-2 card p-12 text-center">
                      <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
                      <a href="/catalog" className="btn-primary inline-block">
                        Explore Courses
                      </a>
                    </div>
                  ) : (
                    orders.map((order) =>
                      order.items.map((course) => (
                        <div
                          key={`${order.id}-${course.id}`}
                          className="card overflow-hidden hover:shadow-lg transition"
                        >
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-bold mb-2 line-clamp-2">{course.title}</h3>
                            <div className="flex items-center gap-1 mb-3">
                              <span className="text-yellow-500">★</span>
                              <span className="font-semibold text-sm">{course.rating}</span>
                            </div>
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>45%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-secondary h-2 rounded-full" style={{ width: "45%" }}></div>
                              </div>
                            </div>
                            <a href={`/course/${course.id}`} className="btn-primary w-full block text-center text-sm">
                              Continue Learning
                            </a>
                          </div>
                        </div>
                      )),
                    )
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Order History</h2>
                {loading ? (
                  <p className="text-gray-600">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="card p-12 text-center">
                    <p className="text-gray-600 mb-4">No orders yet.</p>
                    <a href="/catalog" className="btn-primary inline-block">
                      Start Shopping
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="card p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-bold">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded capitalize">
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4 pb-4 border-b">
                          {order.items.map((item) => (
                            <p key={item.id} className="text-sm text-gray-700">
                              {item.title}
                            </p>
                          ))}
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-gray-600">Total Amount</p>
                          <p className="text-2xl font-bold text-secondary">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Wishlist</h2>
                <div className="card p-12 text-center">
                  <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
                  <a href="/catalog" className="btn-primary inline-block">
                    Explore Courses
                  </a>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Profile Settings */}
                  <div className="card p-6">
                    <h3 className="font-bold mb-4">Profile Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          className="input-field min-h-24"
                        />
                      </div>
                      <button className="btn-primary">Save Changes</button>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="card p-6">
                    <h3 className="font-bold mb-4">Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-gray-700">Email me about new courses</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-gray-700">Course updates and announcements</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-gray-700">Marketing and promotional emails</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

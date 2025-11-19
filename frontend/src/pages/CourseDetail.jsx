"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { useCartStore } from "../store/cartStore"
import { useAuthStore } from "../store/authStore"

function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [reviewLoading, setReviewLoading] = useState(false)

  const { addItem, items } = useCartStore()
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`)
        setCourse(res.data)

        const reviewsRes = await axios.get(`/api/reviews/course/${id}`)
        setReviews(reviewsRes.data)

        setLoading(false)
      } catch (error) {
        console.log("[v0] Error fetching course:", error)
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  const handleAddToCart = () => {
    if (course) {
      addItem(course)
      alert("Course added to cart!")
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      alert("Please login to leave a review")
      return
    }

    setReviewLoading(true)
    try {
      const res = await axios.post("/api/reviews/add", {
        courseId: course.id,
        userId: user.id,
        author: user.name,
        rating: newReview.rating,
        comment: newReview.comment,
      })

      setReviews([...reviews, res.data])
      setNewReview({ rating: 5, comment: "" })
      alert("Review submitted successfully!")
    } catch (error) {
      console.log("[v0] Error submitting review:", error)
      alert("Failed to submit review")
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading course details...</div>
  }

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">Course not found</div>
  }

  const isInCart = items.some((item) => item.id === course.id)

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <img
              src={course.image || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Sidebar */}
          <div className="card p-6 h-fit">
            <h1 className="text-2xl font-bold mb-4">{course.title}</h1>

            <div className="mb-4">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="font-bold">{course.rating}</span>
                <span className="text-gray-500">({course.reviews} reviews)</span>
              </div>
              <p className="text-gray-600 text-sm">{course.students.toLocaleString()} students enrolled</p>
            </div>

            <div className="border-t border-b py-4 mb-4">
              <p className="text-3xl font-bold text-secondary mb-2">${course.price}</p>
              <p className="text-gray-600 text-sm">
                {course.duration} • {course.level}
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">📚</span>
                <span>{course.lessons} lessons</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">⏱️</span>
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">📊</span>
                <span>{course.level} Level</span>
              </div>
            </div>

            {isInCart ? (
              <Link to="/cart" className="btn-primary w-full block text-center">
                Go to Cart
              </Link>
            ) : (
              <button onClick={handleAddToCart} className="btn-primary w-full mb-3">
                Add to Cart
              </button>
            )}

            <button className="btn-outline w-full">Add to Wishlist</button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
              <p className="text-gray-700">
                <strong>Instructor:</strong> {course.instructor}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b mb-6">
            {["overview", "curriculum", "reviews", "qa"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold border-b-2 transition ${
                  activeTab === tab
                    ? "border-secondary text-secondary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="card p-6">
              <h3 className="text-2xl font-bold mb-4">About this course</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">{course.description}</p>

              <h4 className="text-xl font-bold mb-4">What you'll learn</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Complete understanding of the core concepts</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Build real-world projects and applications</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Master best practices and industry standards</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Get a certificate of completion</span>
                </li>
              </ul>
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === "curriculum" && (
            <div className="card p-6">
              <h3 className="text-2xl font-bold mb-4">Course Curriculum</h3>
              <div className="space-y-3">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">
                            Section {idx + 1}: {module.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {module.lessons} lessons • {module.duration}
                          </p>
                        </div>
                        <span className="text-gray-400">›</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Curriculum details coming soon.</p>
                )}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="card p-6">
              <h3 className="text-2xl font-bold mb-6">Reviews</h3>

              {user ? (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Leave a Review</h4>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number.parseInt(e.target.value) })}
                      className="input-field"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={3}>3 - Good</option>
                      <option value={2}>2 - Fair</option>
                      <option value={1}>1 - Poor</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Your Review</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your thoughts about this course..."
                      className="input-field min-h-24"
                      required
                    />
                  </div>
                  <button type="submit" disabled={reviewLoading} className="btn-primary">
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-gray-700">
                    Please{" "}
                    <Link to="/login" className="text-secondary font-semibold">
                      login
                    </Link>{" "}
                    to leave a review.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-semibold">{review.author}</h5>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{review.helpful} helpful</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No reviews yet. Be the first to review this course!</p>
                )}
              </div>
            </div>
          )}

          {/* Q&A Tab */}
          {activeTab === "qa" && (
            <div className="card p-6">
              <h3 className="text-2xl font-bold mb-4">Questions & Answers</h3>
              <p className="text-gray-600 mb-4">Have questions about this course? Ask here!</p>

              {user ? (
                <form className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <textarea placeholder="Ask your question..." className="input-field min-h-20 mb-2" />
                  <button className="btn-primary">Post Question</button>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-gray-700">
                    Please{" "}
                    <Link to="/login" className="text-secondary font-semibold">
                      login
                    </Link>{" "}
                    to ask a question.
                  </p>
                </div>
              )}

              <div className="text-gray-600 text-center py-8">No questions yet. Be the first to ask!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseDetail

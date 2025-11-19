"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function Catalog() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    minPrice: "",
    maxPrice: "",
    sort: "recommended",
  })
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()

        if (search) params.append("search", search)
        if (filters.category) params.append("category", filters.category)
        if (filters.level) params.append("level", filters.level)
        if (filters.minPrice) params.append("minPrice", filters.minPrice)
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice)
        if (filters.sort) params.append("sort", filters.sort)

        const res = await axios.get(`/api/courses?${params}`)
        setCourses(res.data)
        setLoading(false)
      } catch (error) {
        console.log("[v0] Error fetching courses:", error)
        setLoading(false)
      }
    }

    fetchCourses()
  }, [search, filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({ category: "", level: "", minPrice: "", maxPrice: "", sort: "recommended" })
  }

  const categories = ["Web Development", "Backend", "Programming", "Design", "Full Stack"]
  const levels = ["Beginner", "Intermediate", "Advanced"]

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
          <div className="bg-white rounded-lg shadow-md p-4">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${mobileFilterOpen ? "block" : "hidden"} md:block md:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="text-2xl">
                  ×
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-primary">Category</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={filters.category === cat}
                        onChange={handleFilterChange}
                        className="cursor-pointer"
                      />
                      <span className="text-gray-700">{cat}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ""}
                      onChange={handleFilterChange}
                      className="cursor-pointer"
                    />
                    <span className="text-gray-700">All Categories</span>
                  </label>
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-6 pb-6 border-b">
                <h4 className="font-semibold mb-3 text-primary">Level</h4>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="level"
                        value={level}
                        checked={filters.level === level}
                        onChange={handleFilterChange}
                        className="cursor-pointer"
                      />
                      <span className="text-gray-700">{level}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="level"
                      value=""
                      checked={filters.level === ""}
                      onChange={handleFilterChange}
                      className="cursor-pointer"
                    />
                    <span className="text-gray-700">All Levels</span>
                  </label>
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6 pb-6 border-b">
                <h4 className="font-semibold mb-3 text-primary">Price Range</h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="input-field w-20 text-sm"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="input-field w-20 text-sm"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-primary">Sort By</h4>
                <select name="sort" value={filters.sort} onChange={handleFilterChange} className="input-field w-full">
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <button onClick={handleClearFilters} className="w-full btn-outline text-primary">
                Clear Filters
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 md:hidden">
              <span className="font-semibold">{courses.length} courses</span>
              <button onClick={() => setMobileFilterOpen(!mobileFilterOpen)} className="btn-secondary text-sm">
                Filters
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No courses found matching your criteria.</p>
                <button onClick={handleClearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    className="card overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-secondary font-semibold bg-blue-50 px-2 py-1 rounded">
                          {course.category}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{course.level}</span>
                      </div>

                      <h3 className="font-bold text-base mb-3 line-clamp-2 min-h-14">{course.title}</h3>

                      <div className="flex items-center gap-1 mb-3">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="font-semibold text-sm">{course.rating}</span>
                        <span className="text-gray-500 text-xs">({course.reviews})</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-secondary">${course.price}</span>
                        <span className="text-xs text-gray-600">{course.lessons} lessons</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Catalog
